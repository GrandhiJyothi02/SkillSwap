import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthShell from "../components/AuthShell.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function ResetPassword() {
  const { validateResetToken, resetPassword } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const tokenCheck = useMemo(() => validateResetToken(token), [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!tokenCheck.valid) {
      toast.error(tokenCheck.expired ? "This reset link has expired." : "This reset link is invalid.");
    }
  }, [tokenCheck]); // eslint-disable-line react-hooks/exhaustive-deps

  function validate() {
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password !== confirmPassword) return "Passwords don't match.";
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSubmitting(true);
    const result = resetPassword({ token, newPassword: password });
    setSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Password updated — you can log in now.");
    setDone(true);
  }

  if (!tokenCheck.valid) {
    return (
      <AuthShell
        eyebrow="Reset your password"
        title="Link invalid or expired"
        subtitle="Reset links expire after 30 minutes for your security."
        footer={
          <>
            <Link to="/login" className="link-accent">Back to log in</Link>
          </>
        }
      >
        <Link to="/forgot-password" className="btn btn-primary btn-block">
          Request a new reset link
        </Link>
      </AuthShell>
    );
  }

  if (done) {
    return (
      <AuthShell
        eyebrow="Reset your password"
        title="Password updated"
        subtitle="Your password has been changed successfully."
      >
        <button type="button" className="btn btn-primary btn-block" onClick={() => navigate("/login")}>
          Go to log in
        </button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Reset your password"
      title="Choose a new password"
      subtitle={`Setting a new password for ${tokenCheck.email}.`}
      footer={
        <>
          <Link to="/login" className="link-accent">Back to log in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <label className="field">
          <span className="field-label">New password</span>
          <input
            type="password"
            required
            autoFocus
            className="field-input"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="field-label">Confirm new password</span>
          <input
            type="password"
            required
            className="field-input"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        <button type="submit" disabled={submitting} className="btn btn-primary btn-block">
          {submitting ? "Updating…" : "Update password"}
        </button>
      </form>
    </AuthShell>
  );
}
