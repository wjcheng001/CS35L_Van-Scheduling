const mongoose = require("mongoose");

const driverApplicationSchema = new mongoose.Schema({
  fullName: { type: String },
  licenseNumber: { type: String },
  licenseState: { type: String },
  licenseExpiry: { type: Date },
  dob: { type: Date },
  phoneNumber: { type: String },
  project: { type: String },
  drivingPoints: { type: Number },
  dstDate: { type: Date },
  dmvFileId: { type: mongoose.Schema.Types.ObjectId },
  certificateFileId: { type: mongoose.Schema.Types.ObjectId },
});

const userSchema = new mongoose.Schema({
  uid: { type: Number, unique: true, required: true },
  name: { type: String, default: "" }, // name gets filled through driver application
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  status: {
    type: String,
    enum: ["NOT_SUBMITTED", "PENDING", "APPROVED", "REJECTED"],
    default: "NOT_SUBMITTED",
  },
  driverApplication: driverApplicationSchema,
  isAutoapproved: { type: Boolean, default: false },
  appReviewed: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);