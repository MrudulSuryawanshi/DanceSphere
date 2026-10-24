import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Heart, Menu, X, Music2, Mail, Phone, ChevronDown, CheckCircle2, Plus, Pencil, Trash2, Users, CalendarDays, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cities, categories, initialClasses, readClasses, saveClasses } from "../data";
import { api } from "../api";
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api.adminUsers()
      .then((data) => { if (active) setUsers(Array.isArray(data) ? data : []); })
      .catch((err) => { if (active) setError(err.message || "Unable to load users."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const labels = { student: "Students", owner: "Studio owners", admin: "Administrators" };
  const filtered = users.filter((item) => item.role === role);
  return <main className="page-main">
    <div className="page-hero small-page-hero"><div className="eyebrow">ADMIN WORKSPACE</div><h1>People make the <em>place.</em></h1><p>Registered accounts from the DanceSphere database.</p></div>
    <div className="info-grid">{Object.entries(labels).map(([key,label]) => <button key={key} type="button" className={`info-card user-role-card ${role===key?"active":""}`} onClick={() => setRole(key)} aria-pressed={role===key}>
      {key==="student"?<Users/>:key==="owner"?<Music2/>:<LayoutDashboard/>}<h3>{label}</h3><p>{users.filter(u=>u.role===key).length} registered</p></button>)}</div>
    {loading?<div className="empty-state"><p>Loading registered users…</p></div>:error?<div className="empty-state"><h3>Could not load users</h3><p>{error}</p><p>Check that you are logged in as Admin and the backend is running.</p></div>:<section className="table-wrap"><h2>{labels[role]}</h2><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Registered</th></tr></thead><tbody>
      {filtered.map(u=><tr key={u.id}><td><strong>{u.name}</strong></td><td>{u.email}</td><td>{u.role}</td><td>{u.created_at?new Date(u.created_at).toLocaleDateString():"—"}</td></tr>)}
      {!filtered.length&&<tr><td colSpan="4" className="table-empty">No {labels[role].toLowerCase()} found in the database.</td></tr>}
    </tbody></table></section>}
  </main>;
}

export default AdminUsers;
