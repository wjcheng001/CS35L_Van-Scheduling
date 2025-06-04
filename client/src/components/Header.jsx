// src/components/Header.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleVanBookingClick = async (e) => {
    console.log("clicked");
    e.preventDefault();

    try {
      // 1) Check login + status
      const authRes = await fetch("/api/auth/status", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!authRes.ok) {
        // If your endpoint returns 401 or similar, treat as “not logged in”
        return navigate("/login");
      }

      const authData = await authRes.json();
      // assume authData looks like: { user: { email, status, … } } or { user: null }
      if (!authData.status) {
        console.log("not logged in");
        return navigate("/login");
      }

      if (authData.status !== "APPROVED") {
        alert("Your account is not confirmed to create a van booking yet.");
        return;
      }

      // 3) Now check if they already have an active booking
      const bookingsRes = await fetch("/api/bookings", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!bookingsRes.ok) {
        alert("Could not verify existing bookings. Please try again later.");
        return;
      }
      const bookingsData = await bookingsRes.json();
      if (bookingsData.bookings.length !== 0) {
        alert("You already have an active van booking.");
        return;
      }
      // 4) All checks passed → send them to the booking form
      navigate("/reserve");
    } catch (err) {
      console.error("Error during booking check:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/35ffbd91b802e556e729776a9b26d95a49b76e03?placeholderIfAbsent=true"
            className="logo-image"
            alt="CSCVAN Logo"
          />
          <span className="logo-text">CSCVAN</span>
        </Link>

        <nav className="main-nav">
          <Link to="/" className="nav-item">
            Home
          </Link>
          <div className="nav-spacer" />

          <Link to="/dashboard" className="nav-item">
            Dashboard
          </Link>
          <div className="nav-spacer"></div>
          <Link to="/app" className="nav-item">
            Driver Application
          </Link>
          <div className="nav-spacer" />

          {/* Intercept the click instead of a plain <Link> */}
          <a
            href="/van-booking"
            className="nav-item"
            onClick={handleVanBookingClick}
            style={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? "none" : "auto" }}
          >
            Van Booking
          </a>
          <div className="nav-spacer" />

          <Link to="/resources" className="nav-item">
            Resources
          </Link>
          <div className="nav-spacer" />

          <Link to="/van-schedule" className="nav-item">
            Van Schedule
          </Link>
        </nav>
      </div>
    </header>
  );
}