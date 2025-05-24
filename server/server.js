const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const { OAuth2Client } = require("google-auth-library");
const session = require("express-session"); 
const mongoose = require('mongoose');
const secrets = require('./secrets.js');

const app = express();
const PORT = 3000;
const client = new OAuth2Client(secrets.CLIENT_ID); 

// List of admin emails
const ADMIN_EMAILS = [
  'transportation@uclacsc.org'
  // TODO: replace with other admins after deployment
  // To devs: Add your email if you wish to test admin functions
];

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // set to frontend origin
  credentials: true, // allow cookies
}));

// Session middleware
app.use(session({
  secret: "REDACTED", // hide later
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false, // set to true in production with HTTPS
    sameSite: "Lax",
  }
}));

// MONGOOSE SETUP
mongoose.connect('mongodb://localhost:27017/35ldb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  // SCHEMA
  const userSchema = new mongoose.Schema({
    uid: {
      type: Number,
      validate: {
        validator: num => /^\d{9}$/.test(num),
        message: props => `Invalid uid ${props.value}`
      },
      required: true,
      unique: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      required: true
    },
    email: {
      type: String,
      required: true
    },
    approved: {
      type: Boolean,
      required: true,
      default: false
    }
  }, { versionKey: false });

  const User = mongoose.model('User', userSchema);

  // Hardcoded admin insertions
  const adminUsers = [
    { uid: 888888888, role: 'admin', email: 'transportation@uclacsc.org', approved: true }, // true UID REDACTED
    // Devs: Add your info if you wish to test admin functions
  ];

  // Sample data insertion (non-admins)
  const sampleUsers = [
    { uid: 987654321, role: 'user', email: '987@g.ucla.edu', approved: false },
    { uid: 110000000, role: 'user', email: '110@g.ucla.edu', approved: false }
  ];

  try {
    // Insert admins
    for (const admin of adminUsers) {
      const exists = await User.exists({ uid: admin.uid });
      if (!exists) {
        await User.create(admin);
        console.log(`Inserted admin with UID: ${admin.uid}`);
      } else {
        console.log(`Admin with UID: ${admin.uid} already exists.`);
      }
    }

    // Insert sample users
    for (const user of sampleUsers) {
      const exists = await User.exists({ uid: user.uid });
      if (!exists) {
        await User.create(user);
        console.log(`Inserted user with UID: ${user.uid}`);
      } else {
        console.log(`User with UID: ${user.uid} already exists.`);
      }
    }
    console.log('Insertion process completed.');
  } catch (err) {
    console.error('Insert error:', err.message);
  }
});

// Google OAuth login
app.post("/api/auth/google", async (req, res) => {
  const { idToken } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: secrets.CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Validate email domain, with exception for admin emails
    if (!payload.email.endsWith("@g.ucla.edu") && !ADMIN_EMAILS.includes(payload.email)) {
      return res.status(403).json({ error: "Unauthorized domain" });
    }

    // Query database for user by email
    const User = mongoose.model('User');
    const user = await User.findOne({ email: payload.email });

    // If user doesn't exist, prompt for UID entry
    if (!user) {
      // Check if email is in admin list
      const isAdmin = ADMIN_EMAILS.includes(payload.email);
      return res.status(200).json({ 
        message: "New user detected",
        isNewUser: true,
        isAdmin: isAdmin,
        user: {
          name: payload.name,
          email: payload.email,
          picture: payload.picture
        }
      });
    }

    // Set session with user data including approved status
    req.session.user = {
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
      role: user.role,
      uid: user.uid,
      approved: user.approved
    };

    return res.json({ 
      message: "Login successful",
      isNewUser: false,
      user: {
        name: payload.name,
        email: payload.email,
        role: user.role,
        uid: user.uid,
        approved: user.approved
      }
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
});

// Register new user with UID
app.post("/api/auth/register", async (req, res) => {
  const { uid, email } = req.body;
  try {
    const User = mongoose.model('User');
    const exists = await User.exists({ uid });
    if (exists) {
      return res.status(400).json({ error: "UID already exists" });
    }
    const isAdmin = ADMIN_EMAILS.includes(email);
    const user = await User.create({
      uid,
      role: isAdmin ? 'admin' : 'user',
      email,
      approved: isAdmin ? true : false
    });
    req.session.user = { 
      name: req.session.user?.name || 'Unknown',
      email: user.email,
      picture: req.session.user?.picture,
      uid: user.uid,
      role: user.role,
      approved: user.approved
    };
    return res.json({ 
      message: "User registered successfully",
      user: {
        name: req.session.user.name,
        email: user.email,
        role: user.role,
        uid: user.uid,
        approved: user.approved
      }
    });
  } catch (error) {
    console.error("User registration failed:", error);
    return res.status(400).json({ error: "Invalid UID or registration failed" });
  }
});

// Admin endpoint to approve user by UID
app.post("/api/admin/approve-user", async (req, res) => {
  const { uid } = req.body;
  try {
    // Check if requester is admin
    if (!req.session.user || req.session.user.role !== 'admin') {
      return res.status(403).json({ error: "Unauthorized: Admin access required" });
    }

    const User = mongoose.model('User');
    const user = await User.findOneAndUpdate(
      { uid },
      { $set: { approved: true } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      message: "User approved successfully",
      user: {
        uid: user.uid,
        email: user.email,
        role: user.role,
        approved: user.approved
      }
    });
  } catch (error) {
    console.error("User approval failed:", error);
    return res.status(400).json({ error: "Failed to approve user" });
  }
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});