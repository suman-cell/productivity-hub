// client/src/components/TaskDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useToast } from "./ToastContext";

export default function TaskDashboard({ user }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // NEW
  const navigate = useNavigate();
  const toast = useToast();

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
      toast.show("Failed to load tasks", "error");
    }
  }

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  async function addTask(e) {
    e.preventDefault();
    if (!title) {
      toast.show("Please enter a task title", "error");
      return;
    }
    setLoading(true);
    try {
      await API.post("/tasks", { title, description: "" });
      setTitle("");
      await fetchTasks();
      toast.show("Task added", "success");
    } catch (err) {
      console.error(err);
      toast.show(err?.response?.data?.msg || "Failed to add task", "error");
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(t) {
    const nextStatus =
      t.status === "todo"
        ? "inprogress"
        : t.status === "inprogress"
        ? "done"
        : "todo";
    try {
      const res = await API.put(`/tasks/${t._id}`, { status: nextStatus });
      setTasks((prev) => prev.map((x) => (x._id === t._id ? res.data : x)));
      toast.show("Task updated", "success");
    } catch (err) {
      console.error(err);
      toast.show(err?.response?.data?.msg || "Update failed", "error");
    }
  }

  async function removeTask(id) {
    if (!confirm("Delete task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.show("Task deleted", "info");
    } catch (err) {
      console.error("Delete failed", err);
      toast.show(err?.response?.data?.msg || "Delete failed", "error");
    }
  }

  // counts
  const counts = {
    all: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inprogress: tasks.filter((t) => t.status === "inprogress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  const progressPct =
    counts.all === 0 ? 0 : Math.round((counts.done / counts.all) * 100);

  // filtering + searching
  let visibleTasks = tasks
    .filter((t) => filter === "all" || t.status === filter)
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  // NEW: sorting logic
  visibleTasks = [...visibleTasks].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>Tasks</h1>
        {isAdmin() && (
          <button
            className="btn"
            onClick={() => navigate("/admin")}
            style={{ marginLeft: 12 }}
          >
            Admin: Users
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 6, fontSize: 14, color: "var(--muted)" }}>
          Progress: {progressPct}%
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>
      </div>

      {/* Filter + Sort row */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {["all", "todo", "inprogress", "done"].map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`btn ${filter === key ? "btn-primary" : ""}`}
          >
            {key.toUpperCase()} ({counts[key]})
          </button>
        ))}

        {/* NEW: sort dropdown */}
        <select
          className="input"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ maxWidth: 180, marginLeft: "auto" }}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="title">Title (A–Z)</option>
        </select>
      </div>

      {/* Search */}
      <div
        className="card"
        style={{ marginBottom: 16, display: "flex", gap: 8 }}
      >
        <input
          className="input"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      {/* Add task */}
      <div className="card" style={{ marginBottom: 16 }}>
        <form onSubmit={addTask} className="row">
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New task title"
          />
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </button>
        </form>
      </div>

      {/* Task list */}
      <div className="card">
        {visibleTasks.length === 0 && (
          <p style={{ color: "var(--muted)" }}>No tasks found.</p>
        )}
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {visibleTasks.map((t) => (
            <li key={t._id} className="task">
              <div>
                <div className="task-title">{t.title}</div>
                <div className="task-meta">
                  {t.status} • {new Date(t.createdAt).toLocaleString()}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 13,
                    color: "#cbd5e1",
                  }}
                >
                  Assigned to:{" "}
                  {t.assignee
                    ? typeof t.assignee === "string"
                      ? t.assignee
                      : t.assignee.name || t.assignee.email
                    : "Unassigned"}{" "}
                  {t.assignee && typeof t.assignee !== "string" && (
                    <span className="badge" style={{ marginLeft: 8 }}>
                      {t.assignee.role || "member"}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {(isAdmin() || isAssignee(t)) && (
                  <button className="btn" onClick={() => toggleStatus(t)}>
                    Toggle Status
                  </button>
                )}

                {(isAdmin() || isAssignee(t)) ? (
                  <button
                    className="btn"
                    onClick={() => removeTask(t._id)}
                    style={{ color: "crimson" }}
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
