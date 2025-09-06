import React from "react";
import { Link } from "react-router-dom";

export default function NavBar({ user, onLogout }) {
  return (
    <div className="navbar">
  <div className="nav-left">
    <a className="brand" href="/">Productivity Hub</a>
    {user && <a href="/" style={{color:"var(--muted)"}}>Dashboard</a>}
    {user?.role === "admin" && <a href="/admin" style={{color:"var(--muted)"}}>Admin</a>}
  </div>
  <div className="nav-right">
    {user ? (
      <>
        <span style={{fontWeight:600}}>{user.name}</span>
        <span className="badge" style={{marginLeft:8}}>{user.role}</span>
        <button className="btn btn-ghost" onClick={onLogout}>Logout</button>
      </>
    ) : <a href="/">Login / Register</a>}
  </div>
</div>

  );
}
