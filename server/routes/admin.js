const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const requireAuth = require("../middlewares/requireAuth");
const requireAdmin = require("../middlewares/requireAdmin");
const { GridFSBucket, ObjectId } = require("mongodb");
const router = express.Router();

router.get("/users", requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().lean();
    return res.json({ users });
  } catch (err) {
    console.error("Error in GET /users:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/role", requireAuth, async (req, res) => {
  try {
    const userEmail = req.session.user.email;
    const user = await User.findOne({ email: userEmail }).lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ user });
  } catch (err) {
    console.error("Error in GET /api/admin/role:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/review-user", requireAuth, requireAdmin, async (req, res) => {
  const { email, action } = req.body;
  if (!["approve", "reject"].includes(action)) {
    return res.status(400).json({ error: "Invalid action" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.status = action === "approve" ? "APPROVED" : "REJECTED";
    await user.save();
    return res.json({ message: `User ${action}d`, status: user.status });
  } catch (err) {
    console.error("Review error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/approve-user", requireAuth, requireAdmin, async (req, res) => {
  const { uid } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { uid },
      { $set: { status: "APPROVED" } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ message: "User approved successfully" });
  } catch (error) {
    console.error("User approval failed:", error);
    return res.status(500).json({ error: "Failed to approve user" });
  }
});

router.post("/reject-user", requireAuth, requireAdmin, async (req, res) => {
  const { uid } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { uid },
      { $set: { status: "REJECTED" } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ message: "User rejected successfully" });
  } catch (error) {
    console.error("User rejection failed:", error);
    return res.status(500).json({ error: "Failed to reject user" });
  }
});

router.get("/application/:uid", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ uid }).lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!user.driverApplication) {
      return res.status(404).json({ error: "No driver application found" });
    }
    return res.json({ user });
  } catch (err) {
    console.error("Error in GET /application/:uid:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/file/:fileId", requireAuth, requireAdmin, async (req, res) => {
  try {
    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "driverFiles" });
    const fileId = new ObjectId(req.params.fileId);
    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.on("file", (file) => {
      res.set("Content-Type", file.contentType);
      res.set("Content-Disposition", `inline; filename="${file.filename}"`);
    });
    downloadStream.pipe(res);
    downloadStream.on("error", () => res.status(404).json({ error: "File not found" }));
  } catch (err) {
    console.error("Error retrieving file:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;