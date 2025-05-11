const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const secrets = require('./secrets.js');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ✅ ROUTE: Test route that always works
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

// ✅ Start server early
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
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
    await User.insertMany(sample);
    console.log('Insertion successful');
  } catch (err) {
    console.error('Insert error:', err.message);
  } finally {
    mongoose.disconnect();
  }
});


// Email verification
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: secrets.GMAIL,
    pass: secrets.PASS
  }
});

app.post('/api/send-email', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const emailRegex = /^(.*@(ucla\.edu|g\.ucla\.edu|uclacsc\.org))$/; // Originally we locked out the transportation admin email!
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email must be from @ucla.edu or @g.ucla.edu domain' });
  }

  try {
    const info = await transporter.sendMail({
      from: '"CSC Van Scheduling" <your-email@gmail.com>',
      to: email,
      subject: 'Test Email from Backend',
      text: 'Hello! This is a test email sent from your Node.js backend.',
    });

    res.json({ message: 'Email sent!', info });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});