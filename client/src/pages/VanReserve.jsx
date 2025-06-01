import React, { useState } from "react";
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reservation submitted:", formData);
    // Here you would typically send the data to your backend
    // After successful submission, navigate to success page
    navigate("/reservation-success");
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="flex w-full flex-col items-stretch">
        <Header />

        <h1 className="text-[#5937E0] text-[50px] font-work-sans font-bold self-start mt-[51px] ml-[156px] md:text-[40px] md:mt-10">
          Reserve a Van
        </h1>

        <p className="text-black text-[20px] font-work-sans font-light self-start mt-[10px] ml-[156px] md:mt-5">
          Schedule your van reservation for your project. Please fill one reservation <span className="font-semibold">per trip</span> (one pick up & return date, one address).
          <br />Please ensure your return times are accurate.
        </p>

        <form
          onSubmit={handleSubmit}
          className="rounded-[10px] border-[3px] border-[#EBEAED] self-center flex mt-[40px] w-4/5 max-w-[1114px] px-10 py-[40px] flex-col items-stretch md:max-w-full md:px-5 md:mt-10"
        >
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
              <span className="text-xs mt-1 text-gray-600 normal-case tracking-normal">* For this site/trip only</span>
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
              Check this box if site is NOT within 75 miles of UCLA
            </label>
          </div>

          <div className="flex flex-col mt-[40px]">
            <label htmlFor="tripPurpose" className="font-work-sans text-sm font-bold uppercase tracking-[2px] leading-8 self-start ml-[30px] md:ml-2.5">
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

// Success page component
export const ReservationSuccess = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="flex w-full flex-col items-stretch">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <img src="/car-icon.svg" alt="CSC Transportation" className="h-8 w-8 mr-2" />
            <span className="font-bold">CSC Transportation</span>
          </div>
          <nav className="flex space-x-6">
            <a href="#" className="hover:text-[#5937E0]">Home</a>
            <a href="#" className="hover:text-[#5937E0]">Resources</a>
            <a href="#" className="hover:text-[#5937E0]">Dashboard</a>
            <a href="#" className="hover:text-[#5937E0]">Van Schedule</a>
            <a href="#" className="hover:text-[#5937E0]">Contact Us</a>
          </nav>
        </header>

        {/* Success content */}
        <div className="flex flex-col items-center justify-center flex-grow py-20">
          <div className="bg-[#5937E0] rounded-full p-6 mb-6">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12L10 17L20 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-[#5937E0] text-4xl font-bold mb-8">SUBMITTED!</h1>
          <p className="text-xl">Thank you for your van reservation</p>
        </div>

        {/* Footer */}
        <footer className="mt-auto pb-8">
          <div className="flex justify-between items-center max-w-[1114px] mx-auto px-8">
            <div className="flex items-center">
              <img src="/van-icon.svg" alt="CSC Transportation" className="h-12 w-12 mr-2" />
              <span className="font-bold">CSC Transportation</span>
            </div>
            <div className="flex items-center">
              <div className="flex items-center mr-8">
                <div className="bg-[#FFC107] rounded-full p-2 mr-2">
                  <img src="/email-icon.svg" alt="Email" className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm">Email</div>
                  <div className="text-sm font-semibold">transportation@uclacsc.org</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-[#FFC107] rounded-full p-2 mr-2">
                  <img src="/phone-icon.svg" alt="Phone" className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm">Director's Phone</div>
                  <div className="text-sm font-semibold">(510) 828 7036</div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center text-sm text-gray-500 mt-4">
            © Copyright Car Rental 2024. Design by Figma.guru
          </div>
        </footer>
      </div>
    </div>
  );
};

export default VanReservation;
