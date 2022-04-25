import {
  createTask,
  getTasksMe,
  updateTask,
  getTasks,
} from '../controller/task.controller.js'
import { protect, admin } from '../middlewares/authMiddleware.js'
import express from 'express'

const router = express.Router()

router.route('/').post(protect, createTask).get(protect, admin, getTasks)
router.route('/me').get(protect, getTasksMe)
router.route('/:id').put(protect, updateTask)

export default router
