import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Heart, Menu, X, Music2, Mail, Phone, ChevronDown, CheckCircle2, Plus, Pencil, Trash2, Users, CalendarDays, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cities, categories, initialClasses, readClasses, saveClasses } from "../data";
import { api } from "../api";
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";

function AdminClasses({ classes, setStatus }) {
  return (
    <main className="page-main">
      <div className="page-hero small-page-hero">
        <div className="eyebrow">ADMIN WORKSPACE</div>
        <h1>
          Listing <em>review.</em>
        </h1>
        <p>Approve or reject studio-submitted listings.</p>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>City</th>
              <th>Studio</th>
              <th>Status</th>
              <th>Review</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((c) => (
              <tr key={c.id}>
                <td>
                  <strong>{c.name}</strong>
                  <small>{c.category}</small>
                </td>
                <td>{c.city}</td>
                <td>{c.studio}</td>
                <td>
                  <span className={`status status-${c.status}`}>
                    {c.status}
                  </span>
                </td>
                <td className="review-actions">
                  <button
                    onClick={() => setStatus(c.id, "approved")}
                    className="approve-button"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setStatus(c.id, "rejected")}
                    className="reject-button"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default AdminClasses;
