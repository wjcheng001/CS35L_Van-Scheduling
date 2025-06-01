import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Welcome() {
  const [uid, setUid] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 1) On mount, verify the user is logged in (session). If not, send back to "/"
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/session", {
          credentials: "include",
        });
        if (!res.ok) {
          navigate("/");
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Session check failed:", err);
        navigate("/");
      }
    }
    checkSession();
  }, [navigate]);

  // 2) When the user clicks “Submit”, POST the UID to /api/auth/register
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Simple front‐end validation: exactly 9 digits
    if (!/^\d{9}$/.test(uid)) {
      setError("UID must be a 9-digit number");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ uid }),
      });

      if (!res.ok) {
        // If the backend returns a 400/500, show the error message
        const errData = await res.json();
        setError(errData.error || "Registration failed");
        return;
      }

      // On success, navigate straight to /dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration request failed:", err);
      setError("Server error, please try again.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      <Header />

      {/* -------------------- */}
      {/* Main Onboarding Form */}
      {/* -------------------- */}
      <main className="flex flex-col items-center px-[72px] py-10 w-full md:px-10 sm:px-5 sm:py-5">
        {/* Welcome Title */}
        <h1 className="w-full max-w-[1097px] text-[#5937E0] font-work-sans text-[50px] font-bold leading-normal mb-5 md:text-[40px] sm:text-[28px] sm:mb-4">
          Welcome{user ? `, ${user.name}` : ""}
        </h1>

        {/* Instruction Text */}
        <p className="w-full max-w-[1114px] text-black font-work-sans text-xl font-normal leading-normal mb-10 md:text-lg sm:text-base sm:mb-[30px]">
          Welcome to the CSC Transportation web app. To get started, enter your UID.
        </p>

        {/* UID Input Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[800px] flex flex-col items-center"
        >
          <label className="block text-center text-gray-700 text-lg mb-2">UID:</label>
          <input
            type="text"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="Enter your 9-digit UID"
            className="w-full h-12 px-4 border-2 border-black rounded-full text-center text-lg focus:outline-none"
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <div className="mt-6 w-full flex justify-center">
            <button
              type="submit"
              className="bg-[#5937E0] text-white font-bold py-2 px-6 rounded-full hover:bg-purple-700"
            >
              Submit
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
