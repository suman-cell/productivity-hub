import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import TaskDashboard from "./components/TaskDashboard";

function App() {
  const [user, setUser] = useState(null);

  // load user from localStorage if token present (simple)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const onLogin = (userObj) => {
    localStorage.setItem("user", JSON.stringify(userObj));
    setUser(userObj);
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <>
      {!user ? (
        <LoginForm onLogin={onLogin} />
      ) : (
        <TaskDashboard user={user} onLogout={onLogout} />
      )}
    </>
  );
}

export default App;
