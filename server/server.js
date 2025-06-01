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

const ADMIN_EMAILS = ['transportation@uclacsc.org', 'wanjun01@g.ucla.edu'];

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // set to frontend origin
  credentials: true, // allow cookies
}));

// MONGOOSE SETUP
/* ################## GROUP MEMBERS: COMMENT FROM HERE ############################ */
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
/* ################## GROUP MEMBERS: TO HERE ############################ */

// Add to any API that requires auth beforehand
const requireAuth = (req, res, next) => {
  if (!req.session.user) return res.status(401).json({ error: "Not logged in" });
  next();
};

const requireAdmin = (req, res, next) => {
  if (!ADMIN_EMAILS.includes(req.session.user.email)) return res.status(403).json({ error: "Unauthorized: Admin access required" });
  next();
}


/* ########################
   ###     AUTH API     ### 
   ######################## */

// app.post -> frontend upload data from backend
// app.get -> 

// Authenticate google login and establish session cookie
app.post("/api/auth/google", async (req, res) => {
  const { idToken } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: secrets.CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Validate email domain again server-side
    if (!payload.email.endsWith("@g.ucla.edu") && !ADMIN_EMAILS.includes(payload.email)) {
      return res.status(403).json({ error: "Unauthorized domain" });
    }

    // Set session
    req.session.user = {
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    };

    return res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
});

// Check if logged in (session is active)
app.get("/api/auth/session", (req, res) => {
  try {
    if (!req.session?.user) {
      return res.status(401).json({ error: "Not logged in" });
    }
    return res.json({ user: req.session.user });
  } catch (err) {
    console.error("Error in /api/auth/session:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Logout
app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out" });
  });
});

/* ########################
   ###      DB API      ###    
   ######################## */



/* 
Workflow for API calls

* data/get (get userData)
|\ 
| * auth/register (if no user)
|/
* auth/checkUser 
* auth/google (login)

*/


// TODO get info based on user gmail
// can view get via http://localhost:5173/api/data/get
// develop fxns in get, to test curl -X GET http://localhost:5173/api/data/get -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
app.get("/api/data/get", async (req, res) => {
  // query DB here
  return res.json({ message: "TODO" });
});

/* ############### NEW USER REGISTRATION ################### */

/* Verify if the login is from a new user */
// TODO: app.post("/api/auth/checkUser", requireAuth, async
app.post("/api/auth/checkUser", async (req, res) => {
  try {
    const email = req.session.user.email;
    const User = mongoose.model('User');

    // Query email in DB
    const user = await User.findOne({ email });

    if (user) {
      return res.json({
        exists: true
      });
    } else {
      return res.json({
        exists: false
      });
    }
  } catch (error) {
    console.error("Check user failed:", error);
    return res.status(500).json({ error: "Server error while checking user" });
  }
});

/* To register new users */
// TODO: app.get("/api/auth/register", requireAuth
app.get("/api/auth/register", async (req, res) => {
  const { uid } = req.query;
  try {
    // Validate UID
    if (!uid || !/^\d{9}$/.test(uid)) {
      return res.status(400).json({ error: "Invalid UID: Must be a 9-digit number" });
    }

    const email = req.session.user.email;
    const User = mongoose.model('User');

    // Query DB to check if UID already exists
    const exists = await User.exists({ uid });
    if (exists) {
      return res.status(400).json({ error: "UID already exists" });
    }

    // Determine role based on admin emails
    const isAdmin = ADMIN_EMAILS.includes(email);

    // Create new user
    const user = await User.create({
      uid: parseInt(uid),
      role: isAdmin ? 'admin' : 'user',
      email,
      approved: isAdmin ? true : false
    });

    // Update session with new user details
    req.session.user = {
      name: req.session.user.name,
      email: user.email,
      picture: req.session.user.picture,
      uid: user.uid,
      role: user.role,
      approved: user.approved
    };

    return res.json({
      message: "User registered successfully"
    });
  } catch (error) {
    console.error("User registration failed:", error);
    return res.status(400).json({ error: "Invalid UID or registration failed" });
  }
});

/* ############### APPROVED DRIVER APPLICATION ################### */

// Admin endpoint to approve user by UID
// app.post("/api/admin/approve-user", requireAuth, requireAdmin, async (req, res) => {
//   const { uid } = req.body;
//   try {
//     const User = mongoose.model('User');
//     const user = await User.findOneAndUpdate(
//       { uid },
//       { $set: { approved: true } },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     return res.json({
//       message: "User approved successfully",
//       user: {
//         uid: user.uid,
//         email: user.email,
//         role: user.role,
//         approved: user.approved
//       }
//     });
//   } catch (error) {
//     console.error("User approval failed:", error);
//     return res.status(400).json({ error: "Failed to approve user" });
//   }
// });

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
