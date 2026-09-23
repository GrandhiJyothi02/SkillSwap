import { useState } from "react";
import { Link } from "react-router-dom";
import AuthShell from "../components/AuthShell.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetToken, setResetToken] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = email.trim();

    if (!EMAIL_RE.test(trimmed)) {
      toast.error("Enter a valid email address.");
      return;
    }

    setSubmitting(true);
    const result = requestPasswordReset(trimmed);
    setSubmitting(false);
    setSent(true);
    setResetToken(result.exists && result.token ? result.token : null);
  }

  return (
    <AuthShell
      eyebrow="Reset your password"
      title="Forgot password?"
      subtitle="Enter the email on your account and we'll send you a link to reset it."
      footer={
        <>
          Remembered it after all? <Link to="/login" className="link-accent">Back to log in</Link>
        </>
      }
    >
      {sent ? (
        <div className="panel" style={{ padding: "1.25rem" }} role="status">
          <p style={{ fontSize: "0.9rem" }}>
            If an account exists for <strong>{email.trim()}</strong>, we've sent password reset
            instructions to that address.
          </p>

          {resetToken ? (
            <>
              <p style={{ marginTop: "1rem", fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                This demo doesn't have a real mail server connected, so here's your reset link directly:
              </p>
              <Link
                to={`/reset-password?token=${resetToken}`}
                className="btn btn-secondary btn-block"
                style={{ marginTop: "0.75rem" }}
              >
                Continue to reset password
              </Link>
            </>
          ) : (
            <p style={{ marginTop: "1rem", fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
              Didn't get anything? Double-check the email you registered with and try again.
            </p>
          )}

          <button type="button" className="btn btn-ghost btn-block" style={{ marginTop: "0.75rem" }} onClick={() => { setSent(false); setResetToken(null); }}>
            Use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label className="field">
            <span className="field-label">Email</span>
            <input
              type="email"
              required
              autoFocus
              className="field-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <button type="submit" disabled={submitting} className="btn btn-primary btn-block">
            {submitting ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}

      <p style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "var(--faint-foreground)" }}>
        Demo accounts are stored locally in your browser — nothing leaves your device.
      </p>
    </AuthShell>
  );
}
