import React from "react";
import { useNavigate } from "react-router-dom";

export default function StatusBanner({ status }) {
  const navigate = useNavigate();

  const handleBookClick = async (e) => {
    e.preventDefault();

    try {
      // Check login + status
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

      // Check for confirmed bookings
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
      if (bookingsData.bookings && Array.isArray(bookingsData.bookings)) {
        const hasConfirmedBooking = bookingsData.bookings.some(
          (booking) => booking.status === "CONFIRMED"
        );
        if (hasConfirmedBooking) {
          const confirmProceed = window.confirm(
            "You already have a confirmed van booking. Do you want to continue?"
          );
          if (!confirmProceed) return;
        }
      }

      // All checks passed → send to booking form
      navigate("/reserve");
    } catch (err) {
      console.error("Error during booking check:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  let badgeText, badgeBg, messageJSX;

  switch (status) {
    case "NOT_SUBMITTED":
      badgeText = "NOT SUBMITTED";
      badgeBg = "bg-gray-400";
      messageJSX = (
        <>
          You haven’t applied to drive yet.{" "}
          <span
            className="text-[#5937E0] font-semibold cursor-pointer hover:underline"
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
      badgeBg = "bg-[#5937E0]";
      messageJSX = (
        <>
          You’re approved to drive! You can now{" "}
          <span
            className="text-[#5937E0] font-semibold cursor-pointer hover:underline"
            onClick={handleBookClick}
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
            className="text-[#5937E0] font-semibold cursor-pointer hover:underline"
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
      break;
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