// models/User.js
const mongoose = require("mongoose");

const emailRegex = /^(.*@(ucla\.edu|g\.ucla\.edu|uclacsc\.org))$/;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value) => emailRegex.test(value),
        message: (props) =>
          `${props.value} is not a valid UCLA email address. Please use your UCLA email address.`,
      },
    },
    uid: {
      type: Number,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },
    status: {
      type: String,
      enum: ["NOT_SUBMITTED", "PENDING", "APPROVED", "REJECTED"],
      default: "NOT_SUBMITTED",
      required: true,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
