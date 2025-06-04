const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();
const Return = require("../models/Return")

router.get("/returns", requireAuth, async (req, res) => {
  try {
    const userEmail = req.session.user.email;
    const returns = await Return.find({ userEmail }).sort({ pickupDate: -1 }).lean();
    return res.json({ returns });
  } catch (err) {
    console.error("Error in /api/returns:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;