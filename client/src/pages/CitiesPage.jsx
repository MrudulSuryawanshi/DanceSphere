import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Heart, Menu, X, Music2, Mail, Phone, ChevronDown, CheckCircle2, Plus, Pencil, Trash2, Users, CalendarDays, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cities, categories, initialClasses, readClasses, saveClasses } from "../data";
import { api } from "../api";
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";

function CitiesPage() {
  const counts = initialClasses.reduce(
    (a, c) => ({ ...a, [c.city]: (a[c.city] || 0) + 1 }),
    {},
  );
  return (
    <main className="page-main">
      <div className="page-hero">
        <div className="eyebrow">FIND YOUR LOCAL SCENE</div>
        <h1>
          Good things happen
          <br />
          <em>close to home.</em>
        </h1>
        <p>Choose a city and see what's happening on the dance floor.</p>
      </div>
      <div className="city-card-grid">
        {cities.slice(1).map((c, i) => (
          <Link
            key={c}
            to={`/classes?city=${encodeURIComponent(c)}`}
            className={`city-card city-card-${i}`}
          >
            <span className="city-card-no">0{i + 1} / CITY GUIDE</span>
            <div>
              <h2>{c}</h2>
              <p>{counts[c] || 0} sample classes to explore</p>
            </div>
            <span className="city-card-arrow">
              <ArrowRight />
            </span>
          </Link>
        ))}
      </div>
      <p className="data-note">
        Listings shown here are sample project data, not verified businesses.
      </p>
    </main>
  );
}

export default CitiesPage;
