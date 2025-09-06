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
      // Register
      await API.post("/auth/register", { name, email, password });
      toast.show("Registered successfully", "success");

      // Auto-login
      const loginRes = await API.post("/auth/login", { email, password });
      const token = loginRes.data.token;
      const user = loginRes.data.user;

      // persist
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.show(`Welcome, ${user.name}`, "success");

      // notify parent (App) to set user state
      if (onRegistered) onRegistered(user);
      // optionally switch view
      if (switchToLogin) switchToLogin();
    } catch (err) {
      const msg = err?.response?.data?.msg || "Registration failed";
      setError(msg);
      toast.show(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",background:"#0b1220"}}>
      <form onSubmit={submit} className="card form" style={{width:380}}>
        <h2 style={{margin:0}}>Create account</h2>
        {error && <div style={{color:"#ef4444"}}>{error}</div>}
        <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" required />
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" required />
        <input className="input" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" required />
        <div className="row" style={{marginTop:6}}>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
          <button type="button" className="btn" onClick={() => switchToLogin && switchToLogin()}>
            Back to login
          </button>
        </div>
      </form>
    </div>
  );
}
