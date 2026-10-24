import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Heart, Menu, X, Music2, Mail, Phone, ChevronDown, CheckCircle2, Plus, Pencil, Trash2, Users, CalendarDays, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cities, categories, initialClasses, readClasses, saveClasses } from "../data";
import { api } from "../api";
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";

function ClassCard({ item, compact = false }) {
  return (
    <article className={`class-card ${compact ? "compact" : ""}`}>
      <Link to={`/classes/${item.id}`} className="class-image-wrap">
        <img
          src={item.image || safeImg}
          alt={`${item.category} dance class`}
          onError={(e) => (e.currentTarget.src = safeImg)}
        />
        <span className="image-tag">{item.category}</span>
        <button
          className="heart-button"
          aria-label="Save class"
          onClick={(e) => {
            e.preventDefault();
            e.currentTarget.classList.toggle("hearted");
          }}
        >
          <Heart size={17} />
        </button>
      </Link>
      <div className="class-card-body">
        <div className="card-meta">
          <span>
            <MapPin size={13} />
            {item.city}
          </span>
          <span>{item.level}</span>
        </div>
        <Link to={`/classes/${item.id}`} className="class-title">
          {item.name}
        </Link>
        <p className="studio-name">{item.studio}</p>
        <div className="card-bottom">
          <strong>
            {money(item.fee)}
            <small> / month</small>
          </strong>
          <Link
            to={`/classes/${item.id}`}
            className="round-arrow"
            aria-label={`View ${item.name}`}
          >
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ClassCard;
