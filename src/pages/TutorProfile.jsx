import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Award } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useConnections } from "../context/ConnectionsContext.jsx";
import ConnectionAction from "../components/ConnectionAction.jsx";

function initialsOf(name) {
  return (name || "?")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function TutorProfile() {
  const { email } = useParams();
  const { user, findUserByEmail } = useAuth();
  const { getStatusWith } = useConnections();
  const navigate = useNavigate();

  const tutor = findUserByEmail(email);

  if (!tutor) {
    return (
      <div>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div className="panel" style={{ padding: "2rem", textAlign: "center" }}>
          <p className="empty-note">We couldn't find that member.</p>
          <Link to="/dashboard/explore" className="btn btn-primary" style={{ marginTop: "1rem" }}>
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const isSelf = tutor.email === user?.email;
  const { status } = getStatusWith(tutor.email);

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="panel" style={{ padding: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <span className="profile-avatar ember-fill">{initialsOf(tutor.fullName)}</span>
          <div style={{ flex: 1, minWidth: "10rem" }}>
            <p style={{ fontSize: "1.2rem", fontWeight: 600 }}>{tutor.fullName}</p>
            <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Award size={14} /> {tutor.credits ?? 0} credits earned teaching
            </p>
          </div>
          {!isSelf && <ConnectionAction email={tutor.email} />}
          {isSelf && <span className="badge badge-completed">This is you</span>}
        </div>

        <div style={{ marginTop: "1.75rem" }}>
          <p className="field-label">Bio</p>
          <p style={{ fontSize: "0.9rem", color: tutor.bio ? "var(--foreground)" : "var(--faint-foreground)" }}>
            {tutor.bio || "This member hasn't added a bio yet."}
          </p>
        </div>

        <div style={{ marginTop: "1.5rem" }}>
          <p className="field-label">Skills taught</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.4rem" }}>
            {(tutor.skills || []).length === 0 ? (
              <p style={{ fontSize: "0.9rem", color: "var(--faint-foreground)" }}>No skills listed yet.</p>
            ) : (
              tutor.skills.map((s) => (
                <Link key={s} to={`/dashboard/skills/${encodeURIComponent(s)}`} className="chip-static">{s}</Link>
              ))
            )}
          </div>
        </div>

        {!isSelf && (
          <p style={{ marginTop: "1.75rem", fontSize: "0.75rem", color: "var(--faint-foreground)" }}>
            {status === "accepted"
              ? "You're connected — you can message each other any time."
              : "Send a connection request to unlock messaging with this member."}
          </p>
        )}
      </div>
    </div>
  );
}
