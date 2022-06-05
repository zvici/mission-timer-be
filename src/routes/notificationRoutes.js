import { protect, admin } from '../middlewares/authMiddleware.js'
import express from 'express'
import {
  createNoti,
  getNotiMe,
  updateNotification,
  deleteNotification,
} from '../controller/notification.controller.js'

const router = express.Router()

router.route('/').post(protect, admin, createNoti)

router.route('/me').get(protect, getNotiMe)
router.route('/seen/:id').get(protect, updateNotification)
router.route('/:id').delete(protect, admin, deleteNotification)

export default router
