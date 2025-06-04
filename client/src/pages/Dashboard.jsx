import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StatusBanner from "../components/StatusBanner";
import AdminApproveButton from "../components/AdminApproveButton";
import axios from "axios";

// ------------ BookingCard -------------
function BookingCard({ booking, onCancel, onPickup }) {
  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    const m = d.getMonth() + 1;
    const day = d.getDate();
    return `${m}/${day}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 relative flex flex-col justify-between h-full">
      {/* Top: Date / Time */}
      <div>
        <div className="flex justify-between text-sm text-gray-700 mb-1">
          <span>
            Date: <strong>{formatDate(booking.pickupDate)}</strong>
          </span>
          <span>
            Time: {booking.pickupTime} – {booking.returnTime}
          </span>
        </div>
        <div className="text-sm text-gray-800 mb-2">
          Project: <strong>{booking.projectName}</strong>
        </div>
      </div>

      {/* Middle: Status Icon + Text */}
      <div className="flex flex-col items-center my-2">
        {booking.status === "CONFIRMED" && (
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/3c9479d61a58507a038f8a8c8367f19f0603dacc?placeholderIfAbsent=true"
            alt="Confirmed"
            className="w-8 h-8 mb-1"
          />
        )}
        {booking.status === "PENDING" && (
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d7f404513c5b4ecd820ac0e15307fc7aa3fb72d7?placeholderIfAbsent=true"
            alt="Pending"
            className="w-8 h-8 mb-1"
          />
        )}
        {booking.status === "REJECTED" && (
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d7f404513c5b4ecd820ac0e15307fc7aa3fb72d7?placeholderIfAbsent=true"
            alt="Rejected"
            className="w-8 h-8 mb-1"
          />
        )}
        <div className="mt-1 text-sm font-semibold text-gray-900">
          {booking.status === "CONFIRMED" && "Confirmed"}
          {booking.status === "PENDING" && "Pending"}
          {booking.status === "REJECTED" && "Rejected"}
        </div>
      </div>

      {/* Bottom: Action Buttons (only if CONFIRMED) */}
      {booking.status === "CONFIRMED" && (
        <div className="mt-3 flex space-x-2">
          <button
            onClick={() => onCancel(booking._id)}
            className="flex-1 py-1.5 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600"
          >
            Cancel
          </button>
          <button
            onClick={() => onPickup(booking._id)}
            className="flex-1 py-1.5 bg-blue-500 text-white rounded-md text-sm font-semibold hover:bg-blue-600"
          >
            Pick Up
          </button>
        </div>
      )}
    </div>
  );
}

// ------------ ReturnCard -------------
function ReturnCard({ ret }) {
  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    const m = d.getMonth() + 1;
    const day = d.getDate();
    return `${m}/${day}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 relative">
      <div className="flex justify-between text-sm text-gray-700 mb-1">
        <span>
          Date: <strong>{formatDate(ret.pickupDate)}</strong>
        </span>
        <span>
          Time: {ret.pickupTime} – {ret.returnTime}
        </span>
      </div>
      <div className="text-sm text-gray-800 mb-2">
        Project: <strong>{ret.projectName}</strong>
      </div>
      <img
        src={
          ret.status === "RETURNED"
            ? "https://cdn.builder.io/api/v1/image/assets/TEMP/5810b8128163adcb949aa5b42230d12340fd3869?placeholderIfAbsent=true"
            : "https://cdn.builder.io/api/v1/image/assets/TEMP/d7f404513c5b4ecd820ac0e15307fc7aa3fb72d7?placeholderIfAbsent=true"
        }
        alt={ret.status}
        className="w-8 h-8 absolute top-4 right-4"
      />
      <div className="mt-2 text-sm font-semibold text-gray-900">
        {ret.status === "RETURNED" ? "Returned" : "Unreturned"}
      </div>
    </div>
  );
}

// ------------ Dashboard Component ------------
export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [returns, setReturns] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const sessionRes = await fetch("http://localhost:3000/api/auth/session", { credentials: "include" });
        if (!sessionRes.ok) return navigate("/login");
        const sessionData = await sessionRes.json();
        setUser(sessionData.user);

        const statusRes = await fetch("http://localhost:3000/api/auth/status", { credentials: "include" });
        if (!statusRes.ok) return navigate("/login");
        const statusData = await statusRes.json();
        setStatus(statusData.status);

        const bookingsRes = await fetch("http://localhost:3000/api/bookings", { credentials: "include" });
        if (bookingsRes.ok) {
          const bookingsJson = await bookingsRes.json();
          setBookings(bookingsJson.bookings || []);
        }

        const returnsRes = await fetch("http://localhost:3000/api/returns", { credentials: "include" });
        if (returnsRes.ok) {
          const returnsJson = await returnsRes.json();
          setReturns(returnsJson.returns || []);
        }

        const pendingRes = await fetch("http://localhost:3000/api/admin/pending-users", { credentials: "include" });
        if (pendingRes.ok) {
          const users = await pendingRes.json();
          setPendingUsers(users);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        navigate("/login");
      }
    }
    fetchData();
  }, [navigate]);

  const handleApprove = async (uid) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/admin/approve-user",
        { uid },
        { withCredentials: true }
      );
      alert(res.data.message);
      setPendingUsers(pendingUsers.filter((u) => u.uid !== uid));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to approve user");
    }
  };

  const handleReject = async (uid) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/admin/reject-user",
        { uid },
        { withCredentials: true }
      );
      alert(res.data.message);
      setPendingUsers(pendingUsers.filter((u) => u.uid !== uid));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to reject user");
    }
  };

  if (status === null) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow max-w-5xl mx-auto p-8">
          <h2 className="text-center text-xl text-gray-600">Loading...</h2>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-extrabold text-purple-600 mb-2">
          Welcome{user ? `, ${user.name}` : ""}!
        </h1>
        <p className="text-gray-500 mb-6">Here’s your driver application status.</p>

        <div className="mb-8">
          <StatusBanner status={status} />
        </div>

        {/* Admin Tools */}
        {user?.role === "admin" && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Tools</h2>
            <AdminApproveButton />

            <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-2">Pending Users</h3>
            <ul className="space-y-2">
              {pendingUsers.map((u) => (
                <li key={u.uid} className="border rounded p-3 flex justify-between items-center">
                  <span>{u.email} ({u.uid})</span>
                  <div className="space-x-2">
                    <button onClick={() => handleApprove(u.uid)} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Approve</button>
                    <button onClick={() => handleReject(u.uid)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Reject</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bookings */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-600">You haven’t made any bookings yet.</p>
        ) : (
          <div className="flex flex-wrap -mx-2 mb-8">
            {bookings.map((b) => (
              <div key={b._id} className="px-2 mb-6 w-full md:w-1/2 lg:w-1/3">
                <BookingCard booking={b} onCancel={() => {}} onPickup={() => {}} />
              </div>
            ))}
          </div>
        )}

        {/* Van Return */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Van Return</h2>
        {returns.length === 0 ? (
          <p className="text-gray-600">No van returns to display.</p>
        ) : (
          <div className="flex flex-wrap -mx-2">
            {returns.map((ret) => (
              <div key={ret._id} className="px-2 mb-4 w-full md:w-1/2 lg:w-1/3">
                <ReturnCard ret={ret} />
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
