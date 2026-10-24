import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Heart, Menu, X, Music2, Mail, Phone, ChevronDown, CheckCircle2, Plus, Pencil, Trash2, Users, CalendarDays, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cities, categories, initialClasses, readClasses, saveClasses } from "../data";
import { api } from "../api";
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";

function Taxonomy() {
  return (
    <main className="page-main">
      <div className="page-hero small-page-hero">
        <div className="eyebrow">ADMIN WORKSPACE</div>
        <h1>
          Places & <em>styles.</em>
        </h1>
        <p>Available city and category values used by the directory.</p>
      </div>
      <div className="taxonomy-grid">
        <div className="panel-card">
          <h2>Cities</h2>
          {cities.slice(1).map((c) => (
            <div className="taxonomy-item" key={c}>
              <MapPin size={15} />
              {c}
              <CheckCircle2 size={15} />
            </div>
          ))}
        </div>
        <div className="panel-card">
          <h2>Dance styles</h2>
          {categories.slice(1).map((c) => (
            <div className="taxonomy-item" key={c}>
              <Music2 size={15} />
              {c}
              <CheckCircle2 size={15} />
            </div>
          ))}
        </div>
      </div>
      <p className="data-note">
        This demonstration shows the taxonomy configuration. Persistent
        management endpoints are documented in the backend API guide.
      </p>
    </main>
  );
}

export default Taxonomy;
