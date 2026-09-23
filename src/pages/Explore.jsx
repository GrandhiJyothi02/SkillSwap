import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Sparkles, Users, GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { skillDescriptions } from "../data/skillsData.js";
import { skillOptions } from "../data/mockData.js";

function initialsOf(name) {
  return (name || "?")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Explore() {
  const { user, listUsers } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const allUsers = listUsers().filter((u) => u.email !== user?.email);

  const tutorsBySkill = useMemo(() => {
    const map = {};
    skillOptions.forEach((skill) => {
      map[skill] = allUsers.filter((u) => (u.skills || []).includes(skill));
    });
    return map;
  }, [allUsers]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const skillMatches = skillOptions.filter(
      (skill) => skill.toLowerCase().includes(q) || (skillDescriptions[skill] || "").toLowerCase().includes(q)
    );

    const userMatches = allUsers.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        (u.skills || []).some((s) => s.toLowerCase().includes(q))
    );

    const tutorMatches = userMatches.filter((u) => (u.skills || []).length > 0);
    const memberMatches = userMatches.filter((u) => (u.skills || []).length === 0);

    return { skillMatches, tutorMatches, memberMatches };
  }, [query, allUsers]);

  const hasResults =
    results && (results.skillMatches.length > 0 || results.tutorMatches.length > 0 || results.memberMatches.length > 0);

  return (
    <div>
      <p className="page-eyebrow">Home</p>
      <h1 className="page-title">Find a skill, a tutor, or a friend</h1>
      <p className="page-sub">Search the whole SkillSwap directory, or browse skill lectures below.</p>

      <div className="explore-search panel">
        <Search size={18} color="var(--muted-foreground)" />
        <input
          className="explore-search-input"
          placeholder="Search skills, tutors, or friends…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search SkillSwap"
        />
      </div>

      {results && (
        <div className="panel search-results" style={{ marginTop: "0.75rem" }}>
          {!hasResults ? (
            <p className="empty-note">No matches for "{query}" — try a different skill or name.</p>
          ) : (
            <>
              {results.skillMatches.length > 0 && (
                <div className="result-group">
                  <p className="result-group-title">Skills</p>
                  {results.skillMatches.map((skill) => (
                    <button
                      key={skill}
                      className="result-row"
                      onClick={() => navigate(`/dashboard/skills/${encodeURIComponent(skill)}`)}
                    >
                      <span className="result-icon skill-icon"><Sparkles size={16} /></span>
                      <span>
                        <span className="result-title">{skill}</span>
                        <span className="result-sub">{tutorsBySkill[skill]?.length || 0} tutors teaching</span>
                      </span>
                      <span className="badge badge-upcoming">Skill</span>
                    </button>
                  ))}
                </div>
              )}

              {results.tutorMatches.length > 0 && (
                <div className="result-group">
                  <p className="result-group-title">Tutors</p>
                  {results.tutorMatches.map((u) => (
                    <button
                      key={u.email}
                      className="result-row"
                      onClick={() => navigate(`/dashboard/tutors/${encodeURIComponent(u.email)}`)}
                    >
                      <span className="avatar-fill ember-fill result-icon">{initialsOf(u.fullName)}</span>
                      <span>
                        <span className="result-title">{u.fullName}</span>
                        <span className="result-sub">{(u.skills || []).join(", ") || "No skills listed"}</span>
                      </span>
                      <span className="badge badge-completed">Tutor</span>
                    </button>
                  ))}
                </div>
              )}

              {results.memberMatches.length > 0 && (
                <div className="result-group">
                  <p className="result-group-title">Users</p>
                  {results.memberMatches.map((u) => (
                    <button
                      key={u.email}
                      className="result-row"
                      onClick={() => navigate(`/dashboard/tutors/${encodeURIComponent(u.email)}`)}
                    >
                      <span className="avatar-fill ember-fill result-icon">{initialsOf(u.fullName)}</span>
                      <span>
                        <span className="result-title">{u.fullName}</span>
                        <span className="result-sub">SkillSwap member</span>
                      </span>
                      <span className="badge badge-completed">User</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      <p className="section-title" style={{ marginTop: "2.5rem" }}>Skill lectures</p>
      <div className="skill-card-grid" style={{ marginTop: "1rem" }}>
        {skillOptions.map((skill) => {
          const tutors = tutorsBySkill[skill] || [];
          const featured = tutors[0];
          return (
            <article key={skill} className="panel skill-card">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
                <div>
                  <span className="chip-static">{skill}</span>
                  <h3 style={{ marginTop: "0.75rem", fontSize: "1.05rem", fontWeight: 600 }}>{skill} Skill Exchange</h3>
                </div>
                <span className="skill-card-icon"><GraduationCap size={20} /></span>
              </div>

              <p className="skill-card-desc">{skillDescriptions[skill]}</p>

              <div className="skill-card-footer">
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {featured ? (
                    <>
                      <span className="avatar-fill ember-fill" style={{ width: "1.85rem", height: "1.85rem", fontSize: "0.68rem" }}>
                        {initialsOf(featured.fullName)}
                      </span>
                      <span style={{ fontSize: "0.78rem", color: "var(--muted-foreground)" }}>
                        {featured.fullName}{tutors.length > 1 ? ` +${tutors.length - 1} more` : ""}
                      </span>
                    </>
                  ) : (
                    <span style={{ fontSize: "0.78rem", color: "var(--faint-foreground)" }}>
                      <Users size={14} style={{ verticalAlign: "-2px", marginRight: "0.3rem" }} />
                      No tutors yet
                    </span>
                  )}
                </div>
                <Link to={`/dashboard/skills/${encodeURIComponent(skill)}`} className="btn btn-secondary btn-sm">
                  View Details
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
