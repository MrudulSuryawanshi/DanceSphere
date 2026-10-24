import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowRight, MapPin, Search, SlidersHorizontal, Heart, Menu, X, Music2, Mail, Phone, ChevronDown, CheckCircle2, Plus, Pencil, Trash2, Users, CalendarDays, LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import { cities, categories, initialClasses, readClasses, saveClasses } from "../data";
import { api } from "../api";
const money = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const safeImg = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=900&q=80";

function AuthPage({ mode, role, login }) {
  const nav = useNavigate();
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const title =
    role === "admin"
      ? "Welcome back, admin."
      : role === "owner"
        ? mode === "register"
          ? "Bring your studio here."
          : "Good to see you again."
        : mode === "register"
          ? "Your next chapter starts here."
          : "Come on in.";

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim().toLowerCase();
    const password = String(fd.get("password") || "");
    const confirm = String(fd.get("confirm") || "");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (mode === "register") {
      if (!name) {
        setError("Please enter your name.");
        return;
      }

      if (password.length < 8) {
        setError("Password must contain at least 8 characters.");
        return;
      }

      if (password !== confirm) {
        setError("Those passwords do not match.");
        return;
      }
    }

    setLoading(true);

    try {
      const result =
        mode === "register"
          ? await api.register({ name, email, password, role })
          : await api.login({ email, password, role });

      // Save the actual account returned by the backend.
      login(result.user.role, result.user.email);

      // Replace the demo session with the backend user and token.
      localStorage.setItem("ds_user", JSON.stringify(result.user));
      localStorage.setItem("ds_token", result.token);

      nav("/dashboard");
    } catch (err) {
      setError(
        err.message || "Unable to connect. Please check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-photo">
        <img
          src="https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1000&q=85"
          alt="Dancers in a studio"
        />
        <div className="auth-photo-copy">
          <span>MAKE SPACE TO MOVE</span>
          <h2>
            There's a place
            <br />
            for you here.
          </h2>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-wrap">
          <div className="eyebrow">
            {role === "admin"
              ? "ADMINISTRATION"
              : role === "owner"
                ? "STUDIO PARTNER"
                : "YOUR DANCESPHERE ACCOUNT"}
          </div>

          <h1>{title}</h1>
          <p>
            {mode === "register"
              ? "A few details and you’re on your way."
              : "Pick up where you left off."}
          </p>

          <form onSubmit={submit}>
            {mode === "register" && (
              <label className="form-label">
                Your name
                <input name="name" required placeholder="Full name" />
              </label>
            )}

            <label className="form-label">
              Email address
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
              />
            </label>

            <label className="form-label">
              Password
              <input
                name="password"
                type={showPass ? "text" : "password"}
                minLength={mode === "register" ? 8 : 1}
                required
                placeholder={
                  mode === "register"
                    ? "At least 8 characters"
                    : "Your password"
                }
              />
            </label>

            {mode === "register" && (
              <label className="form-label">
                Confirm password
                <input
                  name="confirm"
                  type="password"
                  required
                  placeholder="Type it once more"
                />
              </label>
            )}

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showPass}
                onChange={(e) => setShowPass(e.target.checked)}
              />{" "}
              Show password
            </label>

            {error && <p className="error-message">{error}</p>}

            <button className="button button-wide" disabled={loading}>
              {loading
                ? "Please wait..."
                : mode === "register"
                  ? "Create account"
                  : "Log in"}{" "}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="auth-switch">
            {mode === "register"
              ? "Already have an account?"
              : "New around here?"}{" "}
            <Link
              to={
                role === "owner"
                  ? mode === "register"
                    ? "/owner/login"
                    : "/owner/register"
                  : role === "admin"
                    ? "/admin/login"
                    : mode === "register"
                      ? "/login"
                      : "/register"
              }
            >
              {mode === "register" ? "Log in" : "Create an account"}
            </Link>
          </p>

          <div className="demo-notice">
            Accounts are registered and verified through the DanceSphere API.
          </div>
        </div>
      </div>
    </main>
  );
}

export default AuthPage;
