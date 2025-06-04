const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const requireAuth = require("../middlewares/requireAuth");
const multer = require("multer");
const { GridFSBucket, ObjectId } = require("mongodb");
const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images and PDFs are allowed."));
    }
  },
});

// GET /api/driverapp/findpriorApp
router.get("/findpriorApp", requireAuth, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.session.user.email }).lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hasDriverApplication = user.driverApplication != null && Object.keys(user.driverApplication).length > 0;
    return res.json({ hasDriverApplication });
  } catch (err) {
    console.error("Error in /api/driverapp/findpriorApp:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /api/driverapp/process
router.post(
  "/process",
  requireAuth,
  upload.fields([
    { name: "dmvFile", maxCount: 1 },
    { name: "certificateFile", maxCount: 1 },
  ]),
  async (req, res) => {
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

      // Validate text fields
      if (
        !fullName ||
        !licenseNumber ||
        !licenseState ||
        !phoneNumber ||
        !project ||
        !licenseExpiry ||
        !dob ||
        !dstDate ||
        drivingPoints == null
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check admin status and fetch user
      const user = await User.findOne({ email: req.session.user.email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const isAdmin = user.role === "admin";

      // Validate file uploads for non-admins
      if (!isAdmin) {
        if (!req.files || !req.files.dmvFile || !req.files.certificateFile) {
          return res.status(400).json({ error: "DMV Pull and UCLA Worksafe Certificate files are required for non-admins" });
        }
      }

      // Initialize GridFSBucket using Mongoose connection
      const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "driverFiles" });

      let dmvFileId = null;
      let certificateFileId = null;

      // Upload DMV file to GridFS if provided
      if (req.files?.dmvFile) {
        const dmvFile = req.files.dmvFile[0];
        const uploadStream = bucket.openUploadStream(dmvFile.originalname, {
          contentType: dmvFile.mimetype,
        });
        uploadStream.write(dmvFile.buffer);
        uploadStream.end();
        dmvFileId = uploadStream.id;

        await new Promise((resolve, reject) => {
          uploadStream.on("finish", resolve);
          uploadStream.on("error", reject);
        });
      }

      // Upload certificate file to GridFS if provided
      if (req.files?.certificateFile) {
        const certificateFile = req.files.certificateFile[0];
        const uploadStream = bucket.openUploadStream(certificateFile.originalname, {
          contentType: certificateFile.mimetype,
        });
        uploadStream.write(certificateFile.buffer);
        uploadStream.end();
        certificateFileId = uploadStream.id;

        await new Promise((resolve, reject) => {
          uploadStream.on("finish", resolve);
          uploadStream.on("error", reject);
        });
      }

      // Store the application
      user.name = fullName;

      user.driverApplication = {
        licenseNumber,
        licenseState,
        phoneNumber,
        project,
        licenseExpiry: new Date(licenseExpiry),
        dob: new Date(dob),
        drivingPoints: Number(drivingPoints),
        dstDate: new Date(dstDate),
        submittedAt: new Date(),
        dmvFileId: dmvFileId ? new ObjectId(dmvFileId) : null,
        certificateFileId: certificateFileId ? new ObjectId(certificateFileId) : null,
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
      user.isAutoapproved = isEligibleForAutoApproval;

      await user.save();

      return res.status(200).json({
        message: isEligibleForAutoApproval
          ? "Auto-approved and submitted successfully"
          : "Submitted successfully. Pending manual approval",
      });
    } catch (err) {
      console.error("Error in /api/driverapp/process:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;