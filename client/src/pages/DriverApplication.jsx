import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const DriverApplication = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    licenseNumber: "",
    licenseState: "",
    licensePicture: null,
    safetyCertificate: null,
    drivingHistory: "",
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
    console.log("Form submitted:", formData);
  };

  return (
    <div className="bg-white overflow-hidden">
      <div className="flex w-full pl-[7px] flex-col items-stretch">
        <Header />

        <h1 className="text-[#5937E0] text-[50px] font-work-sans font-bold self-start mt-[51px] ml-[156px] md:text-[40px] md:mt-10">
          Driver Application
        </h1>

        <p className="text-black text-[20px] font-work-sans font-light self-start mt-[42px] ml-[156px] md:mt-10">
          Complete this short form to request permission to drive a UCLA project
          van.
        </p>

        <form
          onSubmit={handleSubmit}
          className="rounded-[10px] border-[3px] border-[#EBEAED] self-center flex mt-[70px] w-4/5 max-w-[1114px] px-10 py-[59px] flex-col items-stretch md:max-w-full md:px-5 md:mt-10"
        >
          <div className="flex items-stretch gap-5 font-work-sans text-sm text-black font-bold uppercase tracking-[2px] leading-8 flex-wrap justify-between">
            <div className="flex flex-col items-stretch flex-1">
              <label htmlFor="fullName" className="self-start">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="rounded-[100px] border-2 border-black h-11 mt-6 px-5"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex flex-col items-stretch flex-1">
              <label htmlFor="licenseNumber" className="ml-3 md:ml-2.5">
                Driver's License Number
              </label>
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                className="rounded-[100px] border-2 border-black h-11 mt-6 px-5"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex flex-col items-stretch flex-1">
              <label htmlFor="licenseState" className="text-center">
                Driver's License State
              </label>
              <input
                type="text"
                id="licenseState"
                name="licenseState"
                className="rounded-[100px] border-2 border-black h-11 mt-6 px-5"
                value={formData.licenseState}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="flex mt-[57px] w-[834px] max-w-full items-stretch gap-5 flex-wrap justify-between">
            <div className="flex flex-col items-stretch flex-1">
              <label className="font-work-sans text-sm font-bold uppercase tracking-[2px] leading-8">
                Driver's License Picture
              </label>
              <div className="rounded-[39px] border-2 border-black flex flex-grow p-[69px] flex-col items-center justify-center cursor-pointer md:max-w-full md:mt-10 md:p-5">
                <input
                  type="file"
                  id="licensePicture"
                  name="licensePicture"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <label htmlFor="licensePicture">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/7ba79199a786d84d7792321f5aef835657b51ed7?placeholderIfAbsent=true"
                    alt="Upload icon"
                    className="aspect-square object-contain w-[43px]"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col items-stretch flex-1">
              <label className="font-work-sans text-sm font-bold uppercase tracking-[2px] leading-8">
                Driving Safety Certificate
              </label>
              <div className="rounded-[29px] border-2 border-black flex flex-grow p-[54px_80px_84px] flex-col items-center cursor-pointer md:max-w-full md:mt-10 md:px-5">
                <input
                  type="file"
                  id="safetyCertificate"
                  name="safetyCertificate"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
                <label htmlFor="safetyCertificate">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/7ba79199a786d84d7792321f5aef835657b51ed7?placeholderIfAbsent=true"
                    alt="Upload icon"
                    className="aspect-square object-contain w-[43px]"
                  />
                </label>
              </div>
            </div>
          </div>

          <label className="text-black font-dm-sans text-sm font-bold leading-8 tracking-[2px] uppercase self-start mt-[70px] ml-[30px] md:ml-2.5 md:mt-10">
            Driving History (past 3 years)
          </label>
          <textarea
            name="drivingHistory"
            className="rounded-[39px] border-2 border-black w-full h-[181px] mt-[21px] p-5 resize-none"
            value={formData.drivingHistory}
            onChange={handleInputChange}
            required
          />

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

export default DriverApplication;
