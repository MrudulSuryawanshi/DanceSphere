import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Heart, Menu, X, Music2, Mail, Phone, ChevronDown, CheckCircle2, Plus, Pencil, Trash2, Users, CalendarDays, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cities, categories, initialClasses, readClasses, saveClasses } from "../data";
import { api } from "../api";
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";

function About() {
  return (
    <main className="page-main">
      <div className="story-layout">
        <div className="story-image">
          <img
            src="https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1000&q=85"
            alt="Dance community"
          />
        </div>
        <div className="story-copy">
          <div className="eyebrow">WHY WE'RE HERE</div>
          <h1>
            Dance is for <em>everybody.</em>
          </h1>
          <p>
            DanceSphere started with a simple thought: finding a class shouldn't
            be the hardest part of learning to dance.
          </p>
          <p>
            We're bringing studios, teachers and curious beginners together in
            one friendly place. Whether you're returning to a childhood passion
            or trying your first step, there's room for you here.
          </p>
          <p className="muted">
            This is an academic demonstration project. Studio listings are
            sample content.
          </p>
          <Link to="/classes" className="button">
            Find a class <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}

export default About;
