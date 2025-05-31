import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VanReturn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bookingId: "BK12345", // Pre-filled booking ID
    projectName: "CSSA PROM", // Pre-filled project name
    vanSerialNumber: "405437", // Pre-filled van serial number
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
    acceptResponsibility: false
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Return form submitted:", formData);
    // Here you would typically send the data to your backend
    // After successful submission, navigate to success page
    navigate("/return-success");
  };

  return (
    <div className="bg-white overflow-hidden">
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

        <h1 className="text-[#5937E0] text-[50px] font-work-sans font-bold self-start mt-[51px] ml-[156px] md:text-[40px] md:mt-10">
          Return a Van
        </h1>

        <p className="text-black text-[20px] font-work-sans font-light self-start mt-[10px] ml-[156px] md:mt-5">
          Booking #{formData.bookingId}.
        </p>
        
        <p className="text-black text-[20px] font-work-sans font-light self-start mt-[5px] ml-[156px]">
          Please file a return form <span className="font-semibold">per van</span> at the end of each trip.
        </p>

        <form
          onSubmit={handleSubmit}
          className="rounded-[10px] border-[3px] border-[#EBEAED] self-center flex mt-[40px] w-4/5 max-w-[1114px] px-10 py-[40px] flex-col items-stretch md:max-w-full md:px-5 md:mt-10"
        >
          <div className="flex items-stretch gap-5 font-work-sans text-sm text-black font-bold uppercase tracking-[2px] leading-8 flex-wrap justify-between">
            <div className="flex flex-col items-stretch flex-1">
              <label className="self-start">
                Project Name
              </label>
              <div className="text-3xl font-bold text-black mt-2 uppercase">
                {formData.projectName}
              </div>
            </div>

            <div className="flex flex-col items-stretch flex-1">
              <label className="self-start">
                Van Serial Number
              </label>
              <div className="text-3xl font-bold text-black mt-2">
                {formData.vanSerialNumber}
              </div>
            </div>
          </div>

          <div className="flex items-stretch gap-5 font-work-sans text-sm text-black font-bold uppercase tracking-[2px] leading-8 flex-wrap justify-between mt-8">
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
            <label htmlFor="parkingLocation" className="font-work-sans text-sm font-bold uppercase tracking-[2px] leading-8">
              Where did you park the van?
            </label>
            <input
              type="text"
              id="parkingLocation"
              name="parkingLocation"
              className="rounded-[100px] border-2 border-black h-11 mt-2 px-5 w-full"
              value={formData.parkingLocation}
              onChange={handleInputChange}
              required
            />
            <p className="text-xs mt-1 text-gray-600">
              * If you used the default Parking Lot 4 Level 2 North, enter P4L2N. Else, please message the transportation director NOW
            </p>
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
                  I got into an accident/ caused new damage. I have reported it at https://bit.ly/40oYls2?r=qr
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
                Dashboard Display Photo (Fuel etc)
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

        {/* Footer */}
        <footer className="mt-16 pb-8">
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

// Success page component
export const ReturnSuccess = () => {
  return (
    <div className="bg-[#1E1E1E] min-h-screen">
      <div className="flex w-full flex-col items-stretch">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-4 border-b border-gray-700">
          <div className="flex items-center">
            <img src="/car-icon.svg" alt="CSC Transportation" className="h-8 w-8 mr-2" />
            <span className="font-bold text-white">CSC Transportation</span>
          </div>
          <nav className="flex space-x-6 text-white">
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
              <path d="M5 12L10 17L20 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-[#5937E0] text-4xl font-bold mb-8">SUBMITTED!</h1>
          <p className="text-xl text-white">Thank you for taking care of our vans</p>
        </div>

        {/* Footer */}
        <footer className="mt-auto pb-8">
          <div className="flex justify-between items-center max-w-[1114px] mx-auto px-8">
            <div className="flex items-center">
              <img src="/van-icon.svg" alt="CSC Transportation" className="h-12 w-12 mr-2" />
              <span className="font-bold text-white">CSC Transportation</span>
            </div>
            <div className="flex items-center text-white">
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
          <div className="text-center text-sm text-gray-400 mt-4">
            © Copyright Car Rental 2024. Design by Figma.guru
          </div>
        </footer>
      </div>
    </div>
  );
};

export default VanReturn;
