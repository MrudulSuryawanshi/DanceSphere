import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Heart, Menu, X, Music2, Mail, Phone, ChevronDown, CheckCircle2, Plus, Pencil, Trash2, Users, CalendarDays, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cities, categories, initialClasses, readClasses, saveClasses } from "../data";
import { api } from "../api";
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";

function StudioManage({ user }) {
  const [saved, setSaved] = useState(false);
  return (
    <main className="page-main">
      <div className="page-hero small-page-hero">
        <div className="eyebrow">STUDIO WORKSPACE</div>
        <h1>
          Your studio, <em>your story.</em>
        </h1>
      </div>
      <div className="form-card wide-form">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSaved(true);
          }}
        >
          <label className="form-label">
            Studio name
            <input
              required
              defaultValue={user?.name ? `${user.name}'s Studio` : ""}
              placeholder="Your studio name"
            />
          </label>
          <div className="form-two">
            <label className="form-label">
              City
              <select>
                <option>Pune</option>
                <option>Mumbai</option>
                <option>Nashik</option>
                <option>Bengaluru</option>
                <option>Delhi</option>
                <option>Hyderabad</option>
              </select>
            </label>
            <label className="form-label">
              Contact email
              <input type="email" required defaultValue={user?.email} />
            </label>
          </div>
          <label className="form-label">
            About the studio
            <textarea rows="4" placeholder="What makes your studio special?" />
          </label>
          <button className="button">Save studio profile</button>
          {saved && (
            <p className="success-inline">
              <CheckCircle2 size={16} /> Saved in this demo view.
            </p>
          )}
        </form>
      </div>
    </main>
  );
}

export default StudioManage;
