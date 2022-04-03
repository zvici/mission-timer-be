import { createActivity } from "../controller/activity.controller.js";
import { protect, admin } from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router()

router.route('/').post(protect, admin, createActivity)

export default router