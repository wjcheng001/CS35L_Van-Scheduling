// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StatusBanner from "../components/StatusBanner";

// ------------ BookingCard -------------
function BookingCard({ booking }) {
  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    const m = d.getMonth() + 1;
    const day = d.getDate();
    return `${m}/${day}/${d.getFullYear()}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between h-full">
      {/* Top: Pickup & Return Date/Time */}
      <div className="mb-2">
        <div className="text-sm text-gray-700">
          <span className="font-semibold">Pickup:</span>{" "}
          {formatDate(booking.pickupDate)} @ {booking.pickupTime}
        </div>
        <div className="text-sm text-gray-700 mt-1">
          <span className="font-semibold">Return:</span>{" "}
          {formatDate(booking.returnDate)} @ {booking.returnTime}
        </div>
      </div>

      {/* Middle: Van ID, Project, Site, Address, Vans, Purpose */}
      <div className="text-sm text-gray-800 space-y-1">
        <div>
          Van ID: <strong>{booking.vanId}</strong>
        </div>
        <div>
          Project: <strong>{booking.projectName}</strong>
        </div>
        <div>
          Site: <strong>{booking.siteName}</strong>
        </div>
        <div>
          Address: <strong>{booking.siteAddress}</strong>
        </div>
        <div>
          Vans: <strong>{booking.numberOfVans}</strong>
        </div>
        <div>
          Purpose: <strong>{booking.tripPurpose}</strong>
        </div>
      </div>
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
  const [role, setRole] = useState(null);
  const [status, setStatus] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [returns, setReturns] = useState([]); // ← Declare `returns` state
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        // 1) Check session
        const sessionRes = await fetch("http://localhost:3000/api/auth/session", {
          credentials: "include",
        });
        if (!sessionRes.ok) {
          navigate("/login");
          return;
        }
        const sessionData = await sessionRes.json();
        setUser(sessionData.user);

        const roleRes = await fetch("http://localhost:3000/api/admin/role", {
          credentials: "include",
        });
        if (!roleRes.ok) {
          navigate("/");
          return;
        }
        const roleData = await roleRes.json();
        console.log(roleData);
        setRole(roleData.user.role);




        // 2) Fetch user.status
        const statusRes = await fetch("http://localhost:3000/api/auth/status", {
          credentials: "include",
        });
        if (!statusRes.ok) {
          console.error("Failed to get user status");
          navigate("/login");
          return;
        }
        const statusData = await statusRes.json();
        setStatus(statusData.status);

        // 3) Fetch bookings
        const bookingsRes = await fetch("http://localhost:3000/api/bookings/data", {
          credentials: "include",
        });
        if (bookingsRes.ok) {
          const bookingsJson = await bookingsRes.json();
          setBookings(bookingsJson.bookings || []);
        } else {
          console.error("Could not fetch bookings");
        }

        // 4) Fetch returns
        const returnsRes = await fetch("http://localhost:3000/api/returns", {
          credentials: "include",
        });
        if (returnsRes.ok) {
          const returnsJson = await returnsRes.json();
          setReturns(returnsJson.returns || []);
        } else {
          console.error("Could not fetch returns");
        }
      } catch (err) {
        console.error("Error in Dashboard.fetchData:", err);
        navigate("/login");
      }
    }

    fetchData();
  }, [navigate]);

  //  Show “Loading…” until `status` is non-null:
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
      {role === "admin" && (
        <div className="mt-4 ml-4 w-full flex items-center justify-center">
          <button
            onClick={() => navigate("/admin")}
            className="px-4 py-2 bg-[#5937e0] text-white rounded hover:bg-purple-700 mb-4"
          >
            Admin Mode
          </button>
        </div>
      )}

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome + subtitle */}
        <h1 className="text-4xl font-extrabold text-[#5937e0] mb-2">
          Welcome{user ? `, ${user.name}` : ""}!
        </h1>

        <p className="text-gray-500 mb-6">Here’s your driver application status.</p>

        {/* StatusBanner */}
        <div className="mb-8">
          <StatusBanner status={status} />
        </div>

        {/* My Bookings */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Booking</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-600">You haven’t made any bookings yet.</p>
        ) : (
          <div className="flex flex-wrap -mx-2 mb-8">
            {bookings.map((b) => (
              <div key={b._id} className="px-2 mb-6 w-full">
                <BookingCard booking={b} />
              </div>
            ))}
            <div className="px-2 w-full">
              <div className="text-center text-[#5937e0] font-semibold cursor-pointer hover:underline">
                See More
              </div>
            </div>
          </div>
        )}

        {/* Van Return Section */}
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
            <div className="px-2 w-full">
              <div className="text-center text-[#5937e0] font-semibold cursor-pointer hover:underline">
                See More
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
