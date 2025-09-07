// client/src/App.jsx
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import TaskDashboard from "./components/TaskDashboard";
import AdminUsers from "./components/AdminUsers";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";

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

  // simple handler that sets user and stores to localStorage
  const handleLogin = (userObj) => {
    if (!userObj.id && userObj._id) userObj.id = userObj._id;
    setUser(userObj);
    localStorage.setItem("user", JSON.stringify(userObj));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // optionally redirect to home
    window.location.href = "/";
  };

  return (
    <BrowserRouter>
      <NavBar user={user} onLogout={handleLogout} />

      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <TaskDashboard user={user} onLogout={handleLogout} />
            ) : (
              <AuthLanding onLogin={handleLogin} />
            )
          }
        />

        {/* Admin route — protected for admins only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} roles={['admin']}>
              <AdminUsers user={user} />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// small combined login/register landing to keep route simple
function AuthLanding({ onLogin }) {
  const [showRegister, setShowRegister] = useState(false);
  return showRegister ? (
    <RegisterForm onRegistered={onLogin} switchToLogin={() => setShowRegister(false)} />
  ) : (
    <LoginForm onLogin={onLogin} switchToRegister={() => setShowRegister(true)} />
  );
}
