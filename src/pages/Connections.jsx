import { Link } from "react-router-dom";
import { Check, X, MessageCircle } from "lucide-react";
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

export default function Connections() {
  const { user, findUserByEmail } = useAuth();
  const { incomingRequests, outgoingRequests, acceptedConnections, acceptRequest, rejectRequest, cancelRequest } =
    useConnections();
  const toast = useToast();

  function personFor(connection, myPerspectiveEmailKey) {
    return findUserByEmail(connection[myPerspectiveEmailKey]);
  }

  return (
    <div>
      <p className="page-eyebrow">Network</p>
      <h1 className="page-title">Connections</h1>
      <p className="page-sub">Manage your incoming requests, pending invites, and connected members.</p>

      <p className="section-title" style={{ marginTop: "2rem" }}>
        Incoming requests {incomingRequests.length > 0 && `(${incomingRequests.length})`}
      </p>
      <div style={{ marginTop: "0.75rem" }}>
        {incomingRequests.length === 0 ? (
          <p className="empty-note">No incoming requests right now.</p>
        ) : (
          incomingRequests.map((c) => {
            const person = personFor(c, "fromEmail");
            if (!person) return null;
            return (
              <div key={c.id} className="list-row">
                <Link to={`/dashboard/tutors/${encodeURIComponent(person.email)}`} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span className="avatar-fill ember-fill" style={{ width: "2.25rem", height: "2.25rem", fontSize: "0.75rem" }}>
                    {initialsOf(person.fullName)}
                  </span>
                  <div>
                    <p className="list-row-title">{person.fullName}</p>
                    <p className="list-row-sub">wants to connect · teaches {(person.skills || []).join(", ") || "—"}</p>
                  </div>
                </Link>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      const r = acceptRequest(c.id);
                      if (r.error) toast.error(r.error);
                      else toast.success(`You're now connected with ${person.fullName}`);
                    }}
                  >
                    <Check size={16} /> Accept
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      const r = rejectRequest(c.id);
                      if (r.error) toast.error(r.error);
                      else toast.success("Request declined");
                    }}
                  >
                    <X size={16} /> Reject
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <p className="section-title" style={{ marginTop: "2rem" }}>
        Sent requests {outgoingRequests.length > 0 && `(${outgoingRequests.length})`}
      </p>
      <div style={{ marginTop: "0.75rem" }}>
        {outgoingRequests.length === 0 ? (
          <p className="empty-note">You haven't sent any requests yet.</p>
        ) : (
          outgoingRequests.map((c) => {
            const person = personFor(c, "toEmail");
            if (!person) return null;
            return (
              <div key={c.id} className="list-row">
                <Link to={`/dashboard/tutors/${encodeURIComponent(person.email)}`} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span className="avatar-fill ember-fill" style={{ width: "2.25rem", height: "2.25rem", fontSize: "0.75rem" }}>
                    {initialsOf(person.fullName)}
                  </span>
                  <div>
                    <p className="list-row-title">{person.fullName}</p>
                    <p className="list-row-sub">Waiting for a response</p>
                  </div>
                </Link>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    const r = cancelRequest(c.id);
                    if (r.error) toast.error(r.error);
                    else toast.success("Request cancelled");
                  }}
                >
                  Cancel
                </button>
              </div>
            );
          })
        )}
      </div>

      <p className="section-title" style={{ marginTop: "2rem" }}>
        Your connections {acceptedConnections.length > 0 && `(${acceptedConnections.length})`}
      </p>
      <div style={{ marginTop: "0.75rem" }}>
        {acceptedConnections.length === 0 ? (
          <p className="empty-note">No connections yet — head to Explore to find a tutor.</p>
        ) : (
          acceptedConnections.map((c) => {
            const otherEmail = c.fromEmail === user?.email ? c.toEmail : c.fromEmail;
            const person = findUserByEmail(otherEmail);
            if (!person) return null;
            return (
              <div key={c.id} className="list-row">
                <Link to={`/dashboard/tutors/${encodeURIComponent(person.email)}`} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span className="avatar-fill ember-fill" style={{ width: "2.25rem", height: "2.25rem", fontSize: "0.75rem" }}>
                    {initialsOf(person.fullName)}
                  </span>
                  <div>
                    <p className="list-row-title">{person.fullName}</p>
                    <p className="list-row-sub">teaches {(person.skills || []).join(", ") || "—"}</p>
                  </div>
                </Link>
                <Link to={`/dashboard/messages/${encodeURIComponent(person.email)}`} className="btn btn-secondary btn-sm">
                  <MessageCircle size={16} /> Message
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
