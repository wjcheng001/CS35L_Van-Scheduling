import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import Home from "./pages/Home";

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
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
