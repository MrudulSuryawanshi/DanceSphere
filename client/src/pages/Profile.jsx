import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Heart, Menu, X, Music2, Mail, Phone, ChevronDown, CheckCircle2, Plus, Pencil, Trash2, Users, CalendarDays, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cities, categories, initialClasses, readClasses, saveClasses } from "../data";
import { api } from "../api";
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";
import LoginRequired from "../components/LoginRequired.jsx";

function Profile({ user }) {
  return (
    <main className="page-main">
      <div className="page-hero">
        <div className="eyebrow">YOUR DETAILS</div>
        <h1>
          Your <em>profile.</em>
        </h1>
      </div>
      {user ? (
        <div className="form-card profile-card">
          <div className="profile-avatar">
            {user.name.slice(0, 1).toUpperCase()}
          </div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <span className="role-pill">{user.role}</span>
          <p className="muted">
            This profile belongs to your local demo session.
          </p>
        </div>
      ) : (
        <LoginRequired />
      )}
    </main>
  );
}

export default Profile;
