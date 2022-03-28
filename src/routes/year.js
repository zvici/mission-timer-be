const express = require("express");
const router = express.Router();

const Year = require("../models/year.model");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");
const createDate = require("../helpers/createDate");

// Create year
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  // check year already exist in
  const year = req.body.startDate.split("-")[2];
  const existYear = await Year.findOne({ name: { $regex: `^${year}` } });

  if (existYear) {
    return res.status(400).json({ message: "This year already exist" });
  }

  // add new year to database
  const newYear = new Year({
    name: `${year}-${Number(year) + 1}`,
    startDate: createDate(req.body.startDate),
    endDate: req.body.endDate && createDate(req.body.endDate),
    description: req.body.description,
  });

  try {
    await newYear.save();
    res.status(201).json({ message: "Create year successfully!!!" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// Get year
router.get("/", authMiddleware, async (req, res) => {
  try {
    const years = await Year.find().sort([['startDate', -1]]);
    res.status(200).json({ data: years });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

module.exports = router;
