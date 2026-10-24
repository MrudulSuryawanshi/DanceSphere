import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Heart, Menu, X, Music2, Mail, Phone, ChevronDown, CheckCircle2, Plus, Pencil, Trash2, Users, CalendarDays, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cities, categories, initialClasses, readClasses, saveClasses } from "../data";
import { api } from "../api";
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";
import NotFound from "./NotFound.jsx";

function EnquiryPage({ classes }) {
  const { id } = useParams();
  const c = classes.find((x) => String(x.id) === id);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!c) return <NotFound />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const fd = new FormData(form);

    const enquiry = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      message: String(fd.get("message") || "").trim(),
      classId: c.id,
    };

    try {
      await api.createEnquiry(enquiry);
      setDone(true);
    } catch (err) {
      setError(
        err.message ||
          "Could not send the enquiry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-main">
      <div className="page-hero">
        <div className="eyebrow">TAKE THE FIRST STEP</div>
        <h1>
          Ask about <em>{c.name}.</em>
        </h1>
        <p>
          Leave a note and the studio can get back to you.
        </p>
      </div>

      <div className="form-card contact-card">
        {done ? (
          <div className="success-large">
            <CheckCircle2 size={32} />
            <h2>Enquiry sent successfully!</h2>
            <p>Your enquiry has been submitted to the DanceSphere API.</p>
            <Link to="/classes" className="button">
              Explore more classes
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="enquiry-summary">
              <strong>{c.name}</strong>
              <span>
                {c.studio} · {c.city} · {money(c.fee)}/month
              </span>
            </div>

            <div className="form-two">
              <label className="form-label">
                Your name
                <input
                  name="name"
                  required
                  minLength="2"
                  placeholder="Full name"
                />
              </label>

              <label className="form-label">
                Email address
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <label className="form-label">
              Message
              <textarea
                name="message"
                required
                minLength="5"
                rows="4"
                placeholder="I'd love to know more about this class..."
              />
            </label>

            {error && <p className="error-message">{error}</p>}

            <button className="button" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send enquiry"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default EnquiryPage;
