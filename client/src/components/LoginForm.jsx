// client/src/components/LoginForm.jsx
import { useState } from "react";
import API from "../api";
import { useToast } from "./ToastContext";

export default function LoginForm({ onLogin, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // NEW
  const [error, setError] = useState("");
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLogin(res.data.user);
      toast.show("Logged in", "success");
    } catch (err) {
      const msg = err?.response?.data?.msg || "Invalid email or password";
      setError(msg);
      toast.show(msg, "error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to your account</p>

        {error && <p style={{ color: "var(--danger)", marginBottom: 12 }}>{error}</p>}

        <form onSubmit={handleSubmit} className="form">
          <input
            className="input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* password with toggle */}
          <div className="password-field">
            <input
              className="input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                // Eye-off icon
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5.52 0-10-4.48-10-10 0-2.21.72-4.24 1.94-5.94M6.06 6.06A10.94 10.94 0 0 1 12 4c5.52 0 10 4.48 10 10 0 2.21-.72 4.24-1.94 5.94M1 1l22 22"/>
                </svg>
              ) : (
                // Eye icon
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/>
                </svg>
              )}
            </button>
          </div>

          <button className="btn btn-primary" type="submit">Login</button>
        </form>

        <p className="auth-footer">
          Don’t have an account?{" "}
          <button type="button" onClick={switchToRegister} className="auth-link">
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
