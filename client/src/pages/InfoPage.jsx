import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Heart, Menu, X, Music2, Mail, Phone, ChevronDown, CheckCircle2, Plus, Pencil, Trash2, Users, CalendarDays, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cities, categories, initialClasses, readClasses, saveClasses } from "../data";
import { api } from "../api";
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";

function InfoPage({ title, eyebrow, intro }) {
  return (
    <main className="page-main">
      <div className="page-hero">
        <div className="eyebrow">{eyebrow}</div>
        <h1>
          {title}
          <em>.</em>
        </h1>
        <p>{intro}</p>
      </div>
      <div className="info-grid">
        {initialClasses.slice(0, 3).map((c) => (
          <div className="info-card" key={c.id}>
            <img src={c.image} alt="Dance studio" />
            <h3>{c.instructor}</h3>
            <p>
              {c.category} · {c.city}
            </p>
            <p className="muted">{c.studio}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default InfoPage;
