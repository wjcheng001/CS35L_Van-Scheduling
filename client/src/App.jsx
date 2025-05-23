import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import DashboardScreen from "./pages/DashboardScreen";

function Login() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  return (
    <div className="login-container">
      {!user ? (
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            const decoded = jwtDecode(credentialResponse.credential);
            console.log("User info:", decoded);

            if (decoded.email && decoded.email.endsWith("@g.ucla.edu")) {
              setUser(decoded);
              setError("");
              fetch("http://localhost:3000/api/auth/google", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include", // Important if your backend sets an httpOnly cookie
                body: JSON.stringify({ idToken: credentialResponse.credential }),
              }).then((res) => {
                if (!res.ok) {
                  throw new Error("Failed to authenticate with backend");
                }
                return res.json();
              }).then(data => {
                console.log("Session established:", data);
                // Optionally store a sessionID (only if not using httpOnly cookies)
              }).catch((err) => {
                console.error(err);
                setError("Failed to login to backend");
              });
            } else {
              setError("Only @g.ucla.edu email addresses are allowed.");
            }
          }}
          onError={() => {
            console.log("Login Failed");
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
    <Route path="/dashboard" element={<DashboardScreen />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
</BrowserRouter>
  );
}

export default App;
