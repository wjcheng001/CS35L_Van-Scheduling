const express = require("express");
const User = require("../models/User");
const requireAuth = require("../middlewares/requireAuth");
const requireAdmin = require("../middlewares/requireAdmin");
const router = express.Router();


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
    const User = mongoose.model('User');
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