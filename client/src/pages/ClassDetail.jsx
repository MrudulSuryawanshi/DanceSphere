import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Heart, Menu, X, Music2, Mail, Phone, ChevronDown, CheckCircle2, Plus, Pencil, Trash2, Users, CalendarDays, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cities, categories, initialClasses, readClasses, saveClasses } from "../data";
import { api } from "../api";
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";
import NotFound from "./NotFound.jsx";

function ClassDetail({ classes }) {
  const { id } = useParams();
  const c = classes.find((x) => String(x.id) === id);
  const [sent, setSent] = useState(false);
  if (!c) return <NotFound />;
  return (
    <main className="page-main detail-page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> / <Link to="/classes">Classes</Link> / {c.name}
      </div>
      <div className="detail-layout">
        <div>
          <img
            className="detail-image"
            src={c.image || safeImg}
            alt={c.name}
            onError={(e) => (e.currentTarget.src = safeImg)}
          />
          <div className="detail-description">
            <div className="eyebrow">A LITTLE ABOUT THE CLASS</div>
            <h2>Come as you are.</h2>
            <p>{c.description}</p>
            <h3>What to expect</h3>
            <p>
              Supportive teaching, time to practise, and space to grow at your
              own pace. Wear comfortable clothes and bring water.
            </p>
          </div>
        </div>
        <aside className="detail-card">
          <span className="image-tag static-tag">{c.category}</span>
          <h1>{c.name}</h1>
          <p className="studio-name">{c.studio}</p>
          <div className="detail-facts">
            <div>
              <MapPin size={17} />
              <span>
                <small>LOCATION</small>
                {c.city}
              </span>
            </div>
            <div>
              <CalendarDays size={17} />
              <span>
                <small>WHEN</small>
                {c.timing}
              </span>
            </div>
            <div>
              <Users size={17} />
              <span>
                <small>LEVEL & AGE</small>
                {c.level} · {c.age}
              </span>
            </div>
            <div>
              <Music2 size={17} />
              <span>
                <small>TEACHER</small>
                {c.instructor}
              </span>
            </div>
          </div>
          <div className="detail-price">
            <strong>{money(c.fee)}</strong>
            <span>/ month</span>
          </div>
          {sent ? (
            <div className="success-note">
              <CheckCircle2 size={18} /> Enquiry saved in this demo. The studio
              can follow up with you.
            </div>
          ) : (
            <Link to={`/enquiry/${c.id}`} className="button button-wide">
              Ask about this class <ArrowRight size={17} />
            </Link>
          )}
          <p className="fine-print">
            This is a demo listing for the college project. Please verify
            details before attending.
          </p>
        </aside>
      </div>
    </main>
  );
}

export default ClassDetail;
