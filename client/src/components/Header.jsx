import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Heart, Menu, X, Music2, Mail, Phone, ChevronDown, CheckCircle2, Plus, Pencil, Trash2, Users, CalendarDays, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cities, categories, initialClasses, readClasses, saveClasses } from "../data";
import { api } from "../api";
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";

function Header({ user, logout, mobileOpen, setMobileOpen }) {
  const links = [
    ["Explore", "/classes"],
    ["Cities", "/cities"],
    ["Dance styles", "/categories"],
    ["Our story", "/about"],
  ];
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <Music2 size={20} />
          </span>
          <span>
            dance<span className="brand-light">sphere</span>
            <small>FIND YOUR RHYTHM</small>
          </span>
        </Link>
        <nav className={`main-nav ${mobileOpen ? "is-open" : ""}`}>
          {links.map(([t, p]) => (
            <NavLink key={p} to={p} onClick={() => setMobileOpen(false)}>
              {t}
            </NavLink>
          ))}
          <Link to="/contact" className="nav-mobile">
            Contact
          </Link>
        </nav>
        <div className="nav-actions">
          <Link to={user ? "/dashboard" : "/login"} className="nav-login">
            {user ? `Hi, ${user.name.split(" ")[0]}` : "Log in"}
          </Link>
          {user ? (
            <button
              className="button button-small button-outline"
              onClick={logout}
            >
              Log out
            </button>
          ) : (
            <Link className="button button-small" to="/owner/register">
              List your studio <ArrowRight size={15} />
            </Link>
          )}
          <button
            className="icon-button menu-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
