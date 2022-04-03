import {
  authAdmin,
  authStaff,
  createUser,
  getUsers,
  updateUser,
  updateUserPassword,
} from '../controller/user.controller.js'
import { protect, admin } from '../middlewares/authMiddleware.js'
import express from 'express'

const router = express.Router()

router
  .route('/')
  .get(protect, admin, getUsers)
  .post(protect, admin, createUser)
  .put(protect, admin, updateUser)
router.route('/password').put(protect, updateUserPassword)
router.route('/login').post(authAdmin)
router.route('/staff/login').post(authStaff)

export default router
