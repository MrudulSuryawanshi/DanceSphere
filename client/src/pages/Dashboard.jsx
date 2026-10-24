import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Heart, Menu, X, Music2, Mail, Phone, ChevronDown, CheckCircle2, Plus, Pencil, Trash2, Users, CalendarDays, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cities, categories, initialClasses, readClasses, saveClasses } from "../data";
import { api } from "../api";
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";
import Stat from "../components/Stat.jsx";
import LoginRequired from "../components/LoginRequired.jsx";

function Dashboard({ user, classes, logout }) {
  if (!user) return <LoginRequired />;
  const mine = classes.filter((c) => c.ownerEmail === user.email);
  const owner = user.role === "owner",
    admin = user.role === "admin";
  return (
    <main className="page-main dashboard-page">
      <div className="dashboard-welcome">
        <div>
          <div className="eyebrow">
            {admin
              ? "ADMIN WORKSPACE"
              : owner
                ? "STUDIO WORKSPACE"
                : "YOUR SPACE"}
          </div>
          <h1>
            Good to have you, <em>{user.name.split(" ")[0]}.</em>
          </h1>
          <p>
            {admin
              ? "Here’s what’s happening across DanceSphere."
              : owner
                ? "A quick look at your studio and classes."
                : "Your next favourite class could be one click away."}
          </p>
        </div>
        <button className="button button-outline" onClick={logout}>
          <LogOut size={16} /> Log out
        </button>
      </div>
      <div className="stats-grid">
        <Stat
          icon={<Music2 />}
          label={
            admin
              ? "All classes"
              : owner
                ? "Your classes"
                : "Classes to explore"
          }
          value={
            admin
              ? classes.length
              : owner
                ? mine.length
                : classes.filter((c) => c.status === "approved").length
          }
        />
        <Stat
          icon={<Users />}
          label={admin ? "Sample members" : "Enquiries"}
          value={admin ? "24" : owner ? "0" : "0"}
        />
        <Stat
          icon={<CalendarDays />}
          label="Upcoming sessions"
          value={owner ? "—" : "12"}
        />
      </div>
      {admin ? (
        <div className="dashboard-panels">
          <div className="panel-card">
            <h2>Needs a look</h2>
            <p>Review new class listings before they appear publicly.</p>
            <Link className="button" to="/admin/classes">
              Review classes <ArrowRight size={15} />
            </Link>
          </div>
          <div className="panel-card">
            <h2>Platform settings</h2>
            <p>Manage the cities and dance categories used in search.</p>
            <Link className="button button-outline" to="/admin/taxonomy">
              Manage categories
            </Link>
          </div>
          <div className="panel-card">
            <h2>People</h2>
            <p>View the demo users and account roles.</p>
            <Link className="button button-outline" to="/admin/users">
              Manage users
            </Link>
          </div>
        </div>
      ) : owner ? (
        <div className="dashboard-panels">
          <div className="panel-card">
            <h2>Your class listings</h2>
            <p>Add a class or update the details of an existing listing.</p>
            <Link className="button" to="/owner/classes/new">
              <Plus size={16} /> Add a class
            </Link>
            <Link className="text-link block-link" to="/owner/classes">
              Manage your classes <ArrowRight size={15} />
            </Link>
          </div>
          <div className="panel-card">
            <h2>Studio profile</h2>
            <p>Keep your studio details and contact information up to date.</p>
            <Link className="button button-outline" to="/owner/studio">
              Edit studio profile
            </Link>
          </div>
          <div className="panel-card">
            <h2>Enquiries</h2>
            <p>Review interest from people looking for a class.</p>
            <Link className="button button-outline" to="/owner/enquiries">
              View enquiries
            </Link>
          </div>
        </div>
      ) : (
        <div className="panel-card student-panel">
          <h2>Start exploring</h2>
          <p>Use city and style filters to find a class that fits your week.</p>
          <Link className="button" to="/classes">
            Browse classes <ArrowRight size={16} />
          </Link>
          <Link className="text-link block-link" to="/profile">
            Edit your profile
          </Link>
        </div>
      )}
    </main>
  );
}

export default Dashboard;
