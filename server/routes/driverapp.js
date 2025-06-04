const express = require("express");
const User = require("../models/User");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();

router.get("/findpriorApp", requireAuth, async (req, res) => {
  try {
  const user = await User.findOne({ email: req.session.user.email }).lean();
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const hasDriverApplication = user.driverApplication != null && Object.keys(user.driverApplication).length > 0;
  return res.json({ hasDriverApplication });
} catch (err) {
  console.error("Error in /api/auth/session:", err);
  return res.status(500).json({ error: "Server error" });
}
});

router.post("/process", requireAuth, async (req, res) => {
  try {
    const {
      fullName,
      licenseNumber,
      licenseState,
      phoneNumber,
      project,
      licenseExpiry,
      dob,
      drivingPoints,
      dstDate,
    } = req.body;

    if (
      !fullName || !licenseNumber || !licenseState ||
      !phoneNumber || !project || !licenseExpiry ||
      !dob || !dstDate || drivingPoints == null
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const email = req.session.user.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Store the application
    user.driverApplication = {
      fullName,
      licenseNumber,
      licenseState,
      phoneNumber,
      project,
      licenseExpiry: new Date(licenseExpiry),
      dob: new Date(dob),
      drivingPoints: Number(drivingPoints),
      dstDate: new Date(dstDate),
      submittedAt: new Date(),
    };

    // Auto-approval logic
    const now = new Date();
    const expiryDate = new Date(licenseExpiry);
    const dstDateObj = new Date(dstDate);
    const monthsUntilExpiry = (expiryDate - now) / (1000 * 60 * 60 * 24 * 30);
    const dstWithin2Years = (now - dstDateObj) / (1000 * 60 * 60 * 24 * 365) <= 2;

    const isEligibleForAutoApproval =
      licenseState.toUpperCase() === "CA" &&
      monthsUntilExpiry > 4 &&
      Number(drivingPoints) === 0 &&
      dstWithin2Years;

    user.status = isEligibleForAutoApproval ? "APPROVED" : "PENDING";
    user.isAutoapproved = isEligibleForAutoApproval; // for audit

    await user.save();

    return res.status(200).json({
      message: isEligibleForAutoApproval
        ? "Auto-approved and submitted successfully"
        : "Submitted successfully. Pending manual approval",
    });
  } catch (err) {
    console.error("Error in /api/driverapp/store:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;