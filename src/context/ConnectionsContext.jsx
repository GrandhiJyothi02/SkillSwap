import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";

const CONNECTIONS_KEY = "skillswap:connections";
const MESSAGES_KEY = "skillswap:messages";

const ConnectionsContext = createContext(null);

function readConnections() {
  try {
    return JSON.parse(localStorage.getItem(CONNECTIONS_KEY)) || [];
  } catch {
    return [];
  }
}

function writeConnections(connections) {
  localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(connections));
}

function readMessages() {
  try {
    return JSON.parse(localStorage.getItem(MESSAGES_KEY)) || [];
  } catch {
    return [];
  }
}

function writeMessages(messages) {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

function otherParty(connection, myEmail) {
  return connection.fromEmail === myEmail ? connection.toEmail : connection.fromEmail;
}

export function ConnectionsProvider({ children }) {
  const { user } = useAuth();
  const myEmail = user?.email || null;

  const [connections, setConnections] = useState(readConnections);
  const [messages, setMessages] = useState(readMessages);

  // Keep in sync across tabs/windows, since everything lives in localStorage.
  useEffect(() => {
    function onStorage(e) {
      if (e.key === CONNECTIONS_KEY) setConnections(readConnections());
      if (e.key === MESSAGES_KEY) setMessages(readMessages());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persistConnections = useCallback((next) => {
    writeConnections(next);
    setConnections(next);
  }, []);

  const persistMessages = useCallback((next) => {
    writeMessages(next);
    setMessages(next);
  }, []);

  const findConnectionBetween = useCallback(
    (emailA, emailB) =>
      connections.find(
        (c) =>
          (c.fromEmail === emailA && c.toEmail === emailB) ||
          (c.fromEmail === emailB && c.toEmail === emailA)
      ) || null,
    [connections]
  );

  const getStatusWith = useCallback(
    (otherEmail) => {
      if (!myEmail || !otherEmail || otherEmail === myEmail) return { status: "self" };
      const connection = findConnectionBetween(myEmail, otherEmail);
      if (!connection) return { status: "none" };

      if (connection.status === "accepted") return { status: "accepted", connection };
      if (connection.status === "rejected") return { status: "rejected", connection };
      if (connection.status === "pending") {
        return {
          status: connection.fromEmail === myEmail ? "pending_sent" : "pending_received",
          connection,
        };
      }
      return { status: "none" };
    },
    [myEmail, findConnectionBetween]
  );

  function sendRequest(toEmailRaw) {
    if (!myEmail) return { error: "You need to be signed in to connect." };
    const toEmail = toEmailRaw.trim().toLowerCase();
    if (toEmail === myEmail) return { error: "You can't connect with yourself." };

    const existing = findConnectionBetween(myEmail, toEmail);

    if (existing && existing.status === "pending") {
      return { error: "A connection request is already pending." };
    }
    if (existing && existing.status === "accepted") {
      return { error: "You're already connected." };
    }

    let next;
    if (existing) {
      // Re-open a previously rejected connection as a fresh request.
      next = connections.map((c) =>
        c.id === existing.id
          ? { ...c, fromEmail: myEmail, toEmail, status: "pending", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
          : c
      );
    } else {
      const newConnection = {
        id: `conn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        fromEmail: myEmail,
        toEmail,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      next = [...connections, newConnection];
    }

    persistConnections(next);
    return { success: true };
  }

  function acceptRequest(connectionId) {
    const target = connections.find((c) => c.id === connectionId);
    if (!target || target.toEmail !== myEmail || target.status !== "pending") {
      return { error: "That request can't be accepted." };
    }
    persistConnections(
      connections.map((c) =>
        c.id === connectionId ? { ...c, status: "accepted", updatedAt: new Date().toISOString() } : c
      )
    );
    return { success: true };
  }

  function rejectRequest(connectionId) {
    const target = connections.find((c) => c.id === connectionId);
    if (!target || target.toEmail !== myEmail || target.status !== "pending") {
      return { error: "That request can't be rejected." };
    }
    persistConnections(
      connections.map((c) =>
        c.id === connectionId ? { ...c, status: "rejected", updatedAt: new Date().toISOString() } : c
      )
    );
    return { success: true };
  }

  function cancelRequest(connectionId) {
    const target = connections.find((c) => c.id === connectionId);
    if (!target || target.fromEmail !== myEmail || target.status !== "pending") {
      return { error: "That request can't be cancelled." };
    }
    persistConnections(connections.filter((c) => c.id !== connectionId));
    return { success: true };
  }

  const myConnections = myEmail ? connections.filter((c) => c.fromEmail === myEmail || c.toEmail === myEmail) : [];
  const incomingRequests = myConnections.filter((c) => c.status === "pending" && c.toEmail === myEmail);
  const outgoingRequests = myConnections.filter((c) => c.status === "pending" && c.fromEmail === myEmail);
  const acceptedConnections = myConnections.filter((c) => c.status === "accepted");

  // ---- messaging (gated on an accepted connection) ----

  function getMessagesFor(connectionId) {
    return messages
      .filter((m) => m.connectionId === connectionId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  function sendMessage(connectionId, text) {
    if (!myEmail) return { error: "You need to be signed in to message." };
    const trimmed = text.trim();
    if (!trimmed) return { error: "Message can't be empty." };

    const connection = connections.find((c) => c.id === connectionId);
    if (!connection || connection.status !== "accepted") {
      return { error: "You can only message connections you're accepted with." };
    }
    if (connection.fromEmail !== myEmail && connection.toEmail !== myEmail) {
      return { error: "Not authorized for this conversation." };
    }

    const newMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      connectionId,
      fromEmail: myEmail,
      toEmail: otherParty(connection, myEmail),
      text: trimmed,
      createdAt: new Date().toISOString(),
      readAt: null,
    };

    persistMessages([...messages, newMessage]);
    return { success: true, message: newMessage };
  }

  function markConversationRead(connectionId) {
    if (!myEmail) return;
    let changed = false;
    const next = messages.map((m) => {
      if (m.connectionId === connectionId && m.toEmail === myEmail && !m.readAt) {
        changed = true;
        return { ...m, readAt: new Date().toISOString() };
      }
      return m;
    });
    if (changed) persistMessages(next);
  }

  function getConversations() {
    return acceptedConnections
      .map((c) => {
        const email = otherParty(c, myEmail);
        const convoMessages = getMessagesFor(c.id);
        const lastMessage = convoMessages[convoMessages.length - 1] || null;
        const unreadCount = convoMessages.filter((m) => m.toEmail === myEmail && !m.readAt).length;
        return { connection: c, email, lastMessage, unreadCount };
      })
      .sort((a, b) => {
        const aTime = a.lastMessage?.createdAt || a.connection.updatedAt;
        const bTime = b.lastMessage?.createdAt || b.connection.updatedAt;
        return new Date(bTime) - new Date(aTime);
      });
  }

  const totalUnread = myEmail ? messages.filter((m) => m.toEmail === myEmail && !m.readAt).length : 0;

  const value = {
    getStatusWith,
    sendRequest,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    incomingRequests,
    outgoingRequests,
    acceptedConnections,
    getMessagesFor,
    sendMessage,
    markConversationRead,
    getConversations,
    totalUnread,
  };

  return <ConnectionsContext.Provider value={value}>{children}</ConnectionsContext.Provider>;
}

export function useConnections() {
  const ctx = useContext(ConnectionsContext);
  if (!ctx) throw new Error("useConnections must be used within ConnectionsProvider");
  return ctx;
}
