import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Heart, Menu, X, Music2, Mail, Phone, ChevronDown, CheckCircle2, Plus, Pencil, Trash2, Users, CalendarDays, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cities, categories, initialClasses, readClasses, saveClasses } from "../data";
import { api } from "../api";
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";
import LoginRequired from "../components/LoginRequired.jsx";

function ClassForm({ classes, user, updateClass }) {
  const { id } = useParams();
  const nav = useNavigate();
  const existing = classes.find((c) => String(c.id) === id);
  const [err, setErr] = useState("");
  const submit = (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget));
    if (Number(d.fee) <= 0) {
      setErr("Fee must be greater than zero.");
      return;
    }
    updateClass({
      ...existing,
      ...d,
      fee: Number(d.fee),
      ownerEmail: user?.email,
      studio: d.studio || "My Dance Studio",
    });
    nav("/owner/classes");
  };
  return (
    <main className="page-main">
      <div className="page-hero small-page-hero">
        <div className="eyebrow">STUDIO WORKSPACE</div>
        <h1>
          {existing ? "Edit your class" : "Add a new class"}
          <em>.</em>
        </h1>
        <p>Tell people what makes your class a good place to start.</p>
      </div>
      {!user ? (
        <LoginRequired />
      ) : (
        <div className="form-card wide-form">
          <form onSubmit={submit}>
            <div className="form-two">
              <label className="form-label">
                Class name
                <input
                  name="name"
                  required
                  defaultValue={existing?.name}
                  placeholder="e.g. Bollywood Foundations"
                />
              </label>
              <label className="form-label">
                Studio name
                <input
                  name="studio"
                  required
                  defaultValue={existing?.studio}
                  placeholder="Your studio"
                />
              </label>
            </div>
            <div className="form-two">
              <label className="form-label">
                City
                <select name="city" defaultValue={existing?.city || "Pune"}>
                  {cities.slice(1).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="form-label">
                Dance style
                <select
                  name="category"
                  defaultValue={existing?.category || "Bollywood"}
                >
                  {categories.slice(1).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-two">
              <label className="form-label">
                Monthly fee (₹)
                <input
                  type="number"
                  name="fee"
                  min="1"
                  required
                  defaultValue={existing?.fee || 1800}
                />
              </label>
              <label className="form-label">
                Level
                <select
                  name="level"
                  defaultValue={existing?.level || "Beginner"}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>All levels</option>
                  <option>Advanced</option>
                </select>
              </label>
            </div>
            <div className="form-two">
              <label className="form-label">
                Schedule
                <input
                  name="timing"
                  required
                  defaultValue={existing?.timing}
                  placeholder="Mon, Wed · 6:30 PM"
                />
              </label>
              <label className="form-label">
                Duration
                <input
                  name="duration"
                  defaultValue={existing?.duration || "60 min"}
                  required
                />
              </label>
            </div>
            <div className="form-two">
              <label className="form-label">
                Age group
                <input
                  name="age"
                  defaultValue={existing?.age || "16+"}
                  required
                />
              </label>
              <label className="form-label">
                Instructor
                <input
                  name="instructor"
                  defaultValue={existing?.instructor}
                  required
                />
              </label>
            </div>
            <label className="form-label">
              Class description
              <textarea
                name="description"
                rows="4"
                required
                defaultValue={existing?.description}
                placeholder="What will students learn?"
              />
            </label>
            <label className="form-label">
              Image URL (optional)
              <input
                name="image"
                defaultValue={existing?.image}
                placeholder="https://..."
              />
            </label>
            {err && <p className="error-message">{err}</p>}
            <button className="button">
              {existing ? "Save changes" : "Submit for approval"}{" "}
              <ArrowRight size={16} />
            </button>
            <p className="muted form-footnote">
              New listings are marked pending in this demo until reviewed by an
              administrator.
            </p>
          </form>
        </div>
      )}
    </main>
  );
}

export default ClassForm;
