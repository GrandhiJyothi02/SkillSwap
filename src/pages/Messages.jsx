import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Send, MessageCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useConnections } from "../context/ConnectionsContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

function initialsOf(name) {
  return (name || "?")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function Messages() {
  const { email: activeEmail } = useParams();
  const { user, findUserByEmail } = useAuth();
  const { getConversations, getMessagesFor, sendMessage, markConversationRead, getStatusWith } = useConnections();
  const toast = useToast();
  const navigate = useNavigate();

  const [draft, setDraft] = useState("");
  const scrollRef = useRef(null);

  const conversations = getConversations();

  const activeConversation = useMemo(
    () => conversations.find((c) => c.email === activeEmail) || null,
    [conversations, activeEmail]
  );

  // If the URL points at someone who isn't (or isn't yet) an accepted
  // connection, fall back gracefully instead of rendering a broken chat.
  const activeStatus = activeEmail ? getStatusWith(activeEmail).status : null;
  const activePerson = activeEmail ? findUserByEmail(activeEmail) : null;

  const messages = activeConversation ? getMessagesFor(activeConversation.connection.id) : [];

  useEffect(() => {
    if (activeConversation) {
      markConversationRead(activeConversation.connection.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversation?.connection.id, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  function handleSend(e) {
    e.preventDefault();
    if (!activeConversation) return;
    const result = sendMessage(activeConversation.connection.id, draft);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    setDraft("");
  }

  return (
    <div>
      <p className="page-eyebrow">Inbox</p>
      <h1 className="page-title">Messages</h1>
      <p className="page-sub">Chat with members you're connected with.</p>

      <div className="messages-shell panel" style={{ marginTop: "1.5rem" }}>
        <aside className="conversation-list">
          {conversations.length === 0 ? (
            <p className="empty-note">
              No conversations yet — connect with a tutor first, then message them once they accept.
            </p>
          ) : (
            conversations.map((c) => {
              const person = findUserByEmail(c.email);
              if (!person) return null;
              const isActive = c.email === activeEmail;
              return (
                <button
                  key={c.connection.id}
                  className={"conversation-item" + (isActive ? " active" : "")}
                  onClick={() => navigate(`/dashboard/messages/${encodeURIComponent(c.email)}`)}
                >
                  <span className="avatar-fill ember-fill" style={{ width: "2.5rem", height: "2.5rem", fontSize: "0.8rem" }}>
                    {initialsOf(person.fullName)}
                  </span>
                  <span className="conversation-item-body">
                    <span className="conversation-item-top">
                      <span className="conversation-item-name">{person.fullName}</span>
                      {c.lastMessage && <span className="conversation-item-time">{formatTime(c.lastMessage.createdAt)}</span>}
                    </span>
                    <span className="conversation-item-preview">
                      {c.lastMessage ? c.lastMessage.text : "Say hello 👋"}
                    </span>
                  </span>
                  {c.unreadCount > 0 && <span className="unread-dot">{c.unreadCount}</span>}
                </button>
              );
            })
          )}
        </aside>

        <section className="chat-area">
          {!activeEmail ? (
            <div className="chat-empty">
              <MessageCircle size={32} color="var(--faint-foreground)" />
              <p className="empty-note">Select a conversation to start chatting.</p>
            </div>
          ) : activeStatus !== "accepted" || !activePerson ? (
            <div className="chat-empty">
              <MessageCircle size={32} color="var(--faint-foreground)" />
              <p className="empty-note">
                {activePerson
                  ? `You need to be connected with ${activePerson.fullName} before you can message them.`
                  : "You need to be connected before you can message this member."}
              </p>
              {activePerson && (
                <Link to={`/dashboard/tutors/${encodeURIComponent(activePerson.email)}`} className="btn btn-primary btn-sm">
                  View profile
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="chat-header">
                <Link to={`/dashboard/tutors/${encodeURIComponent(activePerson.email)}`} style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <span className="avatar-fill ember-fill" style={{ width: "2.25rem", height: "2.25rem", fontSize: "0.75rem" }}>
                    {initialsOf(activePerson.fullName)}
                  </span>
                  <div>
                    <p style={{ fontSize: "0.9rem", fontWeight: 600 }}>{activePerson.fullName}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                      {(activePerson.skills || []).join(", ") || "SkillSwap member"}
                    </p>
                  </div>
                </Link>
              </div>

              <div className="chat-messages" ref={scrollRef}>
                {messages.length === 0 ? (
                  <p className="empty-note">No messages yet — say hello to {activePerson.fullName.split(" ")[0]}.</p>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className={"chat-bubble-row" + (m.fromEmail === user.email ? " mine" : "")}>
                      <div className="chat-bubble">
                        <p>{m.text}</p>
                        <span className="chat-bubble-time">{formatTime(m.createdAt)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form className="chat-input-row" onSubmit={handleSend}>
                <input
                  className="field-input"
                  placeholder={`Message ${activePerson.fullName.split(" ")[0]}…`}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" disabled={!draft.trim()}>
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
