// client/src/components/LoginForm.jsx
import { useState } from "react";
import API from "../api";
import { useToast } from "./ToastContext"; // adjust path if needed (../components/ToastContext)

export default function LoginForm({ onLogin, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const toast = useToast(); // <- <--- add this

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/auth/login", { email, password });

      // persist auth
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // inform parent to update app state
      onLogin(res.data.user);

      // show a friendly toast
      toast.show("Logged in", "success");
    } catch (err) {
      const msg = err?.response?.data?.msg || "Invalid email or password";
      setError(msg);

      // show error toast
      toast.show(msg, "error");
    }
  };

  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",background:"#f3f4f6"}}>
      <form onSubmit={handleSubmit} style={{background:"#fff",padding:20,borderRadius:8,boxShadow:"0 4px 12px rgba(0,0,0,0.08)",width:360}}>
        <h2 style={{marginBottom:12}}>Login</h2>
        {error && <p style={{color:"red"}}>{error}</p>}
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" style={{width:"100%",padding:8,marginBottom:8}} />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" style={{width:"100%",padding:8,marginBottom:12}} />
        <button type="submit" style={{width:"100%",padding:10,background:"#2563eb",color:"#fff",border:"none",borderRadius:6}}>Login</button>

        <div style={{marginTop:12, textAlign:"center"}}>
          <small>Don't have an account? <button type="button" onClick={switchToRegister} style={{color:"#2563eb",background:"none",border:"none",cursor:"pointer"}}>Register</button></small>
        </div>
      </form>
    </div>
  );
}
