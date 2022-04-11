import {
  createActivityDetail,
  getActivitiesDetailMe,
} from '../controller/activityDetail.controller.js'
import { protect, admin } from '../middlewares/authMiddleware.js'
import express from 'express'

const router = express.Router()

router.route('/').post(protect, admin, createActivityDetail)
router.route('/me').get(protect, getActivitiesDetailMe)

export default router
