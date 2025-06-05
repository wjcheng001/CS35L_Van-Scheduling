import React, { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link, useNavigate } from 'react-router-dom';
import "../styles/driver-application.css"

// List of U.S. state codes
const usStates = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

// List of project names
const projects = [
  "AATP", "AMSA", "BARC", "Best Buddies", "BFPC", "Bruin Hope",
  "Bruin Initiative", "Bruin Partners", "Bruin Shelter", "CHAMPs",
  "Expressive Movement Initiative", "Fitnut (formerly SCOPE)", "GCGP",
  "GMT", "Habitat for Humanity", "Hunger Project", "KDSAP", "Kids Korner",
  "Medlife", "PCH", "PREP", "Project Literacy", "Project Lux",
  "Special Olympics", "Swipe Out Hunger", "The Bruin Experiment",
  "UNICEF", "VCH", "VITA", "Watts", "Writer's Den", "WYSE", "CSC"
];

const DriverApplication = () => {
  const navigate = useNavigate();
  const [hasSubmittedBefore, setHasSubmittedBefore] = useState(false);
  const [showOverride, setShowOverride] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dmvFile, setDmvFile] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const dmvInputRef = useRef(null);
  const certificateInputRef = useRef(null);
  const [licenseState, setLicenseState] = useState("");
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [showStateSuggestions, setShowStateSuggestions] = useState(false);
  const [projectInput, setProjectInput] = useState("");
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [projectSuggestions, setProjectSuggestions] = useState([]);
  const [showProjectSuggestions, setShowProjectSuggestions] = useState(false);

  useEffect(() => {
    const checkSubmissionAndAdmin = async () => {
      try {
        const submissionRes = await fetch("http://localhost:3000/api/driverapp/findpriorApp", {
          credentials: "include",
        });
        if (submissionRes.ok) {
          const data = await submissionRes.json();
          if (data.hasDriverApplication) {
            setHasSubmittedBefore(true);
          }
        }
        const adminRes = await fetch("http://localhost:3000/api/admin/role", {
          credentials: "include",
        });
        if (adminRes.ok) {
          const adminData = await adminRes.json();
          setIsAdmin(adminData.user?.role === 'admin');
        }
      } catch (err) {
        console.error("Failed to check prior submission or admin status:", err);
      }
    };
    checkSubmissionAndAdmin();
  }, []);

  const handleLicenseStateChange = (e) => {
    const value = e.target.value.toUpperCase();
    setLicenseState(value);
    if (value) {
      const filteredStates = usStates.filter((state) =>
        state.toUpperCase().startsWith(value)
      );
      setStateSuggestions(filteredStates);
      setShowStateSuggestions(true);
    } else {
      setStateSuggestions([]);
      setShowStateSuggestions(false);
    }
  };

  const handleStateSuggestionClick = (state) => {
    setLicenseState(state);
    setStateSuggestions([]);
    setShowStateSuggestions(false);
  };

  const handleProjectInputChange = (e) => {
    const value = e.target.value;
    setProjectInput(value);
    if (value) {
      const filteredProjects = projects.filter((project) =>
        project.toLowerCase().startsWith(value.toLowerCase())
      );
      setProjectSuggestions(filteredProjects);
      setShowProjectSuggestions(true);
    } else {
      setProjectSuggestions([]);
      setShowProjectSuggestions(false);
    }
  };

  const handleProjectSelect = (project) => {
    if (selectedProjects.length >= 3) {
      alert("You can select up to 3 projects only.");
      return;
    }
    if (!selectedProjects.includes(project)) {
      setSelectedProjects([...selectedProjects, project]);
    }
    setProjectInput("");
    setProjectSuggestions([]);
    setShowProjectSuggestions(false);
  };

  const handleProjectKeyDown = (e) => {
    if (e.key === "Enter" && projectInput) {
      e.preventDefault();
      handleProjectSelect(projectInput.trim());
    }
  };

  const handleProjectRemove = (projectToRemove) => {
    setSelectedProjects(selectedProjects.filter((project) => project !== projectToRemove));
  };

  const handleFileChange = (e, setFile, inputRef) => {
    const file = e.target.files[0];
    setFile(file || null);
  };

  const handleFileDelete = (setFile, inputRef) => {
    setFile(null);
    inputRef.current.value = null;
  };

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length === 0) {
      return "";
    }
    if (numbers.length <= 3) {
      return `(${numbers}`;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhoneNumber(formatPhoneNumber(value));
      setError("");
    } else {
      setError("Phone number must be exactly 10 digits.");
    }
  };

  const handleDrivingPointsChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*$/.test(value)) {
      e.target.value = value;
      setError("");
    } else {
      setError("Number of points must be a number.");
      e.target.value = value.replace(/\D/g, "");
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

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
    const formData = new FormData(form);
    const payload = {
      fullName: formData.get("fullName")?.trim(),
      licenseNumber: formData.get("licenseNumber")?.trim(),
      licenseState: licenseState,
      phoneNumber: phoneNumber.replace(/\D/g, ""),
      project: selectedProjects.join(", "),
      licenseExpiry: formData.get("licenseExpiry"),
      dob: formData.get("dob"),
      drivingPoints: formData.get("drivingPoints"),
      dstDate: formData.get("dstDate"),
      dmvFile,
      certificateFile,
    };
    for (const [key, value] of Object.entries(payload)) {
      if (!value && key !== "dmvFile" && key !== "certificateFile") {
        alert(`Please fill out the "${key}" field.`);
        return;
      }
    }
    if (payload.phoneNumber.length !== 10) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }
    if (!isAdmin) {
      if (!dmvFile) {
        alert("Please upload your DMV Pull file.");
        return;
      }
      if (!certificateFile) {
        alert("Please upload your UCLA Worksafe Driver Safety Training Certificate.");
        return;
      }
    }
    const checkboxNames = [
      "acknowledgeKeys",
      "acknowledgeTolls",
      "acknowledgePhotos",
      "acknowledgeFuel",
    ];
    for (const name of checkboxNames) {
      if (!formData.get(name)) {
        alert("Please check all acknowledgments before submitting.");
        return;
      }
    }
    const signature = formData.get("signature")?.trim();
    if (!signature) {
      alert("Please enter your full name as a legally binding signature.");
      return;
    }
    try {
      const submitData = new FormData();
      for (const [key, value] of Object.entries(payload)) {
        submitData.append(key, value);
      }
      const res = await fetch("http://localhost:3000/api/driverapp/process", {
        method: "POST",
        credentials: "include",
        body: submitData,
      });
      const data = await res.json();
      if (!res.ok) {
        alert("Submission failed: " + (data.error || "Unknown error"));
      } else {
        alert("Submitted successfully");
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("An error occurred. Check console.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex flex-col items-center px-[72px] py-10 w-full md:px-10 sm:px-5 sm:py-5">
        <div className="flex justify-between items-center w-full max-w-[1114px] mb-6">
          <h1 className="text-[#5937E0] font-work-sans text-[50px] font-bold leading-normal md:text-[40px] sm:text-[28px]">
            Approved Driver Application
          </h1>
          <button
            onClick={handleBackToDashboard}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
        <p className="w-full max-w-[1114px] text-black font-work-sans text-xl font-normal leading-normal mb-2 md:text-lg sm:text-base sm:mb-[5px]">
          Get approved in 5 steps:
        </p>
        <ol className="w-full max-w-[1114px] text-black font-work-sans text-xl font-normal leading-normal mb-10 md:text-lg sm:text-base sm:mb-[30px] list-decimal list-inside">
          <li className="mb-2">
            Create a UCLA WorkSafe profile at{" "}
            <a
              href="https://worksafe.ucla.edu/UCLA/Programs/Standard/Control/elmLearner.wml"
              className="underline decoration-1 underline-offset-2 text-blue-600 hover:bg-blue-100 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://worksafe.ucla.edu/UCLA/Programs/Standard/Control/elmLearner.wml
            </a>
            {". "}
          </li>
          <li className="mb-2">
            Submit a Driver Safety Training (DST) request at{" "}
            <a
              href="https://app.smartsheet.com/b/form?EQBCT=2218571313824a20927052602c1df717"
              className="underline decoration-1 underline-offset-2 text-blue-600 hover:bg-blue-100 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://app.smartsheet.com/b/form?EQBCT=2218571313824a20927052602c1df717
            </a>
            {". "}
            <span className="indenT">It takes around ~2 business days for UCLA WorkSafe to assign you the DST module.</span>
          </li>
          <li className="mb-2">
            Complete the Driver Safety Training (DST) to obtain a certificate if you have not in the last 2 years.{" "}
            <span className="indenT">Else, just download your existing certificate and state the date of completion.</span>
          </li>
          <li className="mb-2">
            Watch CSC Transportation's training video embedded in the{" "}
            <Link
              to="/resources"
              className="font-bold text-[#5937E0] underline decoration-1 underline-offset-2 hover:bg-purple-100 transition-colors"
            >
              Resources
            </Link>{" "}
            page.
          </li>
          <li className="mb-2">
            Once done with 1-4, complete the form below to request permission to drive the CSC van for your project.
          </li>
        </ol>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[1114px] border-[3px] border-[#EBEAED] rounded-[10px] p-10 md:p-[30px] sm:p-5"
        >
          {error && (
            <div className="text-red-600 text-sm text-center mb-4">{error}</div>
          )}
          <div className="flex flex-col gap-[30px] sm:gap-5">
            <div className="flex flex-wrap gap-5 sm:gap-4">
              <div className="flex flex-col gap-2 w-[404px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  className="w-full h-[43px] px-4 py-2 rounded-[100px] border-2 border-black"
                />
              </div>
              <div className="flex flex-col gap-2 w-[254px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  Driver's License Number
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  className="w-full h-[43px] px-4 py-2 rounded-[100px] border-2 border-black"
                />
              </div>
              <div className="flex flex-col gap-2 w-[234px] md:w-[calc(50%-10px)] sm:w-full relative">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  Driver's License STATE
                </label>
                <input
                  type="text"
                  name="licenseState"
                  value={licenseState}
                  onChange={handleLicenseStateChange}
                  className="w-full h-[43px] px-4 py-2 rounded-[100px] border-2 border-black"
                  autoComplete="off"
                />
                {showStateSuggestions && stateSuggestions.length > 0 && (
                  <ul className="absolute top-[70px] left-0 w-full bg-white border-2 border-black rounded-[10px] max-h-[150px] overflow-y-auto z-10">
                    {stateSuggestions.map((state) => (
                      <li
                        key={state}
                        onClick={() => handleStateSuggestionClick(state)}
                        className="px-4 py-2 text-black font-roboto text-sm cursor-pointer hover:bg-[#5937E0] hover:text-white transition-colors"
                      >
                        {state}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-5 sm:gap-4">
              <div className="flex flex-col gap-2 w-[313px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  Phone number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  className="w-full h-[43px] px-4 py-2 rounded-[100px] border-2 border-black"
                  placeholder="( _ _ _ ) _ _ _ - _ _ _ _"
                />
              </div>
              <div className="flex flex-col gap-2 w-[333px] md:w-[calc(50%-10px)] sm:w-full relative">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  Project(s) you will be driving for (up to 3)
                </label>
                <input
                  type="text"
                  name="project"
                  value={projectInput}
                  onChange={handleProjectInputChange}
                  onKeyDown={handleProjectKeyDown}
                  className="w-full h-[43px] px-4 py-2 rounded-[100px] border-2 border-black"
                  autoComplete="off"
                />
                {showProjectSuggestions && projectSuggestions.length > 0 && (
                  <ul className="absolute top-[70px] left-0 w-full bg-white border-2 border-black rounded-[10px] max-h-[150px] overflow-y-auto z-10">
                    {projectSuggestions.map((project) => (
                      <li
                        key={project}
                        onClick={() => handleProjectSelect(project)}
                        className="px-4 py-2 text-black font-roboto text-sm cursor-pointer hover:bg-[#5937E0] hover:text-white transition-colors"
                      >
                        {project}
                      </li>
                    ))}
                  </ul>
                )}
                {selectedProjects.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedProjects.map((project) => (
                      <div
                        key={project}
                        className="flex items-center bg-[#5937E0] text-white font-roboto text-sm px-3 py-1 rounded-full"
                      >
                        {project}
                        <button
                          type="button"
                          onClick={() => handleProjectRemove(project)}
                          className="ml-2 text-white hover:text-red-200"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 w-[254px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  License Expiry Date (MM/DD/YYYY)
                </label>
                <input
                  type="date"
                  name="licenseExpiry"
                  className="w-full h-[43px] px-4 py-2 rounded-[100px] border-2 border-black"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-5 sm:gap-4">
              <div className="flex flex-col gap-2 w-[313px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  Date of birth (MM/DD/YYYY)
                </label>
                <input
                  type="date"
                  name="dob"
                  className="w-full h-[43px] px-4 py-2 rounded-[100px] border-2 border-black"
                />
              </div>
              <div className="flex flex-col gap-2 w-[234px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  number of points on driving record
                </label>
                <input
                  type="number"
                  name="drivingPoints"
                  className="w-full h-[43px] px-4 py-2 rounded-[100px] border-2 border-black"
                  onChange={handleDrivingPointsChange}
                  pattern="[0-9]*"
                />
              </div>
              <div className="flex flex-col gap-2 w-[295px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  Driver safety training Date (MM/DD/YYYY)
                </label>
                <input
                  type="date"
                  name="dstDate"
                  className="w-full h-[43px] px-4 py-2 rounded-[100px] border-2 border-black"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-5 sm:gap-4">
              <div className="flex flex-col gap-2 w-[482px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  DMV Pull
                </label>
                <p className="text-black font-work-sans text-sm leading-[26px]">Accept jpeg, png, or gif</p>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    name="dmvFile"
                    className="w-full h-[179px] px-4 py-2 rounded-[39px] border-2 border-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#5937E0] file:text-white hover:file:bg-[#4b2db3] opacity-0 absolute"
                    onChange={(e) => handleFileChange(e, setDmvFile, dmvInputRef)}
                    ref={dmvInputRef}
                  />
                  <div className="w-full h-[179px] px-4 py-2 rounded-[39px] border-2 border-black flex items-center justify-center bg-white">
                    <span className="text-black font-roboto text-sm">
                      {dmvFile ? dmvFile.name : "Click Here to Upload File"}
                    </span>
                  </div>
                  {dmvFile && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-black font-roboto text-sm">{dmvFile.name}</span>
                      <button
                        type="button"
                        onClick={() => handleFileDelete(setDmvFile, dmvInputRef)}
                        className="text-red-600 font-roboto text-sm underline hover:bg-red-100 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-[462px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  UCLA Worksafe Driver safety training Certificate
                </label>
                <p className="text-black font-work-sans text-sm leading-[26px]">Accept jpeg, png, or gif</p>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    name="certificateFile"
                    className="w-full h-[179px] px-4 py-2 rounded-[39px] border-2 border-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#5937E0] file:text-white hover:file:bg-[#4b2db3] opacity-0 absolute"
                    onChange={(e) => handleFileChange(e, setCertificateFile, certificateInputRef)}
                    ref={certificateInputRef}
                  />
                  <div className="w-full h-[179px] px-4 py-2 rounded-[39px] border-2 border-black flex items-center justify-center bg-white">
                    <span className="text-black font-roboto text-sm">
                      {certificateFile ? certificateFile.name : "Click Here to Upload File"}
                    </span>
                  </div>
                  {certificateFile && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-black font-roboto text-sm">{certificateFile.name}</span>
                      <button
                        type="button"
                        onClick={() => handleFileDelete(setCertificateFile, certificateInputRef)}
                        className="text-red-600 font-roboto text-sm underline hover:bg-red-100 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p className="text-black font-roboto text-[13px] font-normal leading-5">
              *To access a copy of your DMV record, please visit
              {" "}
              <a
                href="https://www.dmv.ca.gov/portal/customer-service/request-vehicle-or-driver-records/online-driver-record-request/"
                className="underline decoration-1 underline-offset-2 text-blue-600 hover:bg-blue-100 transition-colors"
              >
                https://www.dmv.ca.gov/portal/customer-service/request-vehicle-or-driver-records/online-driver-record-request/
              </a>{" "}
              or your respective state's DMV website. Log in to your account and
              request a driver's record. There may be a DMV fee of $2-$4
              depending on your individual record. CSC will NOT reimburse this
              fee.
            </p>
            <h2 className="text-black font-work-sans text-xl font-bold leading-[26px] uppercase mt-10 mb-5 sm:text-lg sm:mt-[30px] sm:mb-4">
              CHECK TO ACKNOWLEDGE (MANDATORY)
            </h2>
            <div className="flex flex-col gap-3 mb-[30px] sm:mb-5">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="acknowledgeKeys"
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
                  name="acknowledgeTolls"
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
                  name="acknowledgePhotos"
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
                  name="acknowledgeFuel"
                  className="w-6 h-[21px] border border-black flex-shrink-0 mt-0.5"
                />
                <label className="text-black font-roboto text-sm font-normal leading-[15px]">
                  I declare that I will return the vans and keys on time with
                  {">"}75% fuel level. I understand that failure to do so results
                  in a deduction of my project's credit score.
                </label>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-[404px] mb-[30px] sm:w-full sm:mb-5">
              <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                TYPE Full Name AS A LEgally-binding ELECTRONIC SIGNATURE
              </label>
              <input
                type="text"
                name="signature"
                className="w-full h-[43px] px-4 py-2 rounded-[100px] border-2 border-black"
              />
            </div>
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