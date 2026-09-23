import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { categories, openSwaps, howItWorks } from "../data/mockData.js";
import heroImage from "../assets/hero-exchange.jpg";

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      <header className="public-header">
        <div className="container public-header-inner">
          <Link to="/" className="brand">
            skill<span className="ember-text">swap</span>
          </Link>
          <nav className="public-nav">
            <a href="#browse">Browse</a>
            <a href="#how">How it works</a>
            <a href="#members">Members</a>
          </nav>
          <div className="header-actions">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-sm">My dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="container hero">
        <div>
          <span className="pill-badge">
            <span className="dot" />
            1,208 swaps happening this week
          </span>
          <h1 style={{ marginTop: "1.5rem" }}>
            Trade the skill you have for the <span className="ember-text">skill you want.</span>
          </h1>
          <p style={{ marginTop: "1.5rem", maxWidth: "28rem", color: "var(--muted-foreground)" }}>
            SkillSwap is an hour-for-hour exchange. Teach a session, earn a credit, spend it
            learning from someone anywhere in the world.
          </p>
          <div className="quick-actions" style={{ marginTop: "2rem" }}>
            <Link to={user ? "/dashboard" : "/register"} className="btn btn-primary">
              {user ? "Go to my dashboard" : "Get started free"}
            </Link>
            <a href="#members" className="btn btn-secondary">Browse open swaps</a>
          </div>

          <dl className="stat-row">
            <div>
              <dt className="stat-value">12.4k</dt>
              <dd className="stat-label">Members</dd>
            </div>
            <div>
              <dt className="stat-value">60+</dt>
              <dd className="stat-label">Disciplines</dd>
            </div>
            <div>
              <dt className="stat-value">98%</dt>
              <dd className="stat-label">Swap rating</dd>
            </div>
          </dl>
        </div>

        <div className="panel hero-image-wrap">
          <img src={heroImage} alt="Two glass forms exchanging streams of light" />
        </div>
      </section>

      <section id="browse" className="container section">
        <h2 className="section-title">Browse by category</h2>
        <div className="grid-6" style={{ marginTop: "1.5rem" }}>
          {categories.map((c) => (
            <button key={c.name} className="panel category-card" style={{ textAlign: "left", border: "1px solid var(--border)", cursor: "pointer" }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{c.name}</p>
              <p style={{ marginTop: "0.25rem", fontSize: "0.75rem", color: "var(--muted-foreground)" }}>{c.count} teachers</p>
            </button>
          ))}
        </div>
      </section>

      <section id="how" className="container section" style={{ paddingTop: "2.5rem" }}>
        <h2 style={{ fontSize: "1.9rem", maxWidth: "26rem" }}>How a swap works</h2>
        <div className="grid-3" style={{ marginTop: "2rem" }}>
          {howItWorks.map((s) => (
            <article key={s.step} className="panel step-card">
              <p className="ember-text" style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 600 }}>{s.step}</p>
              <h3 style={{ marginTop: "0.75rem", fontSize: "1.05rem", fontWeight: 500 }}>{s.title}</h3>
              <p style={{ marginTop: "0.4rem", fontSize: "0.875rem", color: "var(--muted-foreground)" }}>{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="members" className="container section" style={{ paddingBottom: "4rem" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: "1.9rem" }}>Open swaps right now</h2>
          <Link to={user ? "/dashboard" : "/register"} style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>See all</Link>
        </div>
        <div className="grid-3" style={{ marginTop: "2rem" }}>
          {openSwaps.map((s) => (
            <article key={s.name} className="panel swap-card">
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span className="avatar-fill ember-fill">{s.initials}</span>
                <div>
                  <p style={{ fontSize: "0.9rem", fontWeight: 500 }}>{s.name}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>{s.location}</p>
                </div>
              </div>
              <dl style={{ marginTop: "1.25rem", display: "grid", gap: "0.6rem", fontSize: "0.875rem" }}>
                <div>
                  <dt style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted-foreground)" }}>Teaches</dt>
                  <dd style={{ marginTop: "0.15rem" }}>{s.teaches}</dd>
                </div>
                <div>
                  <dt style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted-foreground)" }}>Wants</dt>
                  <dd style={{ marginTop: "0.15rem", color: "var(--teal)" }}>{s.wants}</dd>
                </div>
              </dl>
              <p style={{ marginTop: "1.25rem", fontSize: "0.75rem", color: "var(--muted-foreground)" }}>{s.hours} hours taught</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="hairline">
        <div className="container public-footer">
          <p className="brand">skill<span className="ember-text">swap</span></p>
          <p>React demo · hour-for-hour skill exchange</p>
        </div>
      </footer>
    </div>
  );
}
