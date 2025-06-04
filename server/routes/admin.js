const express = require("express");
const User = require("../models/User");
const requireAuth = require("../middlewares/requireAuth");
const requireAdmin = require("../middlewares/requireAdmin");
const router = express.Router();

router.get("/users", requireAuth, requireAdmin, async (req, res) => {
  try {
    // Fetch all users from the database (excluding sensitive fields if needed)
    const users = await User.find().lean();
    return res.json({ users });
  } catch (err) {
    console.error("Error in GET /users:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/role", requireAuth, requireAdmin, async (req, res) => {
  try {
    // Get the logged‐in user’s email from session
    const userEmail = req.session.user.email;

    // Find exactly one User document (not an array)
    const user = await User.findOne({ email: userEmail }).lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user object (including `role`)
    return res.json({ user });
  } catch (err) {
    console.error("Error in GET /api/admin/role:", err);
    return res.status(500).json({ error: "Server error" });
  }
});



router.post("/review-user", requireAuth, requireAdmin, async (req, res) => {
  const { email, action } = req.body;
  if (!["approve", "reject"].includes(action)) {
    return res.status(400).json({ error: "Invalid action" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.status = action === "approve" ? "APPROVED" : "REJECTED";
    await user.save();
    return res.json({ message: `User ${action}d`, status: user.status });
  } catch (err) {
    console.error("Review error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/approve-user", requireAuth, requireAdmin, async (req, res) => {
  const { uid } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { uid },
      { $set: { status: "APPROVED" } },
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ message: "User approved successfully" });
  } catch (error) {
    console.error("User approval failed:", error);
    return res.status(500).json({ error: "Failed to approve user" });
  }
});

module.exports = router;