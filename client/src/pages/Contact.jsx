import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Heart, Menu, X, Music2, Mail, Phone, ChevronDown, CheckCircle2, Plus, Pencil, Trash2, Users, CalendarDays, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cities, categories, initialClasses, readClasses, saveClasses } from "../data";
import { api } from "../api";
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";

function Contact() {
  const [done, setDone] = useState(false);
  return (
    <main className="page-main">
      <div className="page-hero">
        <div className="eyebrow">WE'RE ALL EARS</div>
        <h1>
          Let's have a <em>chat.</em>
        </h1>
        <p>Questions, feedback, or a studio to tell us about? Send a note.</p>
      </div>
      <div className="form-card contact-card">
        {done ? (
          <div className="success-large">
            <CheckCircle2 size={32} />
            <h2>Thanks for reaching out.</h2>
            <p>Your demo message has been recorded on this page.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
          >
            <div className="form-two">
              <label className="form-label">
                Your name
                <input required minLength="2" placeholder="Name" />
              </label>
              <label className="form-label">
                Email address
                <input type="email" required placeholder="you@example.com" />
              </label>
            </div>
            <label className="form-label">
              What is this about?
              <select>
                <option>General question</option>
                <option>I'm a studio owner</option>
                <option>Listing correction</option>
                <option>Feedback</option>
              </select>
            </label>
            <label className="form-label">
              Your message
              <textarea
                required
                minLength="10"
                rows="5"
                placeholder="Tell us a little more..."
              />
            </label>
            <button className="button">
              Send your message <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default Contact;
