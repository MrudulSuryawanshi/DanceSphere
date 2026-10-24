import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Heart, Menu, X, Music2, Mail, Phone, ChevronDown, CheckCircle2, Plus, Pencil, Trash2, Users, CalendarDays, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cities, categories, initialClasses, readClasses, saveClasses } from "../data";
import { api } from "../api";
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";

function Practicals() {
  const items = [
    [
      "HTML structure",
      "Semantic page structure, headings, lists and imagery.",
      "client/src/App.jsx",
    ],
    [
      "CSS design",
      "External stylesheet, responsive Flexbox/Grid, positioning and transitions.",
      "client/src/styles.css",
    ],
    [
      "JavaScript",
      "Filtering, sorting, event handlers, array methods and browser storage.",
      "client/src/App.jsx",
    ],
    [
      "React",
      "Functional components, JSX, props, hooks, routing and conditional rendering.",
      "client/src/App.jsx",
    ],
    [
      "Fetch & JSON",
      "Centralized API service with JSON requests.",
      "client/src/api.js",
    ],
    [
      "DOM events",
      "Interactive form controls and the dedicated HTML demonstration.",
      "client/public/practical-demo.html",
    ],
    [
      "PHP",
      "Validation, string functions, sessions and PDO CRUD.",
      "php-practicals/index.php",
    ],
    [
      "Node & Express",
      "Routes, middleware, static files and REST endpoints.",
      "server/src/index.js",
    ],
  ];
  return (
    <main className="page-main">
      <div className="page-hero">
        <div className="eyebrow">BUILT FOR THE CLASSROOM</div>
        <h1>
          Learning by <em>building.</em>
        </h1>
        <p>
          Find the practical examples and implementation notes in this project.
        </p>
      </div>
      <div className="practical-list">
        {items.map((x, i) => (
          <div className="practical-row" key={x[0]}>
            <span className="style-no">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3>{x[0]}</h3>
              <p>{x[1]}</p>
              <code>{x[2]}</code>
            </div>
          </div>
        ))}
      </div>
      <p className="data-note">
        The complete 15-practical mapping is available in
        docs/SYLLABUS_MAPPING.md.
      </p>
    </main>
  );
}

export default Practicals;
