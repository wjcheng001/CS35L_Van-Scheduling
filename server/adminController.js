// server/controllers/adminController.js
const mongoose = require('mongoose');

exports.approveUser = async (req, res) => {
  const { uid } = req.body;
  try {
    const User = mongoose.model('User');
    const user = await User.findOneAndUpdate(
      { uid },
      { $set: { status: "APPROVED" } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      message: "User approved successfully",
      user: {
        uid: user.uid,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error("User approval failed:", error);
    return res.status(400).json({ error: "Failed to approve user" });
  }
};
