const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

// LOGIN
router.post("/login", async (req, res) => {
  // check user is already in db
  const user = await User.findOne({ userId: req.body.userId });
  if (!user)
    return res
      .status(400)
      .json({ code: 102, message: "Sai tài khoản hoặc mật khẩu!" });

  // check user is active
  if (!user.isActive)
    return res.status(400).json({ code: 103, message: "Tài khoản bị khoá" });

  if (user.role !== "ADMIN" && user.role !== "ACADEMIC_STAFF")
    return res.status(400).json({ code: 104, message: "Tài khoản không hợp lệ" });

  //  password
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res
      .status(400)
      .json({ code: 102, message: "Sai tài khoản hoặc mật khẩu!" });

  // create and assign a token
  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.TOKEN_SECRET
  );
  res.status(200).json({
    code: 1,
    message: "Đăng nhập thành công!",
    data: { token },
  });
});

//Login for staff
router.post("/staff/login", async (req, res) => {
  // check user is already in db
  try {
    const user = await User.findOne({ userId: req.body.userId });
    if (!user)
      return res
        .status(400)
        .json({ code: 102, message: "Sai tài khoản hoặc mật khẩu!" });

    // check user is active
    if (!user.isActive)
      return res.status(400).json({ code: 103, message: "Tài khoản bị khoá" });

    if (user.role !== "STAFF")
      return res.status(400).json({ code: 104, message: "Tài khoản không hợp lệ" });

    //  password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass)
      return res
        .status(400)
        .json({ code: 102, message: "Sai tài khoản hoặc mật khẩu!" });

    // create and assign a token
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.TOKEN_SECRET
    );
    res.status(200).json({
      code: 1,
      message: "Đăng nhập thành công!",
      data: { token },
    });
  } catch (error) {
    res.status(400);
  }
});

module.exports = router;
