import {
  activityUsersStatistics,
  activityAUserStatistics,
  exportFileExcel,
} from '../controller/statistical.controller.js'
import { protect, admin } from '../middlewares/authMiddleware.js'
import express from 'express'

const router = express.Router()

router.route('/').get(activityUsersStatistics)
router.route('/user/:user').get(activityAUserStatistics)
router.route('/export').get(exportFileExcel)

export default router
