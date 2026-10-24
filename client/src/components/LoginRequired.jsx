import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Music2, Users, CalendarDays } from "lucide-react";

function LoginRequired() {
  return (
    <main className="page-main empty-state">
      <h2>Log in to continue</h2>
      <p>This page is for registered demo users.</p>
      <Link className="button" to="/login">
        Go to login
      </Link>
    </main>
  );
}

export default LoginRequired;
