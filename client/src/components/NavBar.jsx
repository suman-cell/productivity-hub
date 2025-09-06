import React from "react";
import { Link } from "react-router-dom";

export default function NavBar({ user, onLogout }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 20px",
      borderBottom: "1px solid #eee",
      marginBottom: 16
    }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Link to="/" style={{ fontWeight: 700, textDecoration: "none", color: "#4f46e5" }}>Productivity Hub</Link>
        {user && <Link to="/" style={{ textDecoration: "none", color: "#9CA3AF" }}>Dashboard</Link>}
        {user && user.role === "admin" && <Link to="/admin" style={{ textDecoration: "none", color: "#9CA3AF" }}>Admin</Link>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {user ? (
          <>
            <span style={{ fontWeight: 600 }}>{user.name}</span>
            <span style={{ fontSize: 13, color: "#666" }}>{user.role}</span>
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <Link to="/" style={{ textDecoration: "none" }}>Login / Register</Link>
        )}
      </div>
    </div>
  );
}
