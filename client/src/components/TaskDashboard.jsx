import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function TaskDashboard({ user }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function isAdmin() {
    return user?.role === "admin";
  }

  function isAssignee(task) {
    if (!task) return false;
    const assignee = task.assignee;
    if (!assignee) return false;
    if (typeof assignee === "string") return assignee === user?.id || assignee === user?._id;
    return assignee._id === user?.id || assignee._id === user?._id || assignee.id === user?.id;
  }

  async function fetchTasks() {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
      alert("Failed to load tasks");
    }
  }

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  async function addTask(e) {
    e.preventDefault();
    if (!title) return;
    setLoading(true);
    try {
      await API.post("/tasks", { title, description: "" });
      setTitle("");
      await fetchTasks();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.msg || "Failed to add task");
    } finally {
      setLoading(false);
    }
  }

  async function removeTask(id) {
    if (!confirm("Delete task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert(err?.response?.data?.msg || "Delete failed");
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      {/* Page header: title + optional admin link (nav handles user + logout) */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Tasks</h1>

        {/* Keep a small admin nav button here only if you want; NavBar also has Admin link */}
        {isAdmin() && (
          <button onClick={() => navigate('/admin')} style={{ marginLeft: 12 }}>
            Admin: Users
          </button>
        )}
      </div>

      <form onSubmit={addTask} style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New task title" style={{ padding: 8, flex: 1 }} />
        <button type="submit" style={{ padding: 8 }} disabled={loading}>{loading ? "Adding..." : "Add"}</button>
      </form>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map(t => (
          <li key={t._id} style={{ padding: 12, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600 }}>{t.title}</div>
              <div style={{ color: "#666", fontSize: 13 }}>
                {t.status} • {new Date(t.createdAt).toLocaleString()}
              </div>
              <div style={{ marginTop: 6, fontSize: 13, color: "#444" }}>
                Assigned to:{" "}
                {t.assignee ? (typeof t.assignee === "string" ? t.assignee : t.assignee.name || t.assignee.email) : "Unassigned"}
                {" "}
                {t.assignee && (typeof t.assignee !== "string") && (
                  <span style={{ marginLeft: 8, padding: "2px 6px", borderRadius: 6, background: "#eef2ff", color: "#3730a3", fontSize: 12 }}>
                    {t.assignee.role || "member"}
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {(isAdmin() || isAssignee(t)) && (
                <button onClick={async () => {
                  const nextStatus = t.status === "todo" ? "inprogress" : (t.status === "inprogress" ? "done" : "todo");
                  try {
                    const res = await API.put(`/tasks/${t._id}`, { status: nextStatus });
                    setTasks(prev => prev.map(x => x._id === t._id ? res.data : x));
                  } catch (err) {
                    console.error(err);
                    alert("Update failed");
                  }
                }}>Toggle Status</button>
              )}

              {(isAdmin() || isAssignee(t)) ? (
                <button onClick={() => removeTask(t._id)} style={{ color: "crimson" }}>Delete</button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
