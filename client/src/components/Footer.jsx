import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Heart, Menu, X, Music2, Mail, Phone, ChevronDown, CheckCircle2, Plus, Pencil, Trash2, Users, CalendarDays, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cities, categories, initialClasses, readClasses, saveClasses } from "../data";
import { api } from "../api";
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" className="brand">
            <span className="brand-mark">
              <Music2 size={20} />
            </span>
            <span>
              dance<span className="brand-light">sphere</span>
              <small>FIND YOUR RHYTHM</small>
            </span>
          </Link>
          <p>Good classes. Good people. A little more room to move.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/classes">All classes</Link>
          <Link to="/cities">By city</Link>
          <Link to="/categories">Dance styles</Link>
        </div>
        <div>
          <h4>For studios</h4>
          <Link to="/owner/register">List your studio</Link>
          <Link to="/owner/login">Owner login</Link>
          <Link to="/admin/login">Admin login</Link>
        </div>
        <div>
          <h4>Say hello</h4>
          <a href="mailto:hello@dancesphere.example">
            <Mail size={15} /> hello@dancesphere.example
          </a>
          <a href="tel:+910000000000">
            <Phone size={15} /> +91 00000 00000
          </a>
          <div className="social-row">
            <span>◎</span>
            <Music2 size={17} />
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 DanceSphere · Made for the love of dance.</span>
        <span>Sample listings are for academic demonstration.</span>
        <Link to="/practicals">Web technologies practicals</Link>
      </div>
    </footer>
  );
}

export default Footer;
