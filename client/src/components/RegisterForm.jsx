import { useState } from "react";
import API from "../api";

export default function RegisterForm({ onRegistered, switchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await API.post("/auth/register", { name, email, password });
      setLoading(false);
      // Optionally auto-login: call /auth/login here. For now notify caller.
      if (onRegistered) onRegistered(res.data);
      // switch to login UI so user can authenticate
      if (switchToLogin) switchToLogin();
    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.msg || "Registration failed");
    }
  }

  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",background:"#f3f4f6"}}>
      <form onSubmit={submit} style={{background:"#fff",padding:20,borderRadius:8,boxShadow:"0 4px 12px rgba(0,0,0,0.08)",width:380}}>
        <h2 style={{marginBottom:12}}>Register</h2>
        {error && <div style={{color:"red",marginBottom:8}}>{error}</div>}
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" style={{width:"100%",padding:8,marginBottom:8}} required />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" style={{width:"100%",padding:8,marginBottom:8}} required />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" style={{width:"100%",padding:8,marginBottom:12}} required />
        <button type="submit" style={{width:"100%",padding:10,background:"#059669",color:"#fff",border:"none",borderRadius:6}} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <div style={{marginTop:12, textAlign:"center"}}>
          <small>Already have an account? <button type="button" onClick={switchToLogin} style={{color:"#2563eb",background:"none",border:"none",cursor:"pointer"}}>Login</button></small>
        </div>
      </form>
    </div>
  );
}
