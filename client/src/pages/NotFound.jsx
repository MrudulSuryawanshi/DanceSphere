import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Heart, Menu, X, Music2, Mail, Phone, ChevronDown, CheckCircle2, Plus, Pencil, Trash2, Users, CalendarDays, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cities, categories, initialClasses, readClasses, saveClasses } from "../data";
import { api } from "../api";
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";

function NotFound() {
  return (
    <main className="page-main empty-state">
      <span className="eyebrow">WRONG TURN?</span>
      <h1>
        Let's find your <em>way back.</em>
      </h1>
      <p>That page isn't here, but your next class might be.</p>
      <Link to="/" className="button">
        Back to home <ArrowRight size={16} />
      </Link>
    </main>
  );
}

export default NotFound;
