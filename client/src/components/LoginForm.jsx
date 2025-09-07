// client/src/components/LoginForm.jsx
import { useState } from "react";
import API from "../api";
import { useToast } from "./ToastContext";

export default function LoginForm({ onLogin, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
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
          <button className="btn btn-primary" type="submit">
            Login
          </button>
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
