const express = require("express");
const router = express.Router();

const Subject = require("../models/subject.model");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");

// Create new subject
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  const subject = new Subject(req.body);
  console.log("hihi");
  try {
    await subject.save();
    res.status(201).json({ message: "Create subject successfully!!!" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// Get all subjects
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json({ data: subjects });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

module.exports = router;
