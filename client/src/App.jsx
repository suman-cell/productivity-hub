// client/src/App.jsx
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import TaskDashboard from "./components/TaskDashboard";
import AdminUsers from "./components/AdminUsers";

export default function App() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    try {
      const u = JSON.parse(raw);
      if (!u.id && u._id) u.id = u._id;
      return u;
    } catch {
      return null;
    }
  });
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    // keep localStorage and state shapes consistent
    const raw = localStorage.getItem("user");
    if (raw) {
      const u = JSON.parse(raw);
      if (!u.id && u._id) u.id = u._id;
      setUser(u);
    }
  }, []);

  const handleLogin = (userObj) => {
    if (!userObj.id && userObj._id) userObj.id = userObj._id;
    setUser(userObj);
    localStorage.setItem("user", JSON.stringify(userObj));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route
          path="/"
          element={
            user ? (
              <TaskDashboard user={user} onLogout={handleLogout} />
            ) : showRegister ? (
              <RegisterForm onRegistered={handleLogin} switchToLogin={() => setShowRegister(false)} />
            ) : (
              <LoginForm onLogin={handleLogin} switchToRegister={() => setShowRegister(true)} />
            )
          }
        />

        {/* admin page - protect client-side too (server enforces too) */}
        <Route
          path="/admin"
          element={
            user ? (
              user.role === "admin" ? (
                <AdminUsers user={user} />
              ) : (
                <div style={{ padding: 20 }}>Access denied — admin only.</div>
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
