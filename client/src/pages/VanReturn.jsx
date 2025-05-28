import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const VanReturn = () => {
  const [formData, setFormData] = useState({
    bookingId: "BK12345", // Pre-filled booking ID
    fuelLevel: "",
    cleanliness: "",
    visibleDamage: "",
    damageDescription: "",
    exteriorPhoto: null,
    interiorPhoto: null,
    dashboardPhoto: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Return form submitted:", formData);
    // Here you would typically send the data to your backend
  };

  const handleDisconnect = () => {
    console.log("Disconnecting from session");
    // Handle disconnect logic here
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="flex w-full pl-[7px] flex-col items-stretch">
        <Header />

        <div className="flex items-center justify-between mt-[51px] ml-[156px] mr-[156px] md:flex-col md:items-start">
          <h1 className="text-[#5937E0] text-[50px] font-work-sans font-bold md:text-[40px] md:mt-10">
            Return
          </h1>
          <button
            onClick={handleDisconnect}
            className="bg-[#EBEAED] text-black px-6 py-2 rounded-md font-work-sans hover:bg-gray-300 transition-colors"
          >
            Disconnect
          </button>
        </div>

        <p className="text-black text-[20px] font-work-sans font-light self-start mt-[10px] ml-[156px] md:mt-5">
          Booking #{formData.bookingId}
        </p>

        <form
          onSubmit={handleSubmit}
          className="rounded-[10px] border-[3px] border-[#EBEAED] self-center flex mt-[40px] w-4/5 max-w-[1114px] px-10 py-[40px] flex-col items-stretch md:max-w-full md:px-5 md:mt-10"
        >
          <div className="flex items-stretch gap-5 font-work-sans text-sm text-black font-bold uppercase tracking-[2px] leading-8 flex-wrap justify-between">
            <div className="flex flex-col items-stretch flex-1">
              <label htmlFor="fuelLevel" className="self-start">
                Fuel Level
              </label>
              <input
                type="text"
                id="fuelLevel"
                name="fuelLevel"
                className="rounded-[100px] border-2 border-black h-11 mt-6 px-5"
                value={formData.fuelLevel}
                onChange={handleInputChange}
                required
                placeholder="e.g., 3/4, Full"
              />
            </div>

            <div className="flex flex-col items-stretch flex-1">
              <label htmlFor="cleanliness" className="self-start">
                Cleanliness
              </label>
              <input
                type="text"
                id="cleanliness"
                name="cleanliness"
                className="rounded-[100px] border-2 border-black h-11 mt-6 px-5"
                value={formData.cleanliness}
                onChange={handleInputChange}
                required
                placeholder="e.g., Clean, Needs cleaning"
              />
            </div>
          </div>

          <div className="flex items-stretch gap-5 font-work-sans text-sm text-black font-bold uppercase tracking-[2px] leading-8 flex-wrap justify-between mt-8">
            <div className="flex flex-col items-stretch flex-1">
              <label htmlFor="visibleDamage" className="self-start">
                Any Visible Damage?
              </label>
              <input
                type="text"
                id="visibleDamage"
                name="visibleDamage"
                className="rounded-[100px] border-2 border-black h-11 mt-6 px-5"
                value={formData.visibleDamage}
                onChange={handleInputChange}
                placeholder="Yes/No"
              />
            </div>

            <div className="flex flex-col items-stretch flex-[2]">
              <label htmlFor="damageDescription" className="self-start">
                If Yes, Describe the Damage Here
              </label>
              <input
                type="text"
                id="damageDescription"
                name="damageDescription"
                className="rounded-[100px] border-2 border-black h-11 mt-6 px-5"
                value={formData.damageDescription}
                onChange={handleInputChange}
                placeholder="Describe any damage in detail"
              />
            </div>
          </div>

          <div className="flex mt-[40px] w-full max-w-full items-stretch gap-5 flex-wrap justify-between">
            <div className="flex flex-col items-stretch flex-1">
              <label className="font-work-sans text-sm font-bold uppercase tracking-[2px] leading-8">
                Exterior Photo
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
                Interior Photo
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
                Dashboard Photo (Fuel etc)
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

export default VanReturn;
