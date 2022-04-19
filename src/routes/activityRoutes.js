import {
  createActivity,
  getActivities,
  updateActivity,
  deleteActivity,
  getActivitiesByYear,
} from '../controller/activity.controller.js'
import { protect, admin } from '../middlewares/authMiddleware.js'
import express from 'express'

const router = express.Router()

router
  .route('/')
  .post(protect, admin, createActivity)
  .get(protect, getActivities)
router.route('/year/:year').get(protect, getActivitiesByYear)
router
  .route('/:id')
  .put(protect, admin, updateActivity)
  .delete(protect, admin, deleteActivity)

export default router
