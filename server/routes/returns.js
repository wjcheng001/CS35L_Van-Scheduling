const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFSBucket } = require("mongodb");
const requireAuth = require("../middlewares/requireAuth");
const Return = require("../models/Return");
const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// POST /api/returns/submit
router.post(
  "/submit",
  requireAuth,
  upload.fields([
    { name: "exteriorPhoto", maxCount: 1 },
    { name: "interiorPhoto", maxCount: 1 },
    { name: "dashboardPhoto", maxCount: 1 },
  ]),
  async (req, res) => {
    try {

      // Validate session
      if (!req.session.user || !req.session.user.email || !req.session.user.role) {
        console.log("Invalid session data:", req.session.user); // Keep this for error cases
        return res.status(401).json({ error: "Unauthorized: Invalid session" });
      }

      const {
        bookingId,
        projectName,
        vanSerialNumber,
        returnDate,
        returnTime,
        fuelLevel,
        parkingLocation,
        notifiedKeyProblem,
        hadAccident,
        cleanedVan,
        refueled,
        experiencedProblem,
        damageDescription,
        acceptResponsibility,
      } = req.body;

      // Validate required fields
      if (
        !bookingId ||
        !projectName ||
        !vanSerialNumber ||
        !returnDate ||
        !returnTime ||
        !parkingLocation ||
        acceptResponsibility === undefined
      ) {
        console.log("Missing required fields:", {
          bookingId,
          projectName,
          vanSerialNumber,
          returnDate,
          returnTime,
          parkingLocation,
          acceptResponsibility,
        });
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Validate photos for non-admins
      const isAdmin = req.session.user.role === "admin";
      if (!isAdmin && (!req.files?.exteriorPhoto || !req.files?.interiorPhoto || !req.files?.dashboardPhoto)) {
        console.log("Photos missing for non-admin:", req.files);
        return res.status(400).json({ error: "All photos are required for non-admin users" });
      }

      // Initialize GridFS bucket
      const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: "returnFiles",
      });

      // Upload files safely
      const uploadFile = (file, filename) => {
        return new Promise((resolve, reject) => {
          if (!file || !file.length) return resolve(null);
          const uploadStream = bucket.openUploadStream(filename);
          uploadStream.end(file[0].buffer, (error) => {
            if (error) return reject(error);
            resolve(uploadStream.id);
          });
        });
      };

      const exteriorPhotoId = await uploadFile(
        req.files?.exteriorPhoto,
        `exterior_${bookingId}_${Date.now()}`
      );
      const interiorPhotoId = await uploadFile(
        req.files?.interiorPhoto,
        `interior_${bookingId}_${Date.now()}`
      );
      const dashboardPhotoId = await uploadFile(
        req.files?.dashboardPhoto,
        `dashboard_${bookingId}_${Date.now()}`
      );

      // Create return document
      const vanReturn = new Return({
        userEmail: req.session.user.email,
        bookingId,
        vanSerialNumber,
        returnDate: new Date(returnDate),
        returnTime,
        fuelLevel: fuelLevel ? Number(fuelLevel) : null,
        parkingLocation,
        notifiedKeyProblem: notifiedKeyProblem === "true",
        hadAccident: hadAccident === "true",
        cleanedVan: cleanedVan === "true",
        refueledVan: refueled === "true",
        experiencedProblem: experiencedProblem === "true",
        damageDescription: damageDescription || "",
        exteriorPhotoId,
        interiorPhotoId,
        dashboardPhotoId,
        acceptResponsibility: acceptResponsibility === "true",
        projectName,
        status: "RETURNED",
      });

      await vanReturn.save();
      return res.json({ message: "Van return submitted successfully" });
    } catch (error) {
      console.error("Error in /api/returns/submit:", error.message, error.stack);
      return res.status(500).json({ error: "Failed to submit van return" });
    }
  }
);

// GET /api/returns
router.get("/returns", requireAuth, async (req, res) => {
  try {
    const userEmail = req.session.user.email;
    const returns = await Return.find({ userEmail }).sort({ returnDate: -1 }).lean();
    return res.json({ returns });
  } catch (err) {
    console.error("Error in /api/returns:", err.message, err.stack);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;