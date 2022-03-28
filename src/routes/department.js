const express = require("express");
const router = express.Router();

const Department = require("../models/department.model");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");

// Create new department
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  const department = new Department(req.body);

  try {
    await department.save();
    res.status(201).json({ message: "Create department successfully!!!" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// Get all departments
router.get("/", authMiddleware, async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json({ data: departments });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

module.exports = router;
