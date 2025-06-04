import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/driver-application.css";

const AdminDriverAppReview = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/admin/application/${uid}`, {
          credentials: "include",
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to fetch application");
        }
        const data = await res.json();
        setApplication(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [uid]);

  const handleApprove = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/admin/approve-user", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: Number(uid) }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to approve user");
      }
      alert("User approved successfully");
      navigate("/admin");
    } catch (err) {
      alert("Error approving user: " + err.message);
    }
  };

  const handleReject = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/admin/reject-user", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: Number(uid) }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to reject user");
      }
      alert("User rejected successfully");
      navigate("/admin");
    } catch (err) {
      alert("Error rejecting user: " + err.message);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-grow flex justify-center items-center">
          <p className="text-red-600 text-xl">{error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  const app = application?.driverApplication || {};

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex flex-col items-center px-[72px] py-10 w-full md:px-10 sm:px-5 sm:py-5">
        <h1 className="w-full max-w-[1097px] text-[#5937E0] font-work-sans text-[50px] font-bold leading-normal mb-5 md:text-[40px] sm:text-[28px] sm:mb-4">
          Driver Application Review
        </h1>
        <p className="w-full max-w-[1114px] text-black font-work-sans text-xl font-normal leading-normal mb-10 md:text-lg sm:text-base sm:mb-[30px]">
          Reviewing application for {application?.name} (UID: {uid})
        </p>

        <div className="w-full max-w-[1114px] border-[3px] border-[#EBEAED] rounded-[10px] p-10 md:p-[30px] sm:p-5">
          <div className="flex flex-col gap-[30px] sm:gap-5">
            {/* First Row */}
            <div className="flex flex-wrap gap-5 sm:gap-4">
              <div className="flex flex-col gap-2 w-[404px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  Full Name
                </label>
                <div className="w-full h-[43px] px-4 py-2 rounded-[100px] border-2 border-black bg-gray-100">
                  {app.fullName || "-"}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-[254px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  Driver's License Number
                </label>
                <div className="w-full h-[43px] px-4 py-2 rounded-[100px] border-2 border-black bg-gray-100">
                  {app.licenseNumber || "-"}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-[234px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  Driver's License STATE
                </label>
                <div className="w-full h-[43px] px-4 py-2 rounded-[100px] border-2 border-black bg-gray-100">
                  {app.licenseState || "-"}
                </div>
              </div>
            </div>

            {/* Second Row */}
            <div className="flex flex-wrap gap-5 sm:gap-4">
              <div className="flex flex-col gap-2 w-[313px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  Phone number
                </label>
                <div className="w-full h-[43px] px-4 py-2 rounded-[100px] border-2 border-black bg-gray-100">
                  {app.phoneNumber || "-"}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-[333px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  Project(s) you will be driving for
                </label>
                <div className="w-full h-[43px] px-4 py-2 rounded-[100px] border-2 border-black bg-gray-100">
                  {app.project || "-"}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-[254px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  License Expiry Date (MM/DD/YYYY)
                </label>
                <div className="w-full h-[43px] px-4 py-2 rounded-[100px] border-2 border-black bg-gray-100">
                  {formatDate(app.licenseExpiry) || "-"}
                </div>
              </div>
            </div>

            {/* Third Row */}
            <div className="flex flex-wrap gap-5 sm:gap-4">
              <div className="flex flex-col gap-2 w-[313px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  Date of birth (MM/DD/YYYY)
                </label>
                <div className="w-full h-[43px] px-4 py-2 rounded-[100px] border-2 border-black bg-gray-100">
                  {formatDate(app.dob) || "-"}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-[234px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  Number of points on driving record
                </label>
                <div className="w-full h-[43px] px-4 py-2 rounded-[100px] border-2 border-black bg-gray-100">
                  {app.drivingPoints ?? "-"}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-[295px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  Driver safety training Date (MM/DD/YYYY)
                </label>
                <div className="w-full h-[43px] px-4 py-2 rounded-[100px] border-2 border-black bg-gray-100">
                  {formatDate(app.dstDate) || "-"}
                </div>
              </div>
            </div>

            {/* File Section */}
            <div className="flex flex-wrap gap-5 sm:gap-4">
              <div className="flex flex-col gap-2 w-[482px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  DMV Pull
                </label>
                <div className="w-full h-[179px] px-4 py-2 rounded-[39px] border-2 border-black bg-gray-100 flex items-center justify-center">
                  {app.dmvFileId ? (
                    <a
                      href={`http://localhost:3000/api/admin/file/${app.dmvFileId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:bg-blue-100 transition-colors"
                    >
                      View DMV Pull File
                    </a>
                  ) : (
                    <span className="text-black font-roboto text-sm">No file uploaded</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 w-[462px] md:w-[calc(50%-10px)] sm:w-full">
                <label className="text-black font-work-sans text-sm font-bold leading-[26px] uppercase">
                  UCLA Worksafe Driver safety training Certificate
                </label>
                <div className="w-full h-[179px] px-4 py-2 rounded-[39px] border-2 border-black bg-gray-100 flex items-center justify-center">
                  {app.certificateFileId ? (
                    <a
                      href={`http://localhost:3000/api/admin/file/${app.certificateFileId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:bg-blue-100 transition-colors"
                    >
                      View Certificate File
                    </a>
                  ) : (
                    <span className="text-black font-roboto text-sm">No file uploaded</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 sm:justify-center">
              <button
                onClick={handleApprove}
                className="text-white font-dm-sans text-xl font-bold leading-[26px] uppercase w-[248px] h-[83px] rounded-[47px] border-2 border-green-600 bg-green-600 cursor-pointer sm:text-lg sm:w-[200px] sm:h-[60px] sm:rounded-[30px] hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={handleReject}
                className="text-white font-dm-sans text-xl font-bold leading-[26px] uppercase w-[248px] h-[83px] rounded-[47px] border-2 border-red-600 bg-red-600 cursor-pointer sm:text-lg sm:w-[200px] sm:h-[60px] sm:rounded-[30px] hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDriverAppReview;