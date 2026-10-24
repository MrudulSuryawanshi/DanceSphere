import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Heart, Menu, X, Music2, Mail, Phone, ChevronDown, CheckCircle2, Plus, Pencil, Trash2, Users, CalendarDays, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cities, categories, initialClasses, readClasses, saveClasses } from "../data";
import { api } from "../api";
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";

function StudioPage({ classes }) {
  const { studio } = useParams();
  const items = classes.filter(
    (c) => c.studio.toLowerCase() === decodeURIComponent(studio).toLowerCase(),
  );
  if (!items.length) return <NotFound />;
  return (
    <main className="page-main">
      <div className="page-hero">
        <div className="eyebrow">MEET THE STUDIO</div>
        <h1>
          {items[0].studio}
          <em>.</em>
        </h1>
        <p>
          <MapPin size={15} className="inline-icon" />
          {items[0].city} · A welcoming place to move and learn.
        </p>
      </div>
      <div className="class-grid">
        {items.map((c) => (
          <ClassCard key={c.id} item={c} />
        ))}
      </div>
    </main>
  );
}

export default StudioPage;
