import {
  createTask,
  getActivitiesDetailMe,
  updateTaskMe,
} from '../controller/task.controller.js'
import { protect, admin } from '../middlewares/authMiddleware.js'
import express from 'express'

const router = express.Router()

router.route('/').post(protect, admin, createTask)
router.route('/me').get(protect, getActivitiesDetailMe)
router.route('/me').put(protect, updateTaskMe)

export default router
