// client/src/components/TaskDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useToast } from "./ToastContext";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function TaskDashboard({ user }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
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

  async function updateStatus(id, status) {
    try {
      const res = await API.put(`/tasks/${id}`, { status });
      setTasks(prev => prev.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.error(err);
      toast.show("Update failed", "error");
    }
  }

  async function removeTask(id) {
    if (!confirm("Delete task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
      toast.show("Task deleted", "info");
    } catch (err) {
      console.error("Delete failed", err);
      toast.show(err?.response?.data?.msg || "Delete failed", "error");
    }
  }

  // group tasks by status
  const columns = {
    todo: tasks.filter(t => t.status === "todo"),
    inprogress: tasks.filter(t => t.status === "inprogress"),
    done: tasks.filter(t => t.status === "done"),
  };

  function onDragEnd(result) {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    // if moved across columns → update status in DB
    if (source.droppableId !== destination.droppableId) {
      updateStatus(draggableId, destination.droppableId);
    }
  }

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Kanban Board</h1>
        {isAdmin() && (
          <button className="btn" onClick={() => navigate('/admin')} style={{ marginLeft: 12 }}>
            Admin: Users
          </button>
        )}
      </div>

      {/* Add task form */}
      <div className="card" style={{ marginBottom: 16 }}>
        <form onSubmit={addTask} className="row">
          <input
            className="input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="New task title"
          />
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </button>
        </form>
      </div>

      {/* Kanban columns */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban">
          {["todo", "inprogress", "done"].map(col => (
            <Droppable droppableId={col} key={col}>
              {(provided, snapshot) => (
                <div
                  className={`kanban-column ${snapshot.isDraggingOver ? "dragging" : ""}`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h3 className="kanban-title">{col.toUpperCase()}</h3>
                  {columns[col].map((t, index) => (
                    <Draggable draggableId={t._id} index={index} key={t._id}>
                      {(provided, snapshot) => (
                        <div
                          className={`kanban-task ${snapshot.isDragging ? "dragging" : ""}`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="task-title">{t.title}</div>
                          <div className="task-meta">
                            {new Date(t.createdAt).toLocaleString()}
                          </div>
                          <div style={{ fontSize: 12, marginTop: 6, color: "var(--muted)" }}>
                            {t.assignee ? (typeof t.assignee === "string" ? t.assignee : t.assignee.name || t.assignee.email) : "Unassigned"}
                          </div>
                          {(isAdmin() || isAssignee(t)) && (
                            <button className="btn" onClick={() => removeTask(t._id)} style={{ marginTop: 6, color: "crimson" }}>
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
