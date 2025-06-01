const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    pickupDate: {
      type: Date,
      required: true,
    },
    pickupTime: {
      type: String,
      required: true,
    },
    returnTime: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["RETURNED", "UNRETURNED"],
      default: "UNRETURNED",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Return", returnSchema);
