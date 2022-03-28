module.exports = function (req, res, next) {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ code: 403, message: "Fobidden" });
  }

  next();
};
