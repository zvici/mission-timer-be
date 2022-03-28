const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const bearer = req.header("Authorization");
  if (!bearer) return res.status(401).json({ code: 401, message: "Unauthorized" });
  const token = bearer.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ code: 401, message: "Unauthorized" });
  }
};
