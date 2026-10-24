import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Heart, Menu, X, Music2, Mail, Phone, ChevronDown, CheckCircle2, Plus, Pencil, Trash2, Users, CalendarDays, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cities, categories, initialClasses, readClasses, saveClasses } from "../data";
import { api } from "../api";
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";

function ManageClasses({ classes, user, removeClass }) {
  if (!user) return <LoginRequired />;
  const own = classes.filter((c) => c.ownerEmail === user.email);
  return (
    <main className="page-main">
      <div className="dashboard-welcome">
        <div>
          <div className="eyebrow">STUDIO WORKSPACE</div>
          <h1>
            Manage your <em>classes.</em>
          </h1>
        </div>
        <Link to="/owner/classes/new" className="button">
          <Plus size={16} /> Add class
        </Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>City</th>
              <th>Monthly fee</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {own.map((c) => (
              <tr key={c.id}>
                <td>
                  <strong>{c.name}</strong>
                  <small>
                    {c.category} · {c.studio}
                  </small>
                </td>
                <td>{c.city}</td>
                <td>{money(c.fee)}</td>
                <td>
                  <span className={`status status-${c.status}`}>
                    {c.status || "pending"}
                  </span>
                </td>
                <td className="table-actions">
                  <Link to={`/owner/classes/${c.id}/edit`} aria-label="Edit">
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm("Delete this class from the demo?"))
                        removeClass(c.id);
                    }}
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {!own.length && (
              <tr>
                <td colSpan="5" className="table-empty">
                  No classes created by this demo account yet. Add your first
                  class to begin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default ManageClasses;
