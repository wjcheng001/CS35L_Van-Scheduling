const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    bookingId: {
      type: String,
      required: true,
    },
    vanSerialNumber: {
      type: String,
      required: true,
    },
    returnDate: {
      type: Date,
      required: true,
    },
    pickupTime: {
      type: String,
    },
    returnTime: {
      type: String,
      required: true,
    },
    fuelLevel: {
      type: Number,
      min: 0,
      max: 100,
    },
    parkingLocation: {
      type: String,
      required: true,
    },
    notifiedKeyProblem: {
      type: Boolean,
      default: false,
    },
    hadAccident: {
      type: Boolean,
      default: false,
    },
    cleanedVan: {
      type: Boolean,
      default: false,
    },
    refueledVan: {
      type: Boolean,
      default: false,
    },
    experiencedProblem: {
      type: Boolean,
      default: false,
    },
    damageDescription: {
      type: String,
    },
    exteriorPhotoId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    interiorPhotoId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    dashboardPhotoId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    acceptResponsibility: {
      type: Boolean,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["RETURNED", "UNRETURNED"],
      default: "RETURNED",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Return", returnSchema);