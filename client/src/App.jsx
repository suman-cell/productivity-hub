import { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import TaskDashboard from "./components/TaskDashboard";

export default function App() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (user) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  if (user) {
    return <TaskDashboard user={user} onLogout={handleLogout} />;
  }

  return showRegister ? (
    <RegisterForm onRegistered={() => setShowRegister(false)} switchToLogin={() => setShowRegister(false)} />
  ) : (
    <LoginForm onLogin={handleLogin} switchToRegister={() => setShowRegister(true)} />
  );
}
