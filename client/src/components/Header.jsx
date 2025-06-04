import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Error checking auth status:", err);
        setIsLoggedIn(false);
      }
    };
    checkAuthStatus();
  }, []);

  const handleProtectedLinkClick = (e, path) => {
    if (!isLoggedIn) {
      e.preventDefault();
      alert("Please log in to view content");
      navigate("/");
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        setIsLoggedIn(false);
        navigate("/");
      } else {
        alert("Error logging out. Please try again.");
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("An unexpected error occurred during logout.");
    }
  };

  const handleVanBookingClick = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Please log in to view content");
      return navigate("/");
    }

    try {
      setLoading(true);
      // 1) Check login + status
      const authRes = await fetch("/api/auth/status", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!authRes.ok) {
        return navigate("/login");
      }

      const authData = await authRes.json();
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
    } finally {
      setLoading(false);
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
          <span className="logo-text" style={{ whiteSpace: "nowrap" }}>
            CSC Transportation
          </span>
        </Link>
        <nav className="main-nav">
          {isLoggedIn ? (
            <a
              href="/logout"
              className="nav-item"
              onClick={handleLogout}
              style={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? "none" : "auto" }}
            >
              Logout
            </a>
          ) : (
            <Link to="/" className="nav-item">
              Home
            </Link>
          )}
          <div className="nav-spacer" />

          <Link
            to="/dashboard"
            className="nav-item"
            onClick={(e) => handleProtectedLinkClick(e, "/dashboard")}
          >
            Dashboard
          </Link>
          <div className="nav-spacer" />

          <Link
            to="/app"
            className="nav-item"
            onClick={(e) => handleProtectedLinkClick(e, "/app")}
          >
            Driver Application
          </Link>
          <div className="nav-spacer" />

          <a
            href="/van-booking"
            className="nav-item"
            onClick={handleVanBookingClick}
            style={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? "none" : "auto" }}
          >
            Van Booking
          </a>
          <div className="nav-spacer" />

          <Link
            to="/resources"
            className="nav-item"
            onClick={(e) => handleProtectedLinkClick(e, "/resources")}
          >
            Resources
          </Link>
          <div className="nav-spacer" />

          <Link
            to="/van-schedule"
            className="nav-item"
            onClick={(e) => handleProtectedLinkClick(e, "/van-schedule")}
          >
            Van Schedule
          </Link>
        </nav>
      </div>
    </header>
  );
}