import { createActivity, getActivities } from "../controller/activity.controller.js";
import { protect, admin } from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router()

router.route('/').post(protect, admin, createActivity).get(protect, admin, getActivities)

export default router