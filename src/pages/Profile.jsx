import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { skillOptions } from "../data/mockData.js";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const toast = useToast();

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [skills, setSkills] = useState(user?.skills || []);

  const initials = (user?.fullName || "?")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function toggleSkill(skill) {
    setSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));
  }

  function handleSave(e) {
    e.preventDefault();
    updateProfile({ fullName: fullName.trim() || user.fullName, bio, skills });
    setEditing(false);
    toast.success("Profile updated");
  }

  function handleCancel() {
    setFullName(user?.fullName || "");
    setBio(user?.bio || "");
    setSkills(user?.skills || []);
    setEditing(false);
  }

  return (
    <div>
      <p className="page-eyebrow">Your account</p>
      <h1 className="page-title">Profile</h1>
      <p className="page-sub">This is what other members see when they consider a swap with you.</p>

      <div className="panel" style={{ marginTop: "2rem", padding: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span className="profile-avatar ember-fill">{initials}</span>
          <div>
            <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>{user?.fullName}</p>
            <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>{user?.email}</p>
          </div>
          {!editing && (
            <button className="btn btn-secondary btn-sm" style={{ marginLeft: "auto" }} onClick={() => setEditing(true)}>
              Edit profile
            </button>
          )}
        </div>

        <div style={{ marginTop: "1.75rem" }}>
          {editing ? (
            <form onSubmit={handleSave}>
              <label className="field">
                <span className="field-label">Full name</span>
                <input className="field-input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </label>
              <label className="field">
                <span className="field-label">Bio</span>
                <textarea
                  className="field-textarea"
                  placeholder="Tell other members a bit about yourself…"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </label>
              <div className="field">
                <p className="field-label" style={{ marginBottom: "0.5rem" }}>Skills you teach</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {skillOptions.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      className="chip"
                      data-active={skills.includes(skill) ? "true" : "false"}
                      onClick={() => toggleSkill(skill)}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.5rem" }}>
                <button type="submit" className="btn btn-primary">Save changes</button>
                <button type="button" className="btn btn-ghost" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <div style={{ marginBottom: "1.25rem" }}>
                <p className="field-label">Bio</p>
                <p style={{ fontSize: "0.9rem", color: user?.bio ? "var(--foreground)" : "var(--faint-foreground)" }}>
                  {user?.bio || "No bio yet — tell other members a bit about yourself."}
                </p>
              </div>
              <div>
                <p className="field-label">Skills you teach</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.4rem" }}>
                  {(user?.skills || []).length === 0 ? (
                    <p style={{ fontSize: "0.9rem", color: "var(--faint-foreground)" }}>No skills listed yet.</p>
                  ) : (
                    user.skills.map((s) => <span key={s} className="chip-static">{s}</span>)
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
