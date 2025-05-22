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

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // set to frontend origin
  credentials: true, // allow cookies
}));

// Session middleware (simple example)
app.use(session({
  secret: "7D#1d9!f$8@K3m@E*Zp9Df&L3xVmQ@Y#", // hide later
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false, // set to true in production with HTTPS
    sameSite: "Lax",
  }
}));

app.post("/api/auth/google", async (req, res) => {
  const { idToken } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: secrets.CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Validate email domain again server-side
    if (!payload.email.endsWith("@g.ucla.edu")) {
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

// ROUTE: Test route that always works
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});



// === MONGOOSE SETUP ===
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
    }
  }, { versionKey: false });

  const User = mongoose.model('User', userSchema);

  // Sample data insertion
  const sample = [
    { uid: 123456789, role: 'admin', email: '123@g.ucla.edu' },
    { uid: 987654321, role: 'user', email: '987@g.ucla.edu' },
    { uid: 110000000, role: 'user', email: '110@g.ucla.edu' }
  ];

  try {
    for (const user of sample) {
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
  } finally {
    mongoose.disconnect();
  }
});