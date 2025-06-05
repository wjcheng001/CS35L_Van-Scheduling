import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const VanReturn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bookingId: "",
    projectName: "",
    vanSerialNumber: "",
    returnDate: "",
    returnTime: "",
    fuelLevel: "",
    parkingLocation: "",
    hadAccident: false,
    cleanedVan: false,
    refueledVan: false,
    experiencedProblem: false,
    damageDescription: "",
    exteriorPhoto: null,
    interiorPhoto: null,
    dashboardPhoto: null,
    acceptResponsibility: false,
    returningNow: false,
  });
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null);
  const [pickupDate, setPickupDate] = useState("");

  useEffect(() => {
    async function fetchUserRoleAndBooking() {
      try {
        const roleResponse = await fetch("http://localhost:3000/api/admin/role", {
          credentials: "include",
        });
        if (!roleResponse.ok) {
          throw new Error(`Role fetch failed: ${roleResponse.status}`);
        }
        const roleData = await roleResponse.json();
        setUserRole(roleData.user.role);
        const bookingResponse = await fetch("http://localhost:3000/api/bookings/data", {
          credentials: "include",
        });
        if (!bookingResponse.ok) {
          throw new Error(`Booking fetch failed: ${bookingResponse.status}`);
        }
        const bookingData = await bookingResponse.json();
        const confirmedBooking = bookingData.bookings.find(
          (b) => b.status === "CONFIRMED"
        );
        if (confirmedBooking) {
          setFormData((prev) => ({
            ...prev,
            bookingId: confirmedBooking._id,
            projectName: confirmedBooking.projectName,
            vanSerialNumber: confirmedBooking.vanId.toString(),
          }));
          setPickupDate(new Date(confirmedBooking.pickupDate).toLocaleDateString());
        } else {
          setError("No confirmed booking found to return.");
        }
      } catch (err) {
        console.error("Error fetching role or booking:", err.message);
        setError("Failed to load user role or booking. Please try again.");
      }
    }
    fetchUserRoleAndBooking();
  }, []);

  useEffect(() => {
    if (formData.returningNow) {
      const now = new Date();
      const formattedDate = now.toISOString().split("T")[0];
      const formattedTime = now.toTimeString().slice(0, 5);
      setFormData((prev) => ({
        ...prev,
        returnDate: formattedDate,
        returnTime: formattedTime,
      }));
    }
  }, [formData.returningNow]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!formData.bookingId) {
      setError("No booking selected for return.");
      return;
    }
    if (!formData.cleanedVan || !formData.acceptResponsibility) {
      alert("Please check both 'I cleaned the van...' and 'I understand that I will be responsible...' before submitting.");
      return;
    }
    if (formData.fuelLevel && Number(formData.fuelLevel) < 75) {
      alert("Please refuel before return.");
      return;
    }
    if (userRole !== "admin") {
      if (!formData.exteriorPhoto || !formData.interiorPhoto || !formData.dashboardPhoto) {
        setError("Please upload all three photos (Exterior, Interior, Dashboard) as they are compulsory.");
        return;
      }
    }
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && !["exteriorPhoto", "interiorPhoto", "dashboardPhoto"].includes(key)) {
          formDataToSend.append(key, formData[key]);
        }
      });
      if (formData.exteriorPhoto) {
        formDataToSend.append("exteriorPhoto", formData.exteriorPhoto);
      }
      if (formData.interiorPhoto) {
        formDataToSend.append("interiorPhoto", formData.interiorPhoto);
      }
      if (formData.dashboardPhoto) {
        formDataToSend.append("dashboardPhoto", formData.dashboardPhoto);
      }
      const response = await fetch("http://localhost:3000/api/submit", {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });
      if (!response.ok) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error(`Submission failed: ${response.status} - ${text.slice(0, 100)}...`);
      }
      const data = await response.json();
      alert("Successful: Thank you for your return");
      navigate("/dashboard");
    } catch (err) {
      console.error("Submission error:", err.message);
      setError(`Error submitting van return: ${err.message}`);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow max-w-5xl mx-auto p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-extrabold text-[#5937e0]">Return a Van</h1>
            <button
              onClick={handleBackToDashboard}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
          <p className="mt-4 text-red-600 font-semibold">{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-[#5937e0]">Return a Van</h1>
          <button
            onClick={handleBackToDashboard}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
        <p className="text-gray-500 mb-6">Please file a return form per van at the end of each trip.</p>
        {error && (
          <div className="mb-8 text-red-600 font-semibold">
            {error}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col"
        >
          <div className="mb-4">
            <div className="text-xl font-semibold text-gray-700">
              Booking ID: <strong>{formData.bookingId}</strong>
            </div> <br />
            <div className="text-xl font-semibold text-gray-700 mt-1">
              Pickup Date: <strong>{pickupDate}</strong>
            </div> <br />
            <div className="text-xl font-semibold text-gray-700 mt-1">
              Van ID: <strong>{formData.vanSerialNumber}</strong>
            </div> <br />
            <div className="text-xl font-semibold text-gray-700 mt-1">
              Project: <strong>{formData.projectName}</strong>
            </div>
          </div> <br />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="returningNow"
              name="returningNow"
              className="h-4 w-4 border-gray-300"
              checked={formData.returningNow}
              onChange={handleInputChange}
            />
            <label htmlFor="returningNow" className="ml-2 text-sm">
              I am returning now (autofill date & time)
            </label>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="returnDate" className="text-sm font-semibold text-gray-700">
                Return Date
              </label>
              <input
                type="date"
                id="returnDate"
                name="returnDate"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                value={formData.returnDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="returnTime" className="text-sm font-semibold text-gray-700">
                Return Time
              </label>
              <input
                type="time"
                id="returnTime"
                name="returnTime"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                value={formData.returnTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="fuelLevel" className="text-sm font-semibold text-gray-700">
                Fuel Level (%)
              </label>
              <input
                type="number"
                id="fuelLevel"
                name="fuelLevel"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                value={formData.fuelLevel}
                onChange={handleInputChange}
                min="0"
                max="100"
                placeholder="0-100"
              />
            </div>
            <div>
              <label htmlFor="parkingLocation" className="text-sm font-semibold text-gray-700">
                Parking Location
              </label>
              <input
                type="text"
                id="parkingLocation"
                name="parkingLocation"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                value={formData.parkingLocation}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs mt-1 text-gray-600">
                * If you used the default Parking Lot 4 Level 2 North, enter P4L2N. Else, please message the transportation director NOW
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hadAccident"
                name="hadAccident"
                className="h-4 w-4 border-gray-300"
                checked={formData.hadAccident}
                onChange={handleInputChange}
              />
              <label htmlFor="hadAccident" className="ml-2 text-sm">
                I got into an accident/ caused new damage. I have reported it at{" "}
                <a
                  href="https://bit.ly/40oYls2?r=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  https://bit.ly/40oYls2?r=qr
                </a>
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="cleanedVan"
                name="cleanedVan"
                className="h-4 w-4 border-gray-300"
                checked={formData.cleanedVan}
                onChange={handleInputChange}
              />
              <label htmlFor="cleanedVan" className="ml-2 text-sm">
                I cleaned the van and took out all the trash my project left behind
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="refueledVan"
                name="refueledVan"
                className="h-4 w-4 border-gray-300"
                checked={formData.refueledVan}
                onChange={handleInputChange}
              />
              <label htmlFor="refueledVan" className="ml-2 text-sm">
                I have refueled the van at the UCLA Fleet Shop. The van has {">"}75% fuel
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="experiencedProblem"
                name="experiencedProblem"
                className="h-4 w-4 border-gray-300"
                checked={formData.experiencedProblem}
                onChange={handleInputChange}
              />
              <label htmlFor="experiencedProblem" className="ml-2 text-sm">
                I experienced a problem when using the van
              </label>
            </div>
          </div>
          {(formData.experiencedProblem || formData.hadAccident) && (
            <div className="mt-4">
              <label htmlFor="damageDescription" className="text-sm font-semibold text-gray-700">
                Describe the damage / problem experienced
              </label>
              <textarea
                id="damageDescription"
                name="damageDescription"
                className="w-full mt-1 p-2 border border-gray-300 rounded"
                value={formData.damageDescription}
                onChange={handleInputChange}
              />
            </div>
          )}
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Exterior Photo {userRole !== "admin" ? "(Compulsory)" : "(Optional)"}
              </label>
              <div className="mt-1 p-2 border border-gray-300 rounded flex items-center justify-center cursor-pointer">
                <input
                  type="file"
                  id="exteriorPhoto"
                  name="exteriorPhoto"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  required={userRole !== "admin"}
                />
                <label htmlFor="exteriorPhoto" className="cursor-pointer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11L12 8 15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 16H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </label>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Interior Photo {userRole !== "admin" ? "(Compulsory)" : "(Optional)"}
              </label>
              <div className="mt-1 p-2 border border-gray-300 rounded flex items-center justify-center cursor-pointer">
                <input
                  type="file"
                  id="interiorPhoto"
                  name="interiorPhoto"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  required={userRole !== "admin"}
                />
                <label htmlFor="interiorPhoto" className="cursor-pointer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11L12 8 15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 16H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </label>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Dashboard Display Photo (Fuel etc) {userRole !== "admin" ? "(Compulsory)" : "(Optional)"}
              </label>
              <div className="mt-1 p-2 border border-gray-300 rounded flex items-center justify-center cursor-pointer">
                <input
                  type="file"
                  id="dashboardPhoto"
                  name="dashboardPhoto"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  required={userRole !== "admin"}
                />
                <label htmlFor="dashboardPhoto" className="cursor-pointer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 16L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 11L12 8 15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 16H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </label>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="acceptResponsibility"
              name="acceptResponsibility"
              className="h-4 w-4 border-gray-300"
              checked={formData.acceptResponsibility}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="acceptResponsibility" className="ml-2 text-sm">
              I understand that I will be responsible for all newly discovered damage/ faults and cleanliness issues discovered by the next user of the van unless I have proven myself innocent with the photo evidence above.
            </label>
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-[#5937e0] text-white py-2 px-4 rounded hover:bg-[#452bb3] transition-colors"
          >
            Submit
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default VanReturn;