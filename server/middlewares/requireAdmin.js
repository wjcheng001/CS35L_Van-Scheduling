module.exports = (req, res, next) => {
  if (!req.session.user || !process.env.ADMIN_EMAILS.includes(req.session.user.email)) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};