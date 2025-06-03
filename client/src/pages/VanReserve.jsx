// client/src/pages/VanReservation.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

const VanReservation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectName: "",
    pickupDate: "",
    pickupTime: "",
    numberOfVans: "",
    returnDate: "",
    returnTime: "",
    siteName: "",
    siteAddress: "",
    isOutsideRange: false,
    tripPurpose: "",
  });

  const [error, setError] = useState("");

  // 1) Ensure the user is logged in. If not, redirect back to “/”
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/session", {
          credentials: "include",
        });
        if (!res.ok) {
          // Not logged in → send user to Home
          navigate("/");
        }
      } catch (err) {
        console.error("Session check error:", err);
        navigate("/");
      }
    }
    checkSession();
  }, [navigate]);

  // 2) Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 3) Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/bookings", {
        method: "POST",
        credentials: "include", // <— send the session cookie
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: formData.projectName,
          pickupDate: formData.pickupDate,
          pickupTime: formData.pickupTime,
          numberOfVans: Number(formData.numberOfVans),
          returnDate: formData.returnDate,
          returnTime: formData.returnTime,
          siteName: formData.siteName,
          siteAddress: formData.siteAddress,
          within75Miles: Boolean(formData.isOutsideRange), // ensure boolean
          tripPurpose: formData.tripPurpose,
        }),
      });

      if (res.status === 401) {
        // not authenticated; redirect to login
        navigate("/login");
        return;
      }

      if (res.status === 400) {
        alert("Sorry, there is no available van in this time slot, please check out the van schedule")
        navigate("/dashboard");
        return;
      }

      if (!res.ok) {
        const err = await res.json();
        console.error("Booking creation failed:", err);
        return;
      }

      const { booking } = await res.json(); // <-- valid JSON now
      console.log("Successfully created booking:", booking);

      navigate("/reservation-success");
    } catch (err) {
      console.error("Booking request failed:", err);
    }
  };


  return (
    <div className="bg-white overflow-hidden">
      <div className="flex w-full flex-col items-stretch">
        <Header />

        <h1 className="text-[#5937E0] text-[50px] font-work-sans font-bold self-start mt-[51px] ml-[156px] md:text-[40px] md:mt-10">
          Reserve a Van
        </h1>
        <p className="text-black text-[20px] font-work-sans font-light self-start mt-[10px] ml-[156px] md:mt-5">
          Schedule your van reservation for your project. Please fill one reservation{" "}
          <span className="font-semibold">per trip</span> (one pick up & return date, one
          address).<br />Please ensure your return times are accurate.
        </p>

        <form
          onSubmit={handleSubmit}
          className="rounded-[10px] border-[3px] border-[#EBEAED] self-center flex mt-[40px] w-4/5 max-w-[1114px] px-10 py-[40px] flex-col items-stretch md:max-w-full md:px-5 md:mt-10"
        >
          {/* Show error if any */}
          {error && (
            <div className="text-red-600 text-sm text-center mb-4">{error}</div>
          )}

          {/* Row 1: Project Name | Pickup Date | Pickup Time */}
          <div className="flex items-stretch gap-5 font-work-sans text-sm text-black font-bold uppercase tracking-[2px] leading-8 flex-wrap justify-between">
            <div className="flex flex-col items-stretch flex-1">
              <label htmlFor="projectName" className="self-start">
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                className="rounded-[100px] border-2 border-black h-11 mt-6 px-5"
                value={formData.projectName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex flex-col items-stretch flex-1">
              <label htmlFor="pickupDate" className="self-start">
                Pickup Date
              </label>
              <input
                type="date"
                id="pickupDate"
                name="pickupDate"
                className="rounded-[100px] border-2 border-black h-11 mt-6 px-5"
                value={formData.pickupDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex flex-col items-stretch flex-1">
              <label htmlFor="pickupTime" className="self-start">
                Pickup Time
              </label>
              <input
                type="time"
                id="pickupTime"
                name="pickupTime"
                className="rounded-[100px] border-2 border-black h-11 mt-6 px-5"
                value={formData.pickupTime}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Row 2: Number of Vans | Return Date | Return Time */}
          <div className="flex items-stretch gap-5 font-work-sans text-sm text-black font-bold uppercase tracking-[2px] leading-8 flex-wrap justify-between mt-8">
            <div className="flex flex-col items-stretch flex-1">
              <label htmlFor="numberOfVans" className="self-start">
                Number of Vans Requested
              </label>
              <input
                type="number"
                id="numberOfVans"
                name="numberOfVans"
                className="rounded-[100px] border-2 border-black h-11 mt-6 px-5"
                value={formData.numberOfVans}
                onChange={handleInputChange}
                required
                min="1"
              />
              <span className="text-xs mt-1 text-gray-600 normal-case tracking-normal">
                * For this site/trip only
              </span>
            </div>

            <div className="flex flex-col items-stretch flex-1">
              <label htmlFor="returnDate" className="self-start">
                Return Date
              </label>
              <input
                type="date"
                id="returnDate"
                name="returnDate"
                className="rounded-[100px] border-2 border-black h-11 mt-6 px-5"
                value={formData.returnDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex flex-col items-stretch flex-1">
              <label htmlFor="returnTime" className="self-start">
                Return Time
              </label>
              <input
                type="time"
                id="returnTime"
                name="returnTime"
                className="rounded-[100px] border-2 border-black h-11 mt-6 px-5"
                value={formData.returnTime}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Row 3: Site Name | Site Address */}
          <div className="flex items-stretch gap-5 font-work-sans text-sm text-black font-bold uppercase tracking-[2px] leading-8 flex-wrap justify-between mt-8">
            <div className="flex flex-col items-stretch flex-1">
              <label htmlFor="siteName" className="self-start">
                Site Name
              </label>
              <input
                type="text"
                id="siteName"
                name="siteName"
                className="rounded-[100px] border-2 border-black h-11 mt-6 px-5"
                value={formData.siteName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex flex-col items-stretch flex-1">
              <label htmlFor="siteAddress" className="self-start">
                Site Address
              </label>
              <input
                type="text"
                id="siteAddress"
                name="siteAddress"
                className="rounded-[100px] border-2 border-black h-11 mt-6 px-5"
                value={formData.siteAddress}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Checkbox: >75 miles */}
          <div className="flex items-center mt-4 ml-2">
            <input
              type="checkbox"
              id="isOutsideRange"
              name="isOutsideRange"
              className="h-4 w-4 border-2 border-black"
              checked={formData.isOutsideRange}
              onChange={handleInputChange}
            />
            <label htmlFor="isOutsideRange" className="ml-2 text-sm">
              Check this box if site is <strong>NOT</strong> within 75 miles of UCLA
            </label>
          </div>

          {/* Row 4: Trip Purpose */}
          <div className="flex flex-col mt-[40px]">
            <label
              htmlFor="tripPurpose"
              className="font-work-sans text-sm font-bold uppercase tracking-[2px] leading-8 self-start ml-[30px] md:ml-2.5"
            >
              Trip Purpose
            </label>
            <textarea
              id="tripPurpose"
              name="tripPurpose"
              className="rounded-[39px] border-2 border-black w-full h-[181px] mt-[21px] p-5 resize-none"
              value={formData.tripPurpose}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={e => handleSubmit(e)}
            className="rounded-[47px] bg-[#5937E0] border-2 border-[#5937E0] self-end mt-[40px] w-[200px] px-[70px] py-[26px] font-dm-sans text-[18px] text-white font-bold uppercase tracking-[2px] leading-[1.3] hover:bg-[#4826d9] transition-colors md:mr-1 md:px-5 md:mt-10"
          >
            Submit
          </button>
        </form>

        <Footer />
      </div>
    </div>
  );
};

export default VanReservation;
