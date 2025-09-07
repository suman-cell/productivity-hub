// client/src/components/NavBar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function NavBar({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  function handleToggle() {
    setOpen(v => !v);
  }

  function handleLogout() {
    setOpen(false);
    onLogout && onLogout();
  }

  // compute initials
  function getInitials(name = "") {
    const parts = name.trim().split(" ");
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return (
    <header className="navbar">
      <div className="nav-left">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-logo" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="3" width="8" height="8" rx="2" fill="#2563eb" />
              <rect x="14" y="3" width="8" height="8" rx="2" fill="#06b6d4" />
              <rect x="2" y="13" width="8" height="8" rx="2" fill="#06b6d4" />
              <rect x="14" y="13" width="8" height="8" rx="2" fill="#2563eb" />
            </svg>
          </span>
          <span className="brand-text">Productivity Hub</span>
        </Link>
      </div>

      <nav className={`nav-links ${open ? "open" : ""}`}>
        <Link to="/" className="nav-link" onClick={() => setOpen(false)}>Dashboard</Link>
        {user?.role === "admin" && (
          <Link to="/admin" className="nav-link" onClick={() => setOpen(false)}>Admin</Link>
        )}
        {user && (
          <div className="mobile-user">
            <div className="mobile-user-info">
              <div className="avatar">{getInitials(user.name)}</div>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>{user.email || user.role}</div>
            </div>
            <button className="btn nav-link mobile-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </nav>

      <div className="nav-right">
        {user ? (
          <>
            <div className="avatar" title={`${user.name} • ${user.role}`}>
              {getInitials(user.name)}
            </div>
            <span className="badge">{user.role}</span>
            <button className="btn btn-ghost nav-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/" className="nav-link" onClick={() => setOpen(false)}>Login / Register</Link>
        )}

        <button
          className="nav-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={handleToggle}
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 6L18 18M6 18L18 6" /></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h18" /></svg>
          )}
        </button>
      </div>
    </header>
  );
}
