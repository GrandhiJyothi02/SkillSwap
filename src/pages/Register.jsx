import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { skillOptions } from "../data/mockData.js";

export default function Register() {
  const { signUp } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [teaches, setTeaches] = useState([skillOptions[0]]);
  const [submitting, setSubmitting] = useState(false);

  function toggleSkill(skill) {
    setTeaches((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));
  }

  function validate() {
    if (!fullName.trim()) return "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Enter a valid email";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!agreed) return "Please agree to swap fairly, hour for hour";
    return null;
  }

 async function handleSubmit(e) {
  e.preventDefault();

  const validationError = validate();

  if (validationError) {
    toast.error(validationError);
    return;
  }

  setSubmitting(true);

  const { error } = await signUp({
    fullName,
    email,
    password,
    skills: teaches,
  });

  setSubmitting(false);

  if (error) {
    toast.error(error);
    return;
  }

  toast.success("Account created");
  navigate("/dashboard");
}
  return (
    <AuthShell
      eyebrow="Join the exchange"
      title="Create your account"
      subtitle="Free forever. Your first teaching hour earns your first credit."
      footer={
        <>
          Already a member? <Link to="/login" className="link-accent">Log in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <label className="field">
          <span className="field-label">Full name</span>
          <input className="field-input" placeholder="username" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Email</span>
          <input type="email" className="field-input" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="field">
          <span className="field-label">Password</span>
          <input type="password" className="field-input" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        <div className="field">
          <p className="field-label" style={{ marginBottom: "0.5rem" }}>Skills you can teach</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {skillOptions.map((skill) => (
              <button
                key={skill}
                type="button"
                className="chip"
                data-active={teaches.includes(skill) ? "true" : "false"}
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        <label className="checkbox-line">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          I agree to the community guidelines and swap fairly, hour for hour.
        </label>

        <button type="submit" disabled={submitting} className="btn btn-primary btn-block">
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p style={{ marginTop: "1.5rem", fontSize: "0.75rem", color: "var(--faint-foreground)" }}>
        Demo accounts are stored locally in your browser — nothing leaves your device.
      </p>
    </AuthShell>
  );
}
