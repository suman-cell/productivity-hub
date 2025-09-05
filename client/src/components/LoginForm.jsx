import { useState } from "react";
import API from "../api";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      setError(err?.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <form onSubmit={submit} style={styles.form}>
        <h2 style={styles.h2}>Sign in</h2>
        {error && <div style={styles.error}>{error}</div>}
        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <input
          style={styles.input}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />
        <button style={styles.button} disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p style={{ marginTop: 12, fontSize: 12, color: "#666" }}>
          Tip: register via Postman or your API then login here.
        </p>
      </form>
    </div>
  );
}

const styles = {
  wrap: { display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "#f4f6f8" },
  form: { width: 360, padding: 20, background: "white", borderRadius: 8, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" },
  h2: { margin: 0, marginBottom: 12 },
  input: { width: "100%", padding: 10, marginBottom: 10, borderRadius: 6, border: "1px solid #ddd", boxSizing: "border-box" },
  button: { width: "100%", padding: 10, borderRadius: 6, background: "#2563eb", color: "white", border: "none", cursor: "pointer" },
  error: { marginBottom: 8, color: "#b00020", fontSize: 13 },
};
