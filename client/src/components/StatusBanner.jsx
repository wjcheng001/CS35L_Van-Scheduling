// client/src/components/StatusBanner.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function StatusBanner({ status }) {
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
      badgeBg = "bg-purple-600";
      messageJSX = (
        <>
          You’re approved to drive! You can now{" "}
          <span
            className="text-purple-600 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/reserve")}
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
            className="text-purple-600 font-semibold cursor-pointer hover:underline"
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
