import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Heart, Menu, X, Music2, Mail, Phone, ChevronDown, CheckCircle2, Plus, Pencil, Trash2, Users, CalendarDays, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cities, categories, initialClasses, readClasses, saveClasses } from "../data";
import { api } from "../api";
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";
import ClassCard from "../components/ClassCard.jsx";

function Home({ classes }) {
  const [city, setCity] = useState("All cities");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const submit = (e) => {
    e.preventDefault();
    navigate(
      `/classes?city=${encodeURIComponent(city)}&q=${encodeURIComponent(query)}`,
    );
  };
  const featured = classes.filter((c) => c.status === "approved").slice(0, 4);
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-line"></span> YOUR NEXT CHAPTER STARTS HERE
          </div>
          <h1>
            Find your rhythm.
            <br />
            <em>Find your people.</em>
          </h1>
          <p className="hero-description">
            From first steps to full-out choreography, find a dance class that
            feels like yours.
          </p>
          <form className="search-panel" onSubmit={submit}>
            <label className="search-field">
              <MapPin size={18} />
              <span>
                <small>WHERE</small>
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                  {cities.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </span>
              <ChevronDown size={15} />
            </label>
            <label className="search-field search-keyword">
              <Search size={18} />
              <span>
                <small>WHAT DO YOU FEEL LIKE?</small>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Try hip-hop, Bollywood..."
                />
              </span>
            </label>
            <button className="button search-submit" type="submit">
              Find a class <ArrowRight size={17} />
            </button>
          </form>
          <div className="hero-note">
            <span className="avatar-stack">
              <i>A</i>
              <i>M</i>
              <i>R</i>
            </span>
            <span>
              <strong>Something for every body.</strong>
              <br />
              All levels. All kinds of movement.
            </span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-photo">
            <img
              src="https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1200&q=85"
              alt="Dancers practising in a studio"
            />
          </div>
          <div className="photo-note">
            <span className="note-star">✳</span>
            <span>
              <strong>Move a little.</strong>
              <br />
              Feel a lot.
            </span>
          </div>
          <div className="vertical-label">A PLACE TO BEGIN · EST. 2026</div>
          <div className="hero-circle">
            MOVE
            <br />
            YOUR
            <br />
            <em>WAY</em>
          </div>
        </div>
      </section>
      <section className="category-strip section-pad">
        <div className="section-heading compact-heading">
          <div>
            <div className="eyebrow">PICK YOUR MOOD</div>
            <h2>What moves you?</h2>
          </div>
          <Link to="/categories" className="text-link">
            All dance styles <ArrowRight size={16} />
          </Link>
        </div>
        <div className="category-grid">
          {categories.slice(1).map((c, i) => (
            <Link
              to={`/classes?category=${encodeURIComponent(c)}`}
              key={c}
              className={`category-tile cat-${i}`}
            >
              <span className="category-number">0{i + 1}</span>
              <span className="category-name">{c}</span>
              <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </section>
      <section className="featured-section section-pad">
        <div className="section-heading">
          <div>
            <div className="eyebrow">A FEW GOOD PLACES</div>
            <h2>Classes worth showing up for.</h2>
            <p>Thoughtfully picked places to find your next favourite thing.</p>
          </div>
          <Link to="/classes" className="button button-outline">
            Explore all classes <ArrowRight size={16} />
          </Link>
        </div>
        <div className="class-grid">
          {featured.map((c) => (
            <ClassCard key={c.id} item={c} />
          ))}
        </div>
      </section>
      <section className="city-band">
        <div>
          <div className="eyebrow">CLOSE TO HOME</div>
          <h2>Your city, your scene.</h2>
          <p>Find a studio around the corner or somewhere new to explore.</p>
          <Link to="/cities" className="button button-light">
            Explore cities <ArrowRight size={16} />
          </Link>
        </div>
        <div className="city-pills">
          {cities.slice(1).map((c, i) => (
            <Link to={`/classes?city=${encodeURIComponent(c)}`} key={c}>
              <span>0{i + 1}</span>
              {c}
              <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </section>
      <section className="owner-cta section-pad">
        <div className="owner-cta-image">
          <img
            src="https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1000&q=80"
            alt="Dance class in motion"
          />
        </div>
        <div className="owner-cta-copy">
          <div className="eyebrow">FOR THE PEOPLE WHO TEACH</div>
          <h2>
            Your studio deserves
            <br />
            to be <em>discovered.</em>
          </h2>
          <p>
            Bring your classes to a community that's looking for its next reason
            to move.
          </p>
          <Link to="/owner/register" className="button">
            List your studio <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
