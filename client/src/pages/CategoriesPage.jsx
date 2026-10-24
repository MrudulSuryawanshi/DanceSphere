import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Heart, Menu, X, Music2, Mail, Phone, ChevronDown, CheckCircle2, Plus, Pencil, Trash2, Users, CalendarDays, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cities, categories, initialClasses, readClasses, saveClasses } from "../data";
import { api } from "../api";
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";

function CategoriesPage() {
  const copy = {
    Bollywood: "Big expressions, familiar beats and feel-good choreography.",
    "Hip-Hop":
      "Find your groove through foundations, freestyle and musicality.",
    Contemporary: "Explore space, balance, floorwork and storytelling.",
    Classical: "Build technique and expression through traditional forms.",
    Salsa: "Partner work, rhythm and social dance in a welcoming room.",
    Ballet: "Posture, balance and technique, one careful step at a time.",
    Jazz: "Musical accents, dynamic movement and stage-inspired energy.",
    Zumba: "A dance-based workout that feels more like a party.",
  };
  return (
    <main className="page-main">
      <div className="page-hero">
        <div className="eyebrow">EVERY STYLE HAS A STORY</div>
        <h1>
          Follow the feeling.
          <br />
          <em>Find your style.</em>
        </h1>
        <p>You don't need to know the steps before you start.</p>
      </div>
      <div className="style-list">
        {categories.slice(1).map((c, i) => (
          <Link
            to={`/classes?category=${encodeURIComponent(c)}`}
            key={c}
            className="style-row"
          >
            <span className="style-no">0{i + 1}</span>
            <div>
              <h2>{c}</h2>
              <p>{copy[c]}</p>
            </div>
            <span className="style-count">
              {initialClasses.filter((x) => x.category === c).length} classes
            </span>
            <ArrowRight />
          </Link>
        ))}
      </div>
    </main>
  );
}

export default CategoriesPage;
