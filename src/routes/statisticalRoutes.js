import { activityUsersStatistics } from '../controller/statistical.controller.js'
import { protect, admin } from '../middlewares/authMiddleware.js'
import express from 'express'

const router = express.Router()

router.route('/').get(activityUsersStatistics)

export default router
