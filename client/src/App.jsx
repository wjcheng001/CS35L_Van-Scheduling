import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import VanReservation from "./pages/VanReserve";
import Dashboard from "./pages/Dashboard";
import VanReturn from "./pages/VanReturn";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import DriverApplication from "./pages/DriverApplication";
import { useNavigate } from "react-router-dom";
import ReservationSuccess from "./pages/ReserveSuccess";
import VanSchedule from "./pages/VanSchedule";
import Resource from "./pages/Resource"

function Login() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // 👈 加上这个

  return (
    <div className="login-container">
      {!user ? (
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            const decoded = jwtDecode(credentialResponse.credential);
            console.log("User info:", decoded);

            if (decoded.email && (decoded.email.endsWith("@g.ucla.edu") || decoded.email.endsWith("@uclacsc.org"))) {
              setUser(decoded);
              setError("");

              fetch("http://localhost:3000/api/auth/google", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ idToken: credentialResponse.credential }),
              })
                .then((res) => {
                  if (!res.ok) throw new Error("Failed to authenticate with backend");
                  return res.json();
                })
                .then((data) => {
                  console.log("Session established:", data);
                  if (data.isNewUser) {
                    navigate("/welcome");
                  } else {
                    navigate("/dashboard");
                  }
                })
                .catch((err) => {
                  console.error(err);
                  setError("Failed to login to backend");
                });
            } else {
              setError("Only @g.ucla.edu email addresses are allowed.");
            }
          }}
          onError={() => {
            console.log("Login Failed");
            setError("Google login failed");
          }}
        />
      ) : (
        <div className="user-info">
          <p>Welcome, {user.name}!</p>
          <img src={user.picture} alt="profile" className="profile-image" />
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reserve" element={<VanReservation />} />
        <Route path="/return" element={<VanReturn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/app" element={<DriverApplication />} />
        <Route path="/login" element={<Login />} />
        <Route path="/van-schedule" element={<VanSchedule />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/resources" element={<Resource />} />
        <Route path="/reservation-success" element={<ReservationSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
