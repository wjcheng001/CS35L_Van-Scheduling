import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AdminPage = () => {
  const [user, setUser] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUid, setSearchUid] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const sessionRes = await fetch("http://localhost:3000/api/admin/role", {
          credentials: "include",
        });

        if (!sessionRes.ok) {
          navigate("/login");
          return;
        }

        const sessionData = await sessionRes.json();
        setUser(sessionData.user);

        if (sessionData.user.role !== "admin") {
          console.error("Permission denied—user is not an admin");
          navigate("/dashboard");
          return;
        }

        setLoading(true);
        const usersRes = await fetch("http://localhost:3000/api/admin/users", {
          credentials: "include",
        });

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData.users || []);
        }
      } catch (err) {
        console.error("Error in admin page:", err);
      } finally {
        setLoading(false);
      }
    }

    checkAdminStatus();
  }, [navigate]);

  const handleApprove = async (uid, appReviewed) => {
    try {
      if (!appReviewed) {
        const proceed = window.confirm("This user's application has not been reviewed. Do you want to proceed?");
        if (!proceed) return;
      }
      const res = await fetch("http://localhost:3000/api/admin/approve-user", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Approve failed:", err);
        return;
      }

      const usersRes = await fetch("http://localhost:3000/api/admin/users", {
        credentials: "include",
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }
    } catch (err) {
      console.error("Error approving user:", err);
    }
  };

  const handleReject = async (uid, appReviewed) => {
    try {
      if (!appReviewed) {
        const proceed = window.confirm("This user's application has not been reviewed. Do you want to proceed?");
        if (!proceed) return;
      }
      const res = await fetch("http://localhost:3000/api/admin/reject-user", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Reject failed:", err);
        return;
      }

      const usersRes = await fetch("http://localhost:3000/api/admin/users", {
        credentials: "include",
      });
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }
    } catch (err) {
      console.error("Error rejecting user:", err);
    }
  };

  const handleSearchUidChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]{0,9}$/.test(value)) {
      setSearchUid(value);
      setError("");
    } else {
      setError("UID must be exactly 9 numerical digits.");
    }
  };

  const handleSearch = () => {
    if (searchUid.trim().length === 9) {
      navigate(`/review/${searchUid}`);
    } else {
      alert("Please enter a valid 9-digit UID.");
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const renderAdminVerified = (user) => {
    if (user.status === "APPROVED") {
      if (user.isAutoapproved) {
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 text-pink-800">
            auto-approved
          </span>
        );
      } else {
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
            Verified
          </span>
        );
      }
    } else {
      return (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            user.status === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : user.status === "REJECTED"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {user.status || "NONE"}
        </span>
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow px-[72px] py-10 md:px-10 sm:px-5 sm:py-5">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[#5937E0] text-[50px] font-work-sans font-bold md:text-[40px] sm:text-[28px]">
            Admin Panel
          </h1>
          <button
            onClick={handleBackToDashboard}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        <p className="text-black text-xl font-normal mb-10 md:text-lg sm:text-base sm:mb-[30px]">
          Manage users and applications. Review and approve driver applications.
        </p>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Search Application by UID</h2>
          <div className="flex gap-4">
            <div className="flex flex-col">
              <input
                type="text"
                value={searchUid}
                onChange={handleSearchUidChange}
                placeholder="Enter 9-digit UID"
                className="w-[300px] h-[43px] px-4 py-2 rounded-[100px] border-2 border-black"
                pattern="[0-9]{0,9}"
              />
              {error && (
                <div className="text-red-600 text-sm mt-2">{error}</div>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-[#5937E0] text-white rounded-md hover:bg-[#4b2db3] transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Pending Applications</h2>

            {users.filter(u => u.status === "PENDING").length === 0 ? (
              <p className="text-gray-600">No pending applications.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="pl-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Verified</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.filter(u => u.status === "PENDING").map((user) => (
                      <tr key={user.uid}>
                        <td className="pl-10 px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.uid}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {renderAdminVerified(user)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            PENDING
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleApprove(user.uid, user.appReviewed)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(user.uid, user.appReviewed)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">All Users</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="pl-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Verified</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.uid}>
                      <td className="pl-10 px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.uid}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {renderAdminVerified(user)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : user.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : user.status === "REJECTED"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.status || "NONE"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AdminPage;