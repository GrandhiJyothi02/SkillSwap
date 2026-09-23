import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  Users,
  MessageCircle,
  User,
  Dumbbell,
  CalendarClock,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useConnections } from "../context/ConnectionsContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/dashboard/explore", label: "Explore", icon: Compass, badgeKey: null },
  { to: "/dashboard/connections", label: "Connections", icon: Users, badgeKey: "incoming" },
  { to: "/dashboard/messages", label: "Messages", icon: MessageCircle, badgeKey: "unread" },
  { to: "/dashboard/profile", label: "Profile", icon: User },
  { to: "/dashboard/practice", label: "Practice", icon: Dumbbell },
  { to: "/dashboard/meetings", label: "Meetings", icon: CalendarClock },
  { to: "/dashboard/quizzes", label: "Quizzes", icon: HelpCircle },
];

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const { incomingRequests, totalUnread } = useConnections();
  const toast = useToast();
  const navigate = useNavigate();

  const badgeCounts = {
    incoming: incomingRequests.length,
    unread: totalUnread,
  };

  function handleLogout() {
    signOut();
    toast.success("Signed out");
    navigate("/login");
  }

  const initials = (user?.fullName || "?")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <NavLink to="/" className="brand">
          skill<span className="ember-text">swap</span>
        </NavLink>
      </div>

      <div className="sidebar-user">
        <span className="avatar-fill ember-fill" style={{ width: "2.25rem", height: "2.25rem", fontSize: "0.75rem" }}>
          {initials}
        </span>
        <div style={{ overflow: "hidden" }}>
          <p className="sidebar-user-name">{user?.fullName}</p>
          <p className="sidebar-user-credits">{user?.credits ?? 0} credits</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map(({ to, label, icon: Icon, end, badgeKey }) => {
          const count = badgeKey ? badgeCounts[badgeKey] : 0;
          return (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
            >
              <Icon size={18} />
              {label}
              {count > 0 && <span className="nav-badge">{count}</span>}
            </NavLink>
          );
        })}
      </nav>

      <button className="sidebar-logout" onClick={handleLogout}>
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
