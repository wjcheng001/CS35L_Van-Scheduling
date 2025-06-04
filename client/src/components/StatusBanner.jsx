// client/src/components/StatusBanner.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function StatusBanner({ status }) {
  const handleBookClick = async (e) => {
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
      const bookingsRes = await fetch("/api/bookings/data", {
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

  const navigate = useNavigate();

  let badgeText, badgeBg, messageJSX;

  switch (status) {
    case "NOT_SUBMITTED":
      badgeText = "NOT SUBMITTED";
      badgeBg = "bg-gray-400";
      messageJSX = (
        <>
          You haven’t applied to drive yet.{" "}
          <span
            className="text-[[#5937E0]] font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/app")}
          >
            Apply now.
          </span>
        </>
      );
      break;

    case "PENDING":
      badgeText = "PENDING REVIEW";
      badgeBg = "bg-blue-400";
      messageJSX = <>Your driver application is under review.</>;
      break;

    case "APPROVED":
      badgeText = "APPROVED!";
      badgeBg = "bg-[#5937e0]";
      messageJSX = (
        <>
          You’re approved to drive! You can now{" "}
          <span
            className="text-[#5937e0] font-semibold cursor-pointer hover:underline"
            onClick={e => handleBookClick(e)}
          >
            Book a Van.
          </span>
        </>
      );
      break;

    case "REJECTED":
      badgeText = "REJECTED";
      badgeBg = "bg-red-500";
      messageJSX = (
        <>
          Rejected. Contact admin for support.{" "}
          <span
            className="text-[#5937e0] font-semibold cursor-pointer hover:underline"
            onClick={() => window.open("mailto:transportation@uclacsc.org")}
          >
            Contact Support.
          </span>
        </>
      );
      break;

    default:
      badgeText = "UNKNOWN";
      badgeBg = "bg-gray-500";
      messageJSX = <>Unknown status</>;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row items-center mb-8">
      <span
        className={`${badgeBg} text-white px-5 py-3 rounded-full text-sm font-semibold mb-4 md:mb-0 md:mr-6`}
      >
        {badgeText}
      </span>
      <p className="text-gray-700 text-base">{messageJSX}</p>
    </div>
  );
}
