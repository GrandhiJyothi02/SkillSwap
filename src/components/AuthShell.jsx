import { Link } from "react-router-dom";
import heroImage from "../assets/hero-exchange.jpg";

export default function AuthShell({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <img src={heroImage} alt="Two glass forms exchanging light, symbolising a skill trade" />
        <div className="auth-aside-overlay" />
        <div className="auth-aside-content">
          <Link to="/" className="brand">
            skill<span className="ember-text">swap</span>
          </Link>
          <div>
            <p className="tagline">Teach one thing. Learn another. No money changes hands.</p>
            <p className="stats">12,400 members trading hours across 60+ disciplines.</p>
          </div>
        </div>
      </aside>

      <main className="auth-main">
        <div className="auth-box">
          <Link to="/" className="brand" style={{ display: "none" }}>
            skill<span className="ember-text">swap</span>
          </Link>
          <p className="auth-eyebrow">{eyebrow}</p>
          <h1 className="auth-title">{title}</h1>
          {subtitle && <p className="auth-sub">{subtitle}</p>}

          <div style={{ marginTop: "2rem" }}>{children}</div>

          {footer && <div className="auth-footer-line">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
