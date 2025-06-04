const ADMIN_EMAILS = ["transportation@uclacsc.org", "wanjun01@g.ucla.edu", "celinee@g.ucla.edu"];

module.exports = (req, res, next) => {
  if (!req.session.user || !ADMIN_EMAILS.includes(req.session.user.email)) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};