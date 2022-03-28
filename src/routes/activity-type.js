const express = require("express");
const router = express.Router();

const ActivityType = require("../models/ActivityType");

// create activity type
router.post("/", async (req, res) => {
  const { name, estimatedTime, rollUp, description } = req.body;

  const activityType = new ActivityType({
    name,
    estimatedTime,
    rollUp,
    description,
  });

  try {
    await activityType.save();
    res.status(201).json({ message: "Tạo loại hoạt động thành công!!!" });
  } catch (error) {
    res.status(400).json(error);
  }
});

//get all activity type
router.get("/", async (req, res) => {});

module.exports = router;
