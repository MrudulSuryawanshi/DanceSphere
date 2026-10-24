import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Music2, Users, CalendarDays } from "lucide-react";

function Stat({ icon, label, value }) {
  return (
    <div className="stat-card">
      <span className="stat-icon">{icon}</span>
      <span className="stat-label">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default Stat;
