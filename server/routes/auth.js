const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const secrets = require("../secrets");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();
const client = new OAuth2Client(secrets.CLIENT_ID);
const ADMIN_EMAILS = ["transportation@uclacsc.org", "wanjun01@g.ucla.edu"];

// -----------------------------------------------------------
// Google OAuth Login → POST /api/auth/google
// -----------------------------------------------------------
router.post("/google", async (req, res) => {
  const { idToken } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: secrets.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Only allow UCLA or CSC admin emails
    if (
      !email.endsWith("@ucla.edu") &&
      !email.endsWith("@g.ucla.edu") &&
      !ADMIN_EMAILS.includes(email)
    ) {
      return res.status(403).json({ error: "Unauthorized domain" });
    }

    // Put basic info into session (so requireAuth will pass)
    req.session.user = {
      email,
      name,
      picture,
    };

    // Check DB for existing user
    let user = await User.findOne({ email });
    if (!user) {
      // First‐time login → create new User with status="NOT_SUBMITTED"
      user = await User.create({
        email,
        uid: 0, // placeholder until they register
        role: ADMIN_EMAILS.includes(email) ? "admin" : "user",
        status: "NOT_SUBMITTED",
      });
    }

    return res.json({
      message: "Login successful",
      status: user.status,
      isNewUser: user.uid === 0,
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
});

// -----------------------------------------------------------
// GET /api/auth/session → return { user } if logged in, else 401
// -----------------------------------------------------------
router.get("/session", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }
  return res.json({ user: req.session.user });
});

// -----------------------------------------------------------
// 5) GET /api/auth/status → return { status } for the logged-in user
// -----------------------------------------------------------
router.get("/status", requireAuth, async (req, res) => {
  try {
    const email = req.session.user.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ status: "NOT_SUBMITTED" });
    }
    console.log(user.status);
    return res.json({ status: user.status });
  } catch (err) {
    console.error("Error in /api/auth/status:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

// // -----------------------------------------------------------
// // POST /api/auth/register → user submits UID
// // -----------------------------------------------------------
// app.post("/register", requireAuth, async (req, res) => {
//   const { uid } = req.body;
//   if (!uid || !/^\d{9}$/.test(String(uid))) {
//     return res.status(400).json({ error: "Invalid UID" });
//   }
//   try {
//     const email = req.session.user.email;
//     const user = await User.findOne({ email });
//     if (!user || user.uid !== 0) {
//       return res
//         .status(400)
//         .json({ error: "Already applied or user missing" });
//     }
//     user.uid = Number(uid);

//     await user.save();
//     return res.json({ message: "UID Updated" });
//   } catch (err) {
//     console.error("Registration error:", err);
//     return res.status(500).json({ error: "Server error" });
//   }
// });