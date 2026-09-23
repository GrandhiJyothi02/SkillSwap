import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { CheckCircle2, Circle } from "lucide-react";

const filters = ["All", "Not started", "Completed"];

export default function Practice() {
  const { user, updatePracticeModules } = useAuth();
  const toast = useToast();
  const [filter, setFilter] = useState("All");

  const modules = user?.practiceModules ?? [];

  const visible = modules.filter((m) => {
    if (filter === "Completed") return m.completed;
    if (filter === "Not started") return !m.completed;
    return true;
  });

  function toggleComplete(id) {
    const updated = modules.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m));
    updatePracticeModules(updated);
    const target = updated.find((m) => m.id === id);
    toast.success(target.completed ? "Marked as complete" : "Marked as not started");
  }

  return (
    <div>
      <p className="page-eyebrow">Sharpen your skills</p>
      <h1 className="page-title">Practice</h1>
      <p className="page-sub">Short self-paced modules to warm up before a swap session.</p>

      <div className="quick-actions" style={{ marginTop: "1.5rem" }}>
        {filters.map((f) => (
          <button
            key={f}
            className="chip"
            data-active={filter === f ? "true" : "false"}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="card-grid" style={{ marginTop: "1.5rem" }}>
        {visible.length === 0 ? (
          <p className="empty-note">No modules match this filter.</p>
        ) : (
          visible.map((m) => (
            <div key={m.id} className="panel" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
                <div>
                  <p style={{ fontWeight: 500 }}>{m.skill}</p>
                  <span className="chip-static" style={{ marginTop: "0.4rem", display: "inline-block" }}>{m.level}</span>
                </div>
              </div>
              <p style={{ marginTop: "0.85rem", fontSize: "0.85rem", color: "var(--muted-foreground)" }}>{m.description}</p>
              <button
                className={"btn btn-sm " + (m.completed ? "btn-secondary" : "btn-primary")}
                style={{ marginTop: "1.1rem" }}
                onClick={() => toggleComplete(m.id)}
              >
                {m.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                {m.completed ? "Completed" : "Mark as complete"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
