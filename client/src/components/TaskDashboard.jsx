import { useEffect, useState } from "react";
import API from "../api";

export default function TaskDashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  async function fetchTasks() {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  async function addTask(e) {
    e.preventDefault();
    if (!title) return;
    try {
      await API.post("/tasks", { title, description: "" });
      setTitle("");
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.msg || "Failed to add task");
    }
  }

  async function removeTask(id) {
    if (!confirm("Delete task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  return (
    <div style={{padding:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h1>Tasks</h1>
        <div>
          <strong>{user?.name}</strong>
          <button onClick={onLogout} style={{marginLeft:12}}>Logout</button>
        </div>
      </div>

      <form onSubmit={addTask} style={{marginBottom:16}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="New task title" style={{padding:8,width:"60%",marginRight:8}} />
        <button type="submit" style={{padding:8}}>Add</button>
      </form>

      <ul style={{listStyle:"none",padding:0}}>
        {tasks.map(t => (
          <li key={t._id} style={{padding:12, borderBottom:"1px solid #eee", display:"flex", justifyContent:"space-between"}}>
            <div>
              <div style={{fontWeight:600}}>{t.title}</div>
              <div style={{color:"#666",fontSize:13}}>{t.status} • {new Date(t.createdAt).toLocaleString()}</div>
            </div>
            <div>
              <button onClick={()=>removeTask(t._id)} style={{marginLeft:8}}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
