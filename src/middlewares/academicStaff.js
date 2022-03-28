module.exports = function (req, res, next) {
  if (req.user.role === "STAFF") {
    return res.status(403).json({ code: 403, message: "Fobidden" });
  }

  next();
};
