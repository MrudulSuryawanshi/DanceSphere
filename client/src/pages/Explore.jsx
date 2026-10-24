import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Heart, Menu, X, Music2, Mail, Phone, ChevronDown, CheckCircle2, Plus, Pencil, Trash2, Users, CalendarDays, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cities, categories, initialClasses, readClasses, saveClasses } from "../data";
import { api } from "../api";
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";
import ClassCard from "../components/ClassCard.jsx";

function Explore({ classes }) {
  const loc = useLocation();
  const params = new URLSearchParams(loc.search);
  const [q, setQ] = useState(params.get("q") || "");
  const [city, setCity] = useState(params.get("city") || "All cities");
  const [cat, setCat] = useState(params.get("category") || "All styles");
  const [sort, setSort] = useState("featured");
  const [maxFee, setMaxFee] = useState("5000");
  useEffect(() => {
    const p = new URLSearchParams(loc.search);
    setQ(p.get("q") || "");
    setCity(p.get("city") || "All cities");
    setCat(p.get("category") || "All styles");
  }, [loc.search]);
  const filtered = useMemo(() => {
    let a = classes.filter((c) => c.status === "approved");
    if (city !== "All cities") a = a.filter((c) => c.city === city);
    if (cat !== "All styles") a = a.filter((c) => c.category === cat);
    if (q.trim()) {
      const term = q.toLowerCase();
      a = a.filter((c) =>
        [c.name, c.studio, c.category, c.instructor, c.city].some((v) =>
          String(v || "")
            .toLowerCase()
            .includes(term),
        ),
      );
    }
    a = a.filter((c) => Number(c.fee) <= Number(maxFee));
    if (sort === "fee-low") a.sort((x, y) => x.fee - y.fee);
    if (sort === "fee-high") a.sort((x, y) => y.fee - x.fee);
    if (sort === "name") a.sort((x, y) => x.name.localeCompare(y.name));
    return a;
  }, [classes, city, cat, q, sort, maxFee]);
  const reset = () => {
    setQ("");
    setCity("All cities");
    setCat("All styles");
    setMaxFee("5000");
    setSort("featured");
  };
  return (
    <main className="page-main">
      <div className="page-hero">
        <div className="eyebrow">THE CLASS DIRECTORY</div>
        <h1>
          A class for <em>your kind</em>
          <br />
          of movement.
        </h1>
        <p>Browse studios, find your style, and take the first step.</p>
      </div>
      <div className="explore-layout">
        <aside className="filter-panel">
          <div className="filter-title">
            <SlidersHorizontal size={17} /> <strong>Find your fit</strong>
            <button className="clear-button" onClick={reset}>
              Clear all
            </button>
          </div>
          <label className="form-label">
            Search
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Class, studio, instructor"
            />
          </label>
          <label className="form-label">
            City
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              {cities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="form-label">
            Dance style
            <select value={cat} onChange={(e) => setCat(e.target.value)}>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="form-label">
            Monthly fee up to <strong>{money(maxFee)}</strong>
            <input
              type="range"
              min="1000"
              max="5000"
              step="200"
              value={maxFee}
              onChange={(e) => setMaxFee(e.target.value)}
            />
            <div className="range-labels">
              <span>₹1,000</span>
              <span>₹5,000</span>
            </div>
          </label>
          <div className="filter-help">
            <Sparkles size={17} />
            <span>
              New to dance? Try a beginner class and take it one step at a time.
            </span>
          </div>
        </aside>
        <section className="results-panel">
          <div className="results-top">
            <div>
              <span className="results-count">{filtered.length} CLASSES</span>
              <h2>Find your next favourite.</h2>
            </div>
            <label className="sort-control">
              Sort by{" "}
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="fee-low">Fee: low to high</option>
                <option value="fee-high">Fee: high to low</option>
                <option value="name">Name: A–Z</option>
              </select>
            </label>
          </div>
          {filtered.length ? (
            <div className="class-grid">
              {filtered.map((c) => (
                <ClassCard key={c.id} item={c} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">
                <Search size={25} />
              </span>
              <h3>No classes found just yet.</h3>
              <p>Try another city or loosen up your filters.</p>
              <button className="button" onClick={reset}>
                Clear filters
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Explore;
