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


// AUTH
const authRoutes = require("./routes/auth");
const driverApplicationRoutes = require("./routes/driverapp");
const adminRoutes = require("./routes/admin");
const bookingRoutes = require("./routes/booking");

app.use("/api/auth", authRoutes);
app.use("/api/driverapp", driverApplicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);


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