const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { GridFSBucket } = require("mongodb");
const requireAuth = require("../middlewares/requireAuth");
const Return = require("../models/Return");
const Booking = require("../models/Booking");
const Van = require("../models/Van");
const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
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
      const {
        bookingId,
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

      // Validate session
      if (!req.session.user || !req.session.user.email || !req.session.user.role) {
        return res.status(401).json({ error: "Unauthorized: Invalid session" });
      }

      // Validate required fields
      if (
        !bookingId ||
        !returnDate ||
        !returnTime ||
        !parkingLocation ||
        acceptResponsibility === undefined
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Validate booking
      const userEmail = req.session.user.email;
      const booking = await Booking.findOne({ _id: bookingId, userEmail, status: "CONFIRMED" });
      if (!booking) {
        return res.status(400).json({ error: "Invalid or unconfirmed booking" });
      }

      // Check for existing return
      const existingReturn = await Return.findOne({ bookingId, userEmail });
      if (existingReturn) {
        return res.status(400).json({ error: "Return already submitted for this booking" });
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
        userEmail,
        bookingId,
        vanSerialNumber: booking.vanId.toString(),
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
        projectName: booking.projectName,
        status: "RETURNED",
      });

      await vanReturn.save();

      // Update booking status to COMPLETED
      await Booking.updateOne({ _id: bookingId }, { status: "COMPLETED" });

      // Update Van busy schedule to remove the booking's time slot
      const van = await Van.findOne({ vanId: booking.vanId });
      if (van) {
        van.busy = van.busy.filter(
          (slot) => !(slot.start.getTime() === booking.pickupDate.getTime() && slot.end.getTime() === booking.returnDate.getTime())
        );
        await van.save();
      }

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
    const returns = await Return.find({ userEmail }).sort({ createdAt: -1 }).lean();
    return res.json({ returns });
  } catch (err) {
    console.error("Error in /api/returns:", err.message, err.stack);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;