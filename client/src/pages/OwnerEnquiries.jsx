import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Heart, Menu, X, Music2, Mail, Phone, ChevronDown, CheckCircle2, Plus, Pencil, Trash2, Users, CalendarDays, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cities, categories, initialClasses, readClasses, saveClasses } from "../data";
import { api } from "../api";
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";

function OwnerEnquiries() {
  const [items, setItems] = useState(() =>
    JSON.parse(localStorage.getItem("ds_enquiries") || "[]"),
  );
  return (
    <main className="page-main">
      <div className="page-hero small-page-hero">
        <div className="eyebrow">STUDIO WORKSPACE</div>
        <h1>
          Class <em>enquiries.</em>
        </h1>
        <p>People who have asked to hear more about a class.</p>
      </div>
      <div className="enquiry-list">
        {items.map((x) => (
          <div className="enquiry-item" key={x.id}>
            <div>
              <strong>{x.name}</strong>
              <span>
                {x.email} · {x.className}
              </span>
              <p>{x.message}</p>
            </div>
            <span className="status status-pending">{x.status}</span>
          </div>
        ))}
        {!items.length && (
          <div className="empty-state">
            <h3>No enquiries yet.</h3>
            <p>
              When someone sends a class enquiry, it will appear here in this
              browser demo.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default OwnerEnquiries;
