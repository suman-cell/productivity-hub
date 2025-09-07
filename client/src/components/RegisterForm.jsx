// client/src/components/RegisterForm.jsx
import { useState } from "react";
import API from "../api";
import { useToast } from "./ToastContext";

export default function RegisterForm({ onRegistered, switchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await API.post("/auth/register", { name, email, password });
      toast.show("Registered successfully", "success");

      // Auto-login
      const loginRes = await API.post("/auth/login", { email, password });
      const token = loginRes.data.token;
      const user = loginRes.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.show(`Welcome, ${user.name}`, "success");

      if (onRegistered) onRegistered(user);
    } catch (err) {
      const msg = err?.response?.data?.msg || "Registration failed";
      setError(msg);
      toast.show(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join Productivity Hub today</p>

        {error && <div style={{ color: "var(--danger)", marginBottom: 12 }}>{error}</div>}

        <form onSubmit={submit} className="form">
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            required
          />
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            type="email"
            required
          />
          <input
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <button type="button" onClick={switchToLogin} className="auth-link">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
