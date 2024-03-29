import {
  authAdmin,
  authStaff,
  createUser,
  getUsers,
  updateUser,
  updateUserPassword,
  updateProfileUser,
  getProfileMe,
  updateAvatar,
  forgotPassword,
  checkOtp,
  changePassWithOTP,
  blockUser,
} from '../controller/user.controller.js'
import { protect, admin } from '../middlewares/authMiddleware.js'
import express from 'express'
import upload from '../config/multer.js'

const router = express.Router()

router.route('/').get(protect, admin, getUsers).post(protect, admin, createUser)
router.route('/me').get(protect, getProfileMe)
router.route('/password').put(protect, updateUserPassword)
router.route('/password/forgot-password').post(forgotPassword)
router.route('/password/check-otp').post(checkOtp)
router.route('/password/change-pass-otp').post(changePassWithOTP)
router.route('/login').post(authAdmin)
router.route('/staff/login').post(authStaff)
router.route('/updateprofile').put(protect, updateProfileUser)
router.route('/avatar').post(protect, upload.single('NAME'), updateAvatar)
router.route('/:id').put(protect, admin, updateUser)
router.route('/block/:id').put(protect, admin, blockUser)
export default router
