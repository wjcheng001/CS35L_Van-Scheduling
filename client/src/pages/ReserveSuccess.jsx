import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function ReservationSuccess() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header />

      <div className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="bg-[#5937E0] rounded-full p-6 mb-6">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12L10 17L20 7"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-[#5937E0] text-4xl font-bold mb-6">SUBMITTED!</h1>
        <p className="text-xl text-gray-800 mb-6">Thank you for your van reservation.</p>
        <Link
          to="/dashboard"
          className="mt-4 inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-700 transition"
        >
          Back to Dashboard
        </Link>
      </div>

      <Footer />
    </div>
  );
}
