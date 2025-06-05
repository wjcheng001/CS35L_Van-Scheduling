const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const requireAuth = require("../middlewares/requireAuth");

const CLIENT_ID = process.env.CLIENT_ID;
const ADMIN_EMAILS = process.env.ADMIN_EMAILS;

const router = express.Router();
const client = new OAuth2Client(CLIENT_ID);

router.post("/google", async (req, res) => {
  const { idToken } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID,
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

    let user = await User.findOne({ email });
    if (!user) { // First time login
      user = await User.create({
        email,
        uid: 0,
        role: ADMIN_EMAILS.includes(email) ? "admin" : "user",
        status: "NOT_SUBMITTED",
      });
    }

    // Include role in session
    req.session.user = {
      email,
      name,
      picture,
      role: user.role, // Add role to session
    };

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

router.get("/session", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not logged in" });
  }
  return res.json({ user: req.session.user });
});

router.get("/status", requireAuth, async (req, res) => {
  try {
    const email = req.session.user.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ status: "NOT_SUBMITTED" });
    }
    return res.json({ status: user.status });
  } catch (err) {
    console.error("Error in /api/auth/status:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/register", requireAuth, async (req, res) => {
  const { uid } = req.body;
  if (!uid || !/^\d{9}$/.test(String(uid))) {
    return res.status(400).json({ error: "Invalid UID" });
  }
  try {
    const email = req.session.user.email;
    const user = await User.findOne({ email });
    if (!user || user.uid !== 0) {
      return res
        .status(400)
        .json({ error: "Already applied or user missing" });
    }
    user.uid = Number(uid);

    await user.save();
    return res.json({ message: "UID Updated" });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/logout", requireAuth, (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

module.exports = router;