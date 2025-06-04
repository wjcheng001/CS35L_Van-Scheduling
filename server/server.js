require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const { OAuth2Client } = require("google-auth-library");
const User = require("./models/User");
const Booking = require("./models/Booking");
const Return = require("./models/Return"); // ← Import the Return model
const secrets = require("./secrets.js");
const Van = require("./models/Van");

// Middlewares
const requireAuth = require("./middlewares/requireAuth.js");
const requireAdmin = require("./middlewares/requireAdmin.js");


const ADMIN_EMAILS = ["transportation@uclacsc.org", "wanjun01@g.ucla.edu"];
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

const app = express();
const PORT = process.env.PORT || 3000;
const client = new OAuth2Client(secrets.CLIENT_ID);


app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  session({
    secret: "REPLACE_THIS_WITH_A_RANDOM_SECRET_STRING",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false, // true if using HTTPS in production
      sameSite: "lax",
    },
  })
);



const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);


// /* #############################
//   REGISTRATION & DASHBOARD APIs
// ############################# */

// -----------------------------------------------------------
// 6) POST /api/auth/register → user submits UID
// -----------------------------------------------------------
app.post("/api/auth/register", requireAuth, async (req, res) => {
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



// -----------------------------------------------------------
// 7) POST /api/admin/review-user → { email, action } to APPROVE or REJECT
// -----------------------------------------------------------
app.post("/api/admin/review-user", requireAuth, requireAdmin, async (req, res) => {
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

// -----------------------------------------------------------
// 8) POST /api/auth/logout → clear session
// -----------------------------------------------------------
app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

// -----------------------------------------------------------
// 9) GET /api/bookings → return user’s bookings
// -----------------------------------------------------------
app.get("/api/bookings", requireAuth, async (req, res) => {
  try {
    const userEmail = req.session.user.email;
    console.log(userEmail);
    // 1) Fetch all bookings for this user, newest first
    const bookings = await Booking.find({ userEmail })
      .sort({ createdAt: -1 })
      .lean();
    // 3) Return the array
    return res.json({ bookings });
  } catch (err) {
    console.error("Error in GET /api/bookings:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------------------------------------
// 10) NEW: GET /api/returns → return user’s “van returns”
// -----------------------------------------------------------
app.get("/api/returns", requireAuth, async (req, res) => {
  try {
    const userEmail = req.session.user.email;
    const returns = await Return.find({ userEmail }).sort({ pickupDate: -1 }).lean();
    return res.json({ returns });
  } catch (err) {
    console.error("Error in /api/returns:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------------------------------------
// 11) POST /api/bookings
// -----------------------------------------------------------
app.post("/api/bookings", requireAuth, async (req, res) => {
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
    //    We assume pickupDate is "YYYY-MM-DD" and pickupTime is "HH:mm" (24-hour).
    //    We append ":00" for seconds to make a valid ISO string.
    //
    const start = new Date(`${pickupDate}T${pickupTime}:00`);
    const end = new Date(`${returnDate}T${returnTime}:00`);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return res
        .status(400)
        .json({ error: "Invalid pickup/return date or time." });
    }

    // 4) Find a van whose existing busy intervals do NOT overlap [start, end)
    //
    //    Overlap logic: Two intervals [a, b) and [c, d) overlap
    //    if and only if (a < d) AND (c < b).
    //
    //    We want a van such that for every existing slot { s.start, s.end },
    //    NOT( s.start < end  AND  start < s.end ).
    //
    //    Equivalently, we can say: no element in busy satisfies (start < busy.end AND busy.start < end).
    //
    const freeVan = await Van.findOne({
      vanId: { $in: VAN_IDS },
      $nor: [
        {
          busy: {
            $elemMatch: {
              // busy.start < end
              start: { $lt: end },
              // busy.end > start  ⟸  ( start < busy.end )
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
      pickupDate: start,    // store as a Date
      pickupTime,           // store original time string if you need to display
      numberOfVans,
      returnDate: end,      // store as a Date
      returnTime,           // store original time string
      siteName,
      siteAddress,
      within75Miles,
      tripPurpose,
      vanId: freeVan.vanId, // server‐assigned
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

// -----------------------------------------------------------
// 12) /api/admin/approve-user
// -----------------------------------------------------------
app.post("/api/admin/approve-user", requireAuth, requireAdmin, async (req, res) => {
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

// -----------------------------------------------------------
// 13) Connect to MongoDB & start Express
// -----------------------------------------------------------

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/35ldb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    // ─── Ensure all 10 vans exist ─────────────────────────────────────────────
    for (const id of VAN_IDS) {
      const exists = await Van.findOne({ vanId: id });
      if (!exists) {
        await Van.create({ vanId: id, busy: [] });
      }
    }
    console.log("✅ Vans are initialized (hard‐coded).");

    // ─── Start Express ───────────────────────────────────────────────────────
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

/* #############################
          DRIVER APPROVAL APIs
############################# */

// -----------------------------------------------------------
// GET /api/auth/findpriorApp
// -----------------------------------------------------------
app.get("/api/auth/findpriorApp", requireAuth, async (req, res) => {
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

app.post("/api/driverapp/process", requireAuth, async (req, res) => {
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