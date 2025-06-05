const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();
const Booking = require("../models/Booking");
const User = require("../models/User");
const Van = require("../models/Van");

const VAN_IDS = [
  4116,
  4367,
  4597,
  405006,
  405007,
  405014,
  405331,
  405332,
  405333,
  405437,
];

router.get("/data", requireAuth, async (req, res) => {
  try {
    const userEmail = req.session.user.email;
    // Fetch all bookings for this user, newest first
    const bookings = await Booking.find({ userEmail })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ bookings });
  } catch (err) {
    console.error("Error in GET /api/bookings:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/data", requireAuth, async (req, res) => {
  try {
    const {
      projectName,
      pickupDate,     // e.g. "2025-09-01"
      pickupTime,     // e.g. "09:30" (24-hour format)
      numberOfVans,   // coming in as string or number
      returnDate,     // e.g. "2025-09-01"
      returnTime,     // e.g. "17:00"
      siteName,
      siteAddress,
      within75Miles,  // coming in as string ("true"/"false") or boolean
      tripPurpose,
    } = req.body;

    // ─── 1) VALIDATE REQUIRED FIELDS ──────────────────────────────────────────

    // Coerce numberOfVans and within75Miles first
    const vansCount = Number(numberOfVans);
    const outsideRange = within75Miles === true || within75Miles === "true";

    // Check that every required field is present and in the right “shape”
    if (
      !projectName ||
      !pickupDate ||
      !pickupTime ||
      isNaN(vansCount) ||        // must convert to a number successfully
      !returnDate ||
      !returnTime ||
      !siteName ||
      !siteAddress ||
      typeof tripPurpose !== "string" ||
      tripPurpose.trim() === ""
    ) {
      return res
        .status(400)
        .json({ error: "Missing required booking fields." });
    }

    // 2) Check that the user’s account is APPROVED
    const userEmail = req.session.user.email;
    const user = await User.findOne({ email: userEmail });
    if (!user || user.status !== "APPROVED") {
      return res
        .status(403)
        .json({ error: "Your account is not approved to book a van." });
    }

    // 3) Build JS Date objects for the full start/end datetime
    const start = new Date(`${pickupDate}T${pickupTime}:00`);
    const end = new Date(`${returnDate}T${returnTime}:00`);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return res
        .status(400)
        .json({ error: "Invalid pickup/return date or time." });
    }

    // 4) Find a van whose existing busy intervals do NOT overlap [start, end)
    const freeVan = await Van.findOne({
      vanId: { $in: VAN_IDS },
      $nor: [
        {
          busy: {
            $elemMatch: {
              start: { $lt: end },
              end: { $gt: start },
            }
          }
        }
      ]
    });

    if (!freeVan) {
      return res
        .status(400)
        .json({ error: "All vans are busy at the requested time interval." });
    }

    // 5) Create the Booking with the chosen vanId
    const newBooking = await Booking.create({
      userEmail,
      projectName,
      pickupDate: start,
      pickupTime,
      numberOfVans,
      returnDate: end,
      returnTime,
      siteName,
      siteAddress,
      within75Miles,
      tripPurpose,
      vanId: freeVan.vanId,
      status: "CONFIRMED", // Auto-confirm since a free van was found
    });

    // 6) Mark that van’s busy interval by pushing { start, end }
    freeVan.busy.push({ start, end });
    await freeVan.save();

    // 7) Return success + the new booking
    return res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (err) {
    console.error("Error in POST /api/bookings:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;