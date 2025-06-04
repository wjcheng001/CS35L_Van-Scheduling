import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const VanReturn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bookingId: "BK12345",
    projectName: "CSSA PROM",
    vanSerialNumber: "405437",
    returnDate: "",
    returnTime: "",
    fuelLevel: "",
    parkingLocation: "",
    notifiedKeyProblem: false,
    hadAccident: false,
    cleanedVan: false,
    refueledVan: false,
    experiencedProblem: false,
    damageDescription: "",
    exteriorPhoto: null,
    interiorPhoto: null,
    dashboardPhoto: null,
    acceptResponsibility: false,
  });
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const response = await fetch("http://localhost:3000/api/admin/role", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`Role fetch failed: ${response.status}`);
        }
        const data = await response.json();
        setUserRole(data.user.role);
      } catch (err) {
        console.error("Error fetching user role:", err.message);
        setError("Failed to load user role. Please try again.");
      }
    }
    fetchUserRole();
  }, []);

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

    // Check fuel level
    if (formData.fuelLevel && Number(formData.fuelLevel) < 75) {
      alert("Please refuel before return.");
    }

    // Validate photos for non-admins
    if (userRole !== "admin") {
      if (!formData.exteriorPhoto || !formData.interiorPhoto || !formData.dashboardPhoto) {
        setError("Please upload all required photos.");
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

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow flex justify-center p-4">
        <div className="w-full max-w-[1114px] mx-auto">
          <h1 className="text-[#5937E0] text-[50px] font-work-sans font-bold mt-[50px] md:text-[40px] md:mt-10">
            Return a Van
          </h1>

          <p className="text-black text-[20px] font-work-sans font-light mt-[10px] md:mt-5">
            Booking #{formData.bookingId}.
          </p>

          <p className="text-black text-[20px] font-work-sans font-light mt-[5px]">
            Please file a return form <span className="font-semibold">per van</span> at the end of each trip.
          </p>

          {error && (
            <div className="mt-4 text-red-600 font-semibold">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="rounded-[10px] border-[3px] border-[#EBEAED] flex mt-[40px] w-full px-10 py-[40px] flex-col items-stretch md:px-5 md:mt-10"
          >
            <div className="flex items-stretch gap-5 font-work-sans text-sm text-black font-bold uppercase tracking-[2px] leading-8 flex-wrap justify-between">
              <div className="flex flex-col items-stretch flex-1">
                <label className="self-start">Project Name</label>
                <div className="text-3xl font-bold text-black mt-2 uppercase">
                  {formData.projectName}
                </div>
              </div>

              <div className="flex flex-col items-stretch flex-1">
                <label className="self-start">Van Serial Number</label>
                <div className="text-3xl font-bold text-black mt-2">
                  {formData.vanSerialNumber}
                </div>
              </div>
            </div>

            <div className="flex items-stretch gap-5 font-work-sans text-sm text-black font-bold uppercase tracking-[2px] leading-8 flex-wrap justify-between mt-8">
              <div className="flex flex-col items-stretch flex-1">
                <label htmlFor="returnDate" className="self-start">Return Date</label>
                <input
                  type="date"
                  id="returnDate"
                  name="returnDate"
                  className="rounded-[40px] border-2 border-black h-11 mt-6 px-5"
                  value={formData.returnDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="flex flex-col items-stretch flex-1">
                <label htmlFor="returnTime" className="self-start">Return Time</label>
                <input
                  type="time"
                  id="returnTime"
                  name="returnTime"
                  className="rounded-[40px] border-2 border-black h-11 mt-6 px-5"
                  value={formData.returnTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="flex items-stretch gap-5 font-work-sans text-sm text-black font-bold uppercase tracking-[2px] leading-8 flex-wrap justify-between mt-8">
              <div className="flex flex-col items-stretch flex-1">
                <label htmlFor="fuelLevel" className="self-start">Fuel Level (%)</label>
                <input
                  type="number"
                  id="fuelLevel"
                  name="fuelLevel"
                  className="rounded-[40px] border-2 border-black h-11 mt-6 px-5"
                  value={formData.fuelLevel}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  placeholder="0-100"
                />
              </div>
              <div className="flex flex-col items-stretch flex-1">
                <label htmlFor="parkingLocation" className="self-start">Parking Location</label>
                <input
                  type="text"
                  id="parkingLocation"
                  name="parkingLocation"
                  className="rounded-[40px] border-2 border-black h-11 mt-6 px-5"
                  value={formData.parkingLocation}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs mt-1 text-gray-600">
                  * If you used the default Parking Lot 4 Level 2 North, enter P4L2N. Else, please message the transportation director NOW
                </p>
              </div>
            </div>

            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                id="notifiedKeyProblem"
                name="notifiedKeyProblem"
                className="h-5 w-5 border-2 border-black"
                checked={formData.notifiedKeyProblem}
                onChange={handleInputChange}
              />
              <label htmlFor="notifiedKeyProblem" className="ml-2 text-base font-semibold">
                I have notified the Transportation Director of the key problem
              </label>
            </div>

            <div className="mt-8">
              <h3 className="font-work-sans text-xl font-bold mb-4">
                <span className="text-black">Mandatory</span> Van Return Checklist
              </h3>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hadAccident"
                    name="hadAccident"
                    className="h-5 w-5 border-2 border-black"
                    checked={formData.hadAccident}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="hadAccident" className="ml-2 text-base">
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
                    className="h-5 w-5 border-2 border-black"
                    checked={formData.cleanedVan}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="cleanedVan" className="ml-2 text-base">
                    I cleaned the van and took out all the trash my project left behind
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="refueledVan"
                    name="refueledVan"
                    className="h-5 w-5 border-2 border-black"
                    checked={formData.refueledVan}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="refueledVan" className="ml-2 text-base">
                    I have refueled the van at the UCLA Fleet Shop. The van has {">"}75% fuel
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="experiencedProblem"
                    name="experiencedProblem"
                    className="h-5 w-5 border-2 border-black"
                    checked={formData.experiencedProblem}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="experiencedProblem" className="ml-2 text-base">
                    I experienced a problem when using the van
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <label htmlFor="damageDescription" className="font-work-sans text-sm font-bold uppercase tracking-[2px] leading-8">
                Describe the damage / problem experienced
              </label>
              <textarea
                id="damageDescription"
                name="damageDescription"
                className="rounded-[39px] border-2 border-black w-full h-[120px] mt-[10px] p-5 resize-none"
                value={formData.damageDescription}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex mt-[40px] w-full max-w-full items-stretch gap-5 flex-wrap justify-between">
              <div className="flex flex-col items-stretch flex-1">
                <label className="font-work-sans text-sm font-bold uppercase tracking-[2px] leading-8">
                  Exterior Photo {userRole === "admin" ? "(Optional)" : ""}
                </label>
                <div className="rounded-[20px] border-2 border-black flex flex-grow p-[40px] flex-col items-center justify-center cursor-pointer md:max-w-full md:mt-5 md:p-5">
                  <input
                    type="file"
                    id="exteriorPhoto"
                    name="exteriorPhoto"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <label htmlFor="exteriorPhoto">
                    <svg width="43" height="43" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 16L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 11L12 8 15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 16H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </label>
                </div>
              </div>

              <div className="flex flex-col items-stretch flex-1">
                <label className="font-work-sans text-sm font-bold uppercase tracking-[2px] leading-8">
                  Interior Photo {userRole === "admin" ? "(Optional)" : ""}
                </label>
                <div className="rounded-[20px] border-2 border-black flex flex-grow p-[40px] flex-col items-center justify-center cursor-pointer md:max-w-full md:mt-5 md:p-5">
                  <input
                    type="file"
                    id="interiorPhoto"
                    name="interiorPhoto"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <label htmlFor="interiorPhoto">
                    <svg width="43" height="43" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 16L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 11L12 8 15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 16H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </label>
                </div>
              </div>

              <div className="flex flex-col items-stretch flex-1">
                <label className="font-work-sans text-sm font-bold uppercase tracking-[2px] leading-8">
                  Dashboard Display Photo (Fuel etc) {userRole === "admin" ? "(Optional)" : ""}
                </label>
                <div className="rounded-[20px] border-2 border-black flex flex-grow p-[40px] flex-col items-center justify-center cursor-pointer md:max-w-full md:mt-5 md:p-5">
                  <input
                    type="file"
                    id="dashboardPhoto"
                    name="dashboardPhoto"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <label htmlFor="dashboardPhoto">
                    <svg width="43" height="43" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 16L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 11L12 8 15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 16H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center mt-8">
              <input
                type="checkbox"
                id="acceptResponsibility"
                name="acceptResponsibility"
                className="h-5 w-5 border-2 border-black"
                checked={formData.acceptResponsibility}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="acceptResponsibility" className="ml-2 text-base">
                I understand that I will be responsible for all newly discovered damage/ faults and cleanliness issues discovered by the next user of the van unless I have proven myself innocent with the photo evidence above.
              </label>
            </div>

            <button
              type="submit"
              className="rounded-[47px] bg-[#5937E0] border-2 border-[#5937E0] self-end mt-[40px] w-[200px] px-[70px] py-[26px] font-dm-sans text-[18px] text-white font-bold uppercase tracking-[2px] leading-[1.3] hover:bg-[#4826d9] transition-colors md:mr-1 md:px-5 md:mt-10"
            >
              Submit
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VanReturn;