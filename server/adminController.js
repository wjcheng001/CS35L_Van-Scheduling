
const User = require('../models/User'); //


exports.getAllApplications = async (req, res) => {
  try {
    const users = await User.find({ status: 'pending' });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


exports.approveUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.status = 'approved';
    await user.save();

    res.json({ message: 'User approved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
