import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const VanReservation = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    pickupDate1: "",
    pickupTime1: "",
    pickupDate2: "",
    pickupTime2: "",
    tripPurpose: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reservation submitted:", formData);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="flex w-full pl-[7px] flex-col items-stretch">
        <Header />

        <h1 className="text-[#5937E0] text-[50px] font-work-sans font-bold self-start mt-[51px] ml-[156px] md:text-[40px] md:mt-10">
          Reserve a Van
        </h1>

        <p className="text-black text-[20px] font-work-sans font-light self-start mt-[42px] ml-[156px] md:mt-10">
          Schedule your van reservation for your project. Please ensure your return times are accurate.
        </p>

        <form
          onSubmit={handleSubmit}
          className="rounded-[10px] border-[3px] border-[#EBEAED] self-center flex mt-[70px] w-4/5 max-w-[1114px] px-10 py-[59px] flex-col items-stretch md:max-w-full md:px-5 md:mt-10"
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
              <label htmlFor="pickupDate1" className="self-start">
                Pickup Date
              </label>
              <input
                type="date"
                id="pickupDate1"
                name="pickupDate1"
                className="rounded-[100px] border-2 border-black h-11 mt-6 px-5"
                value={formData.pickupDate1}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex flex-col items-stretch flex-1">
              <label htmlFor="pickupTime1" className="self-start">
                Pickup Time
              </label>
              <input
                type="time"
                id="pickupTime1"
                name="pickupTime1"
                className="rounded-[100px] border-2 border-black h-11 mt-6 px-5"
                value={formData.pickupTime1}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="flex items-stretch gap-5 font-work-sans text-sm text-black font-bold uppercase tracking-[2px] leading-8 flex-wrap justify-between mt-8">
            <div className="flex-1">
              {/* Empty div for alignment */}
            </div>

            <div className="flex flex-col items-stretch flex-1">
              <label htmlFor="pickupDate2" className="self-start">
                Pickup Date
              </label>
              <input
                type="date"
                id="pickupDate2"
                name="pickupDate2"
                className="rounded-[100px] border-2 border-black h-11 mt-6 px-5"
                value={formData.pickupDate2}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col items-stretch flex-1">
              <label htmlFor="pickupTime2" className="self-start">
                Pickup Time
              </label>
              <input
                type="time"
                id="pickupTime2"
                name="pickupTime2"
                className="rounded-[100px] border-2 border-black h-11 mt-6 px-5"
                value={formData.pickupTime2}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex flex-col mt-[57px]">
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
            className="rounded-[47px] bg-[#5937E0] border-2 border-[#5937E0] self-end mt-[51px] w-[200px] px-[70px] py-[26px] font-dm-sans text-[18px] text-white font-bold uppercase tracking-[2px] leading-[1.3] hover:bg-[#4826d9] transition-colors md:mr-1 md:px-5 md:mt-10"
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