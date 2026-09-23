import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { skillOptions } from "../data/mockData.js";
import { Plus, X } from "lucide-react";

export default function Meetings() {
  const { user, updateMeetings } = useAuth();
  const toast = useToast();

  const meetings = user?.meetings ?? [];
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [withUser, setWithUser] = useState("");
  const [skill, setSkill] = useState(skillOptions[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const upcoming = meetings.filter((m) => m.status === "upcoming");
  const past = meetings.filter((m) => m.status === "completed");

  function resetForm() {
    setTitle("");
    setWithUser("");
    setSkill(skillOptions[0]);
    setDate("");
    setTime("");
  }

  function handleSchedule(e) {
    e.preventDefault();
    if (!title.trim() || !withUser.trim() || !date || !time) {
      toast.error("Fill in every field to schedule a meeting.");
      return;
    }

    const newMeeting = {
      id: `m-${Date.now()}`,
      title: title.trim(),
      withUser: withUser.trim(),
      skill,
      date,
      time,
      status: "upcoming",
    };

    updateMeetings([newMeeting, ...meetings]);
    toast.success("Meeting scheduled");
    resetForm();
    setShowForm(false);
  }

  function cancelMeeting(id) {
    updateMeetings(meetings.filter((m) => m.id !== id));
    toast.success("Meeting cancelled");
  }

  function joinMeeting(m) {
    toast.success(`Joining "${m.title}" — this is a demo, no live video is attached.`);
  }

  return (
    <div>
      <p className="page-eyebrow">Sessions</p>
      <h1 className="page-title">Meetings</h1>
      <p className="page-sub">Your scheduled skill-swap sessions, upcoming and past.</p>

      <div className="quick-actions" style={{ marginTop: "1.5rem" }}>
        <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Close" : "Schedule a meeting"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSchedule} className="panel" style={{ marginTop: "1.25rem", padding: "1.5rem" }}>
          <div className="card-grid">
            <label className="field">
              <span className="field-label">Session title</span>
              <input className="field-input" placeholder="e.g. React Q&A" value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label className="field">
              <span className="field-label">With</span>
              <input className="field-input" placeholder="Partner's name" value={withUser} onChange={(e) => setWithUser(e.target.value)} />
            </label>
            <label className="field">
              <span className="field-label">Skill</span>
              <select className="field-select" value={skill} onChange={(e) => setSkill(e.target.value)}>
                {skillOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="field">
              <span className="field-label">Date</span>
              <input type="date" className="field-input" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label className="field">
              <span className="field-label">Time</span>
              <input type="time" className="field-input" value={time} onChange={(e) => setTime(e.target.value)} />
            </label>
          </div>
          <button type="submit" className="btn btn-primary">Confirm meeting</button>
        </form>
      )}

      <p className="section-title" style={{ marginTop: "2rem" }}>Upcoming</p>
      <div style={{ marginTop: "0.75rem" }}>
        {upcoming.length === 0 ? (
          <p className="empty-note">Nothing scheduled — set up your first session above.</p>
        ) : (
          upcoming.map((m) => (
            <div key={m.id} className="list-row">
              <div>
                <p className="list-row-title">{m.title}</p>
                <p className="list-row-sub">with {m.withUser} · {m.skill} · {m.date} at {m.time}</p>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <button className="btn btn-secondary btn-sm" onClick={() => joinMeeting(m)}>Join</button>
                <button className="btn btn-danger btn-sm" onClick={() => cancelMeeting(m.id)}>Cancel</button>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="section-title" style={{ marginTop: "2rem" }}>Past</p>
      <div style={{ marginTop: "0.75rem" }}>
        {past.length === 0 ? (
          <p className="empty-note">No completed sessions yet.</p>
        ) : (
          past.map((m) => (
            <div key={m.id} className="list-row">
              <div>
                <p className="list-row-title">{m.title}</p>
                <p className="list-row-sub">with {m.withUser} · {m.skill} · {m.date} at {m.time}</p>
              </div>
              <span className="badge badge-completed">Completed</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
