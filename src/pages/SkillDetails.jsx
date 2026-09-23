import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { skillDescriptions } from "../data/skillsData.js";
import { skillOptions } from "../data/mockData.js";
import ConnectionAction from "../components/ConnectionAction.jsx";

function initialsOf(name) {
  return (name || "?")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function SkillDetails() {
  const { skillName } = useParams();
  const { user, listUsers } = useAuth();
  const navigate = useNavigate();

  const skill = skillOptions.find((s) => s.toLowerCase() === (skillName || "").toLowerCase());

  if (!skill) {
    return (
      <div>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
          <ArrowLeft size={16} /> Back
        </button>
        <div className="panel" style={{ padding: "2rem", textAlign: "center" }}>
          <p className="empty-note">We couldn't find a skill called "{skillName}".</p>
          <Link to="/dashboard/explore" className="btn btn-primary" style={{ marginTop: "1rem" }}>
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const tutors = listUsers().filter((u) => u.email !== user?.email && (u.skills || []).includes(skill));

  return (
    <div>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="panel" style={{ padding: "1.75rem", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
        <span className="skill-card-icon" style={{ width: "3rem", height: "3rem" }}>
          <GraduationCap size={24} />
        </span>
        <div>
          <span className="chip-static">{skill}</span>
          <h1 style={{ marginTop: "0.6rem", fontSize: "1.7rem", fontWeight: 600 }}>{skill} Skill Exchange</h1>
          <p style={{ marginTop: "0.5rem", color: "var(--muted-foreground)", maxWidth: "40rem" }}>
            {skillDescriptions[skill]}
          </p>
          <p style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "var(--faint-foreground)" }}>
            Category: {skill} · {tutors.length} tutor{tutors.length === 1 ? "" : "s"} available
          </p>
        </div>
      </div>

      <p className="section-title" style={{ marginTop: "2rem" }}>Tutors teaching {skill}</p>

      <div style={{ marginTop: "1rem" }}>
        {tutors.length === 0 ? (
          <div className="panel" style={{ padding: "1.5rem" }}>
            <p className="empty-note">No tutors teach {skill} yet — check back soon.</p>
          </div>
        ) : (
          tutors.map((tutor) => (
            <div key={tutor.email} className="panel tutor-row">
              <Link to={`/dashboard/tutors/${encodeURIComponent(tutor.email)}`} className="tutor-row-main">
                <span className="avatar-fill ember-fill" style={{ width: "2.75rem", height: "2.75rem" }}>
                  {initialsOf(tutor.fullName)}
                </span>
                <div>
                  <p className="list-row-title">{tutor.fullName}</p>
                  <p className="list-row-sub">{tutor.bio || "No bio yet."}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.5rem" }}>
                    {(tutor.skills || []).map((s) => (
                      <span key={s} className="chip-static">{s}</span>
                    ))}
                  </div>
                </div>
              </Link>
              <ConnectionAction email={tutor.email} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
