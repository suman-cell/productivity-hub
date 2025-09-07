import { useEffect, useState } from "react";
import API from "../api";

export default function AdminUsers({ user }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const roles = ['member','manager','admin'];

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await API.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.msg || 'Failed to load users');
    } finally { setLoading(false); }
  }

  useEffect(() => { fetchUsers(); }, []);

  async function changeRole(userId, newRole) {
    if (!confirm(`Change role to "${newRole}"?`)) return;
    try {
      const res = await API.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u._id === userId ? res.data : u));
      alert('Role updated');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.msg || 'Update failed');
    }
  }

  if (!user || user.role !== 'admin') {
    return <div style={{padding:20}}>Access denied — admin only.</div>;
  }

  return (
    <div style={{padding:20, maxWidth:900, margin:'0 auto'}}>
      <h2>Admin — Manage Users</h2>
      {loading ? <div>Loading...</div> : (
        <table style={{width:'100%',borderCollapse:'collapse',marginTop:12}}>
          <thead>
            <tr style={{textAlign:'left',borderBottom:'1px solid #ddd'}}>
              <th>Name</th><th>Email</th><th>Role</th><th>Created</th><th></th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={{borderBottom:'1px solid #f0f0f0'}}>
                <td style={{padding:8}}>{u.name}</td>
                <td style={{padding:8}}>{u.email}</td>
                <td style={{padding:8}}>
                  <select value={u.role} onChange={(e) => changeRole(u._id, e.target.value)}>
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td style={{padding:8}}>{new Date(u.createdAt).toLocaleString()}</td>
                <td style={{padding:8}}>{u._id === user.id ? '(you)' : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
