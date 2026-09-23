import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
      <h1 className="ember-text" style={{ fontSize: "3rem" }}>404</h1>
      <p style={{ color: "var(--muted-foreground)" }}>That page doesn't exist.</p>
      <Link to="/" className="btn btn-primary">Back home</Link>
    </div>
  );
}
