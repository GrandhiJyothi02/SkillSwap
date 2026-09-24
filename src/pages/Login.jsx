import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Login() {
  const { signIn } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
  e.preventDefault();
  setSubmitting(true);

  const { error } = await signIn({ email, password });

  setSubmitting(false);

  if (error) {
    toast.error(error);
    return;
  }

  toast.success("Welcome back");
  navigate("/dashboard");
}

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to SkillSwap"
      subtitle="Pick up where you left off — sessions, credits and matches."
      footer={
        <>
          New here? <Link to="/register" className="link-accent">Create an account</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <label className="field">
          <span className="field-label">Email</span>
          <input
            type="email"
            required
            className="field-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="field-label">
            Password
            <Link to="/forgot-password" className="link-accent" style={{ fontSize: "0.75rem" }}>
              Forgot password?
            </Link>
          </span>
          <input
            type="password"
            required
            className="field-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" disabled={submitting} className="btn btn-primary btn-block">
          {submitting ? "Signing in…" : "Log in"}
        </button>
      </form>

      <p style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "var(--faint-foreground)" }}>
        Demo accounts are stored locally in your browser — nothing leaves your device.
      </p>
    </AuthShell>
  );
}
