// client/src/components/RegisterForm.jsx
import { useState } from "react";
import API from "../api";
import { useToast } from "./ToastContext";

export default function RegisterForm({ onRegistered, switchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // NEW
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
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
          />

          {/* password with toggle */}
          <div className="password-field">
            <input
              className="input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5.52 0-10-4.48-10-10 0-2.21.72-4.24 1.94-5.94M6.06 6.06A10.94 10.94 0 0 1 12 4c5.52 0 10 4.48 10 10 0 2.21-.72 4.24-1.94 5.94M1 1l22 22"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/>
                </svg>
              )}
            </button>
          </div>

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
