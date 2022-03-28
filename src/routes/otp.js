const express = require("express");
const router = express.Router();
const otpGenerator = require("otp-generator");

const User = require("../models/user.model");
const Otp = require("../models/otp.model");
const addMinutesToDate = require("../helpers/addMinutesToDate");
const sendmail = require("../helpers/sendmail");

router.post("/", async (req, res) => {
  const existEmail = await User.findOne({ email: req.body.email });

  if (!existEmail)
    return res.status(400).json({ message: "Email is no exist!!!" });

  const otpStr = otpGenerator.generate(6, {
    upperCaseAlphabets: true,
    specialChars: false,
  });
  const now = new Date();
  const expirationTime = addMinutesToDate(now, 5);

  const otp = new Otp({
    email: req.body.email,
    otp: otpStr,
    expirationTime,
  });

  const subjectMail = "Thông báo mã OTP";
  const text = `OTP: ${otpStr}`;

  try {
    await otp.save();
    sendmail(req.body.email, subjectMail, text);

    res.status(200).json({ message: "Get OTP successfully!!!" });
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
