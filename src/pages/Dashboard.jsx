import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Dumbbell, CalendarClock, HelpCircle, User } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const practiceModules = user?.practiceModules ?? [];
  const meetings = user?.meetings ?? [];
  const quizScores = user?.quizScores ?? {};

  const completedPractice = practiceModules.filter((p) => p.completed).length;
  const upcomingMeetings = meetings.filter((m) => m.status === "upcoming");
  const quizzesTaken = Object.keys(quizScores).length;

  return (
    <div>
      <p className="page-eyebrow">Overview</p>
      <h1 className="page-title">Welcome back, {user?.fullName?.split(" ")[0] || "there"}</h1>
      <p className="page-sub">Here's where your swaps, practice, and credits stand today.</p>

      <div className="card-grid" style={{ marginTop: "2rem" }}>
        <div className="panel stat-card">
          <p className="label">Credits</p>
          <p className="value ember-text">{user?.credits ?? 0}</p>
        </div>
        <div className="panel stat-card">
          <p className="label">Practice modules done</p>
          <p className="value">{completedPractice} / {practiceModules.length}</p>
        </div>
        <div className="panel stat-card">
          <p className="label">Upcoming meetings</p>
          <p className="value">{upcomingMeetings.length}</p>
        </div>
        <div className="panel stat-card">
          <p className="label">Quizzes taken</p>
          <p className="value">{quizzesTaken}</p>
        </div>
      </div>

      <p className="section-title" style={{ marginTop: "2.5rem" }}>Quick actions</p>
      <div className="quick-actions">
        <button className="btn btn-primary" onClick={() => navigate("/dashboard/practice")}>
          <Dumbbell size={16} /> Start practicing
        </button>
        <button className="btn btn-secondary" onClick={() => navigate("/dashboard/meetings")}>
          <CalendarClock size={16} /> Schedule a meeting
        </button>
        <button className="btn btn-secondary" onClick={() => navigate("/dashboard/quizzes")}>
          <HelpCircle size={16} /> Take a quiz
        </button>
        <button className="btn btn-secondary" onClick={() => navigate("/dashboard/profile")}>
          <User size={16} /> Edit profile
        </button>
      </div>

      <p className="section-title" style={{ marginTop: "2.5rem" }}>Next up</p>
      <div className="panel" style={{ marginTop: "1rem", padding: "1.25rem" }}>
        {upcomingMeetings.length === 0 ? (
          <p className="empty-note">No upcoming meetings — schedule one to get started.</p>
        ) : (
          upcomingMeetings.slice(0, 3).map((m) => (
            <div key={m.id} className="list-row" style={{ marginBottom: "0.65rem" }}>
              <div>
                <p className="list-row-title">{m.title}</p>
                <p className="list-row-sub">with {m.withUser} · {m.date} at {m.time}</p>
              </div>
              <span className="badge badge-upcoming">Upcoming</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
