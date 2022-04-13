import {
  createActivity,
  getActivities,
  updateActivity,
} from '../controller/activity.controller.js'
import { protect, admin } from '../middlewares/authMiddleware.js'
import express from 'express'

const router = express.Router()

router
  .route('/')
  .post(protect, admin, createActivity)
  .get(protect, admin, getActivities)
router.route('/:fillter').get(protect, admin, getActivities)
router.route('/:id').put(protect, admin, updateActivity)

export default router
