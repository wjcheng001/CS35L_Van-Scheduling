// models/Booking.js
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true
    },
    projectName: {
      type: String,
      required: true
    },
    pickupDate: {
      type: Date,
      required: true
    },
    pickupTime: {
      type: String,
      required: true
    },
    numberOfVans: {
      type: Number,
      required: true
    },
    returnDate: {
      type: Date,
      required: true
    },
    returnTime: {
      type: String,
      required: true
    },
    siteName: {
      type: String,
      required: true
    },
    siteAddress: {
      type: String,
      required: true
    },
    within75Miles: {
      type: Boolean,
      default: false
    },
    tripPurpose: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "REJECTED"],
      default: "PENDING"
    },
    vanId: {
      type: Number,
      required: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
