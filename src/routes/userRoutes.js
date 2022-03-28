import {
  authAdmin,
  authStaff,
  getUsers,
} from '../controller/user.controller.js'
import { protect, admin } from '../middlewares/authMiddleware.js'
import express from 'express'

const router = express.Router()

router.route('/').get(protect, admin, getUsers)
router.route('/login').post(authAdmin)
router.route('/staff/login').post(authStaff)

export default router
