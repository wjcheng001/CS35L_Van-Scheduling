import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

// List of project names (deduplicated and corrected)
const projects = [
  "AATP", "AMSA", "BARC", "Best Buddies", "BFPC", "Bruin Hope",
  "Bruin Initiative", "Bruin Partners", "Bruin Shelter", "CHAMPs",
  "Expressive Movement Initiative", "Fitnut (formerly SCOPE)", "GCGP",
  "GMT", "Habitat for Humanity", "Hunger Project", "KDSAP", "Kids Korner",
  "Medlife", "PCH", "PREP", "Project Literacy", "Project Lux",
  "Special Olympics", "Swipe Out Hunger", "The Bruin Experiment",
  "UNICEF", "VCH", "VITA", "Watts", "Writer's Den", "WYSE", "CSC"
];

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
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/session", {
          credentials: "include",
        });
        if (!res.ok) {
          navigate("/");
        }
      } catch (err) {
        console.error("Session check error:", err);
        navigate("/");
      }
    }
    checkSession();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "projectName") {
      const filteredProjects = projects.filter(project =>
        project.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredProjects);
      setShowSuggestions(value.length > 0 && filteredProjects.length > 0);
    }
    if (name === "numberOfVans") {
      if (value === "" || /^[0-9]*$/.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
        setError("");
      } else {
        setError("Number of vans must be a positive number.");
        return;
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const handleSuggestionClick = (project) => {
    setFormData(prev => ({ ...prev, projectName: project }));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && formData.projectName) {
      setSuggestions([]);
      setShowSuggestions(false);
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/bookings/data", {
        method: "POST",
        credentials: "include",
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
          within75Miles: Boolean(formData.isOutsideRange),
          tripPurpose: formData.tripPurpose,
        }),
      });
      if (res.status === 401) {
        navigate("/login");
        return;
      }
      if (res.status === 400) {
        const errData = await res.json();
        alert(`Booking creation failed: ${errData.error}`);
        return;
      }
      if (!res.ok) {
        const err = await res.json();
        console.error("Booking creation failed:", err);
        return;
      }
      const { booking } = await res.json();
      console.log("Successfully created booking:", booking);
      navigate("/reservation-success");
    } catch (err) {
      console.error("Booking request failed:", err);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="flex w-full flex-col items-stretch">
        <Header />
        <div className="flex justify-between items-center w-full px-[156px] mt-[51px] md:px-10 sm:px-5">
          <h1 className="text-[#5937E0] text-[50px] font-work-sans font-bold self-start md:text-[40px] sm:text-[28px]">
            Reserve a Van
          </h1>
          <button
            onClick={handleBackToDashboard}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
        <p className="text-black text-[20px] font-work-sans font-light self-start mt-[10px] ml-[156px] md:mt-5 md:ml-10 sm:ml-5">
          Schedule your van reservation for your project. Please fill one reservation{" "}
          <span className="font-semibold">per trip</span> (one pick up & return date, one
          address).<br />Please ensure your return times are accurate.
        </p>
        <form
          onSubmit={handleSubmit}
          className="rounded-[10px] border-[3px] border-[#EBEAED] self-center flex mt-[40px] w-4/5 max-w-[1114px] px-10 py-[40px] flex-col items-stretch md:max-w-full md:px-5 md:mt-10"
        >
          {error && (
            <div className="text-red-600 text-sm text-center mb-4">{error}</div>
          )}
          <div className="flex items-stretch gap-5 font-work-sans text-sm text-black font-bold uppercase tracking-[2px] leading-8 flex-wrap justify-between">
            <div className="flex flex-col items-stretch flex-1 relative">
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
                onKeyDown={handleKeyDown}
                required
                autoComplete="off"
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute top-full mt-2 left-0 w-full bg-white border-2 border-black rounded-[10px] max-h-[150px] overflow-y-auto z-10">
                  {suggestions.map((project) => (
                    <li
                      key={project}
                      onClick={() => handleSuggestionClick(project)}
                      className="px-4 py-2 text-black font-roboto text-sm cursor-pointer hover:bg-[#5937E0] hover:text-white transition-colors"
                    >
                      {project}
                    </li>
                  ))}
                </ul>
              )}
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
                pattern="[0-9]*"
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
          <button
            type="submit"
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