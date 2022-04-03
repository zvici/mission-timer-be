import { createYear } from "../controller/year.controller.js";
import { protect, admin } from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router()

router.route('/').post(protect, admin, createYear)

export default router