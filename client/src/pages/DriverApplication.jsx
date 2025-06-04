import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";



const DriverApplication = () => {
  // states for handleSubmit below, guard against double submission
  const [hasSubmittedBefore, setHasSubmittedBefore] = useState(false);
  const [showOverride, setShowOverride] = useState(false);
  
  // guard against double submission
  useEffect(() => {
    const checkSubmission = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/driverapp/findpriorApp", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (data.hasDriverApplication) {
            setHasSubmittedBefore(true);
          }
        }
      } catch (err) {
        console.error("Failed to check prior submission:", err);
      }
    };

    checkSubmission();
  }, []);

  // When user press submit submit
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (hasSubmittedBefore && !showOverride) {
    const confirm = window.confirm(
      "You have already submitted an application. Submitting again will overwrite your previous submission.\n\nDo you want to continue?"
    );
    if (!confirm) return;
    setShowOverride(true);
  }

  const form = e.target;

  const payload = {
    fullName: form[0].value.trim(),
    licenseNumber: form[1].value.trim(),
    licenseState: form[2].value.trim(),
    phoneNumber: form[3].value.trim(),
    project: form[4].value.trim(),
    licenseExpiry: form[5].value,
    dob: form[6].value,
    drivingPoints: form[7].value,
    dstDate: form[8].value,
  };

  // ## Validation of Non-null fields START ###
  // Validate main fields
  for (const [key, value] of Object.entries(payload)) {
    if (!value) {
      alert(`Please fill out the "${key}" field.`);
      return;
    }
  }

  // Validate checkboxes (assumes 4 checkboxes in order)
  const checkboxes = [
    form[9],
    form[10],
    form[11],
    form[12],
  ];

  const unchecked = checkboxes.findIndex(cb => !cb.checked);
  if (unchecked !== -1) {
    alert("Please check all acknowledgments before submitting.");
    return;
  }

  // Validate signature field (assumes it's form[13])
  const signature = form[13].value.trim();
  if (!signature) {
    alert("Please enter your full name as a legally binding signature.");
    return;
  }

  // ## Validation of Non-null fields END ###

  try {
    const res = await fetch("http://localhost:3000/api/driverapp/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Submission failed: " + (data.error || "Unknown error"));
    } else {
      alert("Submitted successfully");
      window.location.href = "/dashboard";  // redirect to dashboard for successful submission
    }
  } catch (err) {
    console.error("Submission error:", err);
    alert("An error occurred. Check console.");
  }
};

  /* ################################## DESIGN ELEMENTS ################################## */

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex flex-col items-center px-[72px] py-10 w-full md:px-10 sm:px-5 sm:py-5">
        <h1 className="w-full max-w-[1097px] text-[#5937E0] font-work-sans text-[50px] font-bold leading-normal mb-5 md:text-[40px] sm:text-[28px] sm:mb-4">
          Approved Driver Application
        </h1>

        <p className="w-full max-w-[1114px] text-black font-work-sans text-xl font-normal leading-normal mb-10 md:text-lg sm:text-base sm:mb-[30px]">
          Create a UCLA WorkSafe profile at
          https://worksafe.ucla.edu/UCLA/Programs/Standard/Control/elmLearner.wml
          Submit a Driver Safety Training request at
          https://app.smartsheet.com/b/form?EQBCT=2218571313824a20927052602c1df717
          (it takes around ~2 business dats for UCLA WorkSafe to assign you the
          Driver Safety Training (DST) module). Complete the Driver Safety
          Training (DST) to obtain certificate if you have not in the last 2
          years. Else, just download your existing certificate and state the
          date of completion. Watch CSC Transportation's training video embedded
          in the <span className="font-bold text-[#5937E0]">Resources</span>{" "}
          page Once done with 1-4, Complete the form below to request permission
          to drive CSC van for your project.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-[1114px] border-[3px] border-[#EBEAED] rounded-[10px] p-10 md:p-[30px] sm:p-5">
          <div className="flex flex-col gap-[30px] sm:gap-5">
            {/* First Row */}
            <div className="flex flex-wrap gap-5 sm:gap-4">
              <div className="flex flex-col gap-2 w-[404px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full h-[43px] rounded-[100px] border-2 border-black"
                />
              </div>

              <div className="flex flex-col gap-2 w-[254px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  Driver's License Number
                </label>
                <input
                  type="text"
                  className="w-full h-[43px] rounded-[100px] border-2 border-black"
                />
              </div>

              <div className="flex flex-col gap-2 w-[234px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  Driver's License STATE
                </label>
                <input
                  type="text"
                  className="w-full h-[43px] rounded-[100px] border-2 border-black"
                />
              </div>
            </div>

            {/* Second Row */}
            <div className="flex flex-wrap gap-5 sm:gap-4">
              <div className="flex flex-col gap-2 w-[313px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  Phone number
                </label>
                <input
                  type="tel"
                  className="w-full h-[43px] rounded-[100px] border-2 border-black"
                />
              </div>

              <div className="flex flex-col gap-2 w-[333px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  Project(s) you will be driving for
                </label>
                <input
                  type="text"
                  className="w-full h-[43px] rounded-[100px] border-2 border-black"
                />
              </div>

              <div className="flex flex-col gap-2 w-[254px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  License Expiry Date (MM/DD/YYYY)
                </label>
                <input
                  type="date"
                  className="w-full h-[43px] rounded-[100px] border-2 border-black"
                />
              </div>
            </div>

            {/* Third Row */}
            <div className="flex flex-wrap gap-5 sm:gap-4">
              <div className="flex flex-col gap-2 w-[313px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  Date of birth (MM/DD/YYYY)
                </label>
                <input
                  type="date"
                  className="w-full h-[43px] rounded-[100px] border-2 border-black"
                />
              </div>

              <div className="flex flex-col gap-2 w-[234px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  number of points on driving record
                </label>
                <input
                  type="number"
                  className="w-full h-[43px] rounded-[100px] border-2 border-black"
                />
              </div>

              <div className="flex flex-col gap-2 w-[295px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  Driver safety training Date (MM/DD/YYYY)
                </label>
                <input
                  type="date"
                  className="w-full h-[43px] rounded-[100px] border-2 border-black"
                />
              </div>
            </div>

            {/* File Upload Section */}
            <div className="flex flex-wrap gap-5 sm:gap-4">
              <div className="flex flex-col gap-2 w-[482px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  DMV Pull
                </label>
                <div className="w-full h-[179px] rounded-[39px] border-2 border-black flex justify-center items-center">
                  <svg
                    width="43"
                    height="44"
                    viewBox="0 0 43 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M37.625 27.1801V34.2516C37.625 35.1893 37.2475 36.0886 36.5755 36.7517C35.9035 37.4148 34.992 37.7873 34.0417 37.7873H8.95833C8.00797 37.7873 7.09654 37.4148 6.42453 36.7517C5.75253 36.0886 5.375 35.1893 5.375 34.2516V27.1801M30.4583 14.805L21.5 5.96558M21.5 5.96558L12.5417 14.805M21.5 5.96558V27.1801"
                      stroke="#1E1E1E"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-[462px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  UCLA Worksafe Driver safety training Certificate
                </label>
                <div className="w-full h-[179px] rounded-[29px] border-2 border-black flex justify-center items-center">
                  <svg
                    width="43"
                    height="44"
                    viewBox="0 0 43 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M37.625 27.2199V34.2914C37.625 35.2291 37.2475 36.1284 36.5755 36.7915C35.9035 37.4546 34.992 37.8271 34.0417 37.8271H8.95833C8.00797 37.8271 7.09654 37.4546 6.42453 36.7915C5.75253 36.1284 5.375 35.2291 5.375 34.2914V27.2199M30.4583 14.8447L21.5 6.00537M21.5 6.00537L12.5417 14.8447M21.5 6.00537V27.2199"
                      stroke="#1E1E1E"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <p className="text-black font-roboto text-[13px] font-normal leading-5 underline">
              *To access a copy of your DMV record, please visit
              <a
                href="https://www.dmv.ca.gov/portal/customer-service/request-vehicle-or-driver-records/online-driver-record-request/"
                className="underline"
              >
                https://www.dmv.ca.gov/portal/customer-service/request-vehicle-or-driver-records/online-driver-record-request/
              </a>
              or your respective state's DMV website. Log in to your account and
              request a driver's record. There may be a DMV fee of $2-$4
              depending on your individual record. CSC will NOT reimburse this
              fee.
            </p>

            {/* Acknowledgment Section */}
            <h2 className="text-black font-work-sans text-xl font-bold leading-[26px] uppercase mt-10 mb-5 sm:text-lg sm:mt-[30px] sm:mb-4">
              CHECK TO ACKNOWLEDGE (MANDATORY)
            </h2>

            <div className="flex flex-col gap-3 mb-[30px] sm:mb-5">
              {/* Checkbox items */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="w-6 h-[21px] border border-black flex-shrink-0 mt-0.5"
                />
                <label className="text-black font-roboto text-sm font-normal leading-[15px]">
                  I am aware that, if approved, I may NOT transfer possession of
                  university property (the keys and vans) to anyone else after I
                  check out the keys.
                </label>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="w-6 h-[21px] border border-black flex-shrink-0 mt-0.5"
                />
                <label className="text-black font-roboto text-sm font-normal leading-4">
                  I know I am responsible for any tolls and citations (tickets)
                  the vans receive while I am using it, and failure to pay them
                  may result in suspension of van privileges for my project.
                </label>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="w-6 h-[21px] border border-black flex-shrink-0 mt-0.5"
                />
                <label className="text-black font-roboto text-sm font-normal leading-[15px]">
                  I declare that I will submit photos of the dashboard display,
                  interior, and exterior of vans upon return. I will be
                  responsible for all damages, faults, and the state cleanliness
                  of the van after return except the preexisting issues I
                  indemnified myself against during pick up.
                </label>
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="w-6 h-[21px] border border-black flex-shrink-0 mt-0.5"
                />
                <label className="text-black font-roboto text-sm font-normal leading-[15px]">
                  I declare that I will return the vans and keys on time with
                  &gt;75% fuel level. I understand that failure to do so results
                  in a deduction of my project's credit score.
                </label>
              </div>
            </div>

            {/* Signature Section */}
            <div className="flex flex-col gap-2 w-[404px] mb-[30px] sm:w-full sm:mb-5">
              <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                TYPE Full Name AS A LEgally-binding ELECTRONIC SIGNATURE
              </label>
              <input
                type="text"
                className="w-full h-[43px] rounded-[100px] border-2 border-black"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end sm:justify-center">
              <button
                type="submit"
                className="text-white font-dm-sans text-xl font-bold leading-[26px] uppercase w-[248px] h-[83px] rounded-[47px] border-2 border-[#5937E0] bg-[#5937E0] cursor-pointer sm:text-lg sm:w-full sm:h-[60px] sm:rounded-[30px]"
              >
                SUBMIT
              </button>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default DriverApplication;
