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
} from '../controller/user.controller.js'
import { protect, admin } from '../middlewares/authMiddleware.js'
import express from 'express'
import upload from '../config/multer.js'

const router = express.Router()

router
  .route('/')
  .get(protect, admin, getUsers)
  .post(protect, admin, createUser)
  .put(protect, admin, updateUser)
router.route('/me').get(protect, getProfileMe)
router.route('/password').put(protect, updateUserPassword)
router.route('/login').post(authAdmin)
router.route('/staff/login').post(authStaff)
router.route('/updateprofile').put(protect, updateProfileUser)
router.route('/avatar').post(protect, upload.single('NAME'), updateAvatar)

export default router
