const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const generator = require("generate-password");

const User = require("../models/user.model");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");
const sendmail = require("../helpers/sendmail");

// Create a new user
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  // check user is already in database
  const userIdExist = await User.findOne({ userId: req.body.userId });
  if (userIdExist)
    return res.status(400).json({ message: "User ID already exist" });

  // check user is already in database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist)
    return res.status(400).json({ message: "email already exist" });

  // create random password
  const randomPassword = generator.generate({
    length: 8,
    numbes: true,
  });

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(randomPassword, salt);

  // create user
  const { name, userId, email, phone, department, role, address, avatar } =
    req.body;

  const user = new User({
    name,
    userId,
    email,
    phone,
    department,
    role,
    address,
    avatar,
    password: hashPassword,
  });

  const mailSubject = "Thông báo mật khẩu";
  const text = `Mật khẩu: ${randomPassword}`;

  try {
    await user.save();
    sendmail(email, mailSubject, text);

    res.status(201).json({ message: "Create user successfully" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// create many user
router.post("/list", authMiddleware, adminMiddleware, async (req, res) => {
  const userList = req.body;

  //   try {
  //   } catch (error) {
  //     res.status(400).json(error);
  //   }
});

// get all user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select(["-password"]);

    res.status(200).json({ code: 1, data: users });
  } catch (error) {
    res.status(400).json({ code: 0, message: error });
  }
});

// get user
router.get("/detail/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select([
      "-password",
    ]);
    res.status(200).json({ user });
  } catch (error) {
    res.status(101)
  }
});

//get profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id}).select([
      "-password",
    ]);
    res.status(200).json({ user });
  } catch (error) {
    res.send(error);
  }
})

// change password
router.put("/password", authMiddleware, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res.status(400).json({ message: "Password is wrong!!!" });

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.newPassword, salt);

  try {
    await User.findByIdAndUpdate({ _id: user._id }, { password: hashPassword });
    res.status(200).json({ message: "Change password successfully!!!" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// change init password
router.put("/init-password", authMiddleware, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });

  if (user.isPasswordChanged)
    return res
      .status(400)
      .json({ message: "Initial password already change!!!" });

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  try {
    await User.findByIdAndUpdate(
      { _id: user._id },
      { password: hashPassword, isPasswordChanged: true }
    );
    res.status(200).json({ message: "Change password successfully!!!" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// inactive user
router.put("/inactive", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await User.updateMany(
      { _id: { $in: req.body.ids } },
      { $set: { isActive: false } }
    );
    res.status(200).json({ message: "Update successfully!!!" });
  } catch (error) {
    res.status(400).json(error);
  }
});

// forgot password
router.post("/forgot-password", (req, res) => {});

module.exports = router;
