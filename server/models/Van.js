// models/Van.js
const mongoose = require("mongoose");

const busySlotSchema = new mongoose.Schema({
  // The full Date/time when the van is picked up
  start: {
    type: Date,
    required: true
  },
  // The full Date/time when the van is returned
  end: {
    type: Date,
    required: true
  }
}, { _id: false });

const vanSchema = new mongoose.Schema({
  vanId: {
    type: Number,
    required: true,
    unique: true
  },
  // Each entry now has { start: Date, end: Date }
  busy: {
    type: [busySlotSchema],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model("Van", vanSchema);
