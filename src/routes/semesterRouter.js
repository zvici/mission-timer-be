import {
  createSemester,
  getSemesters,
  deleteSemester,
  updateSemester,
} from '../controller/semester.controller.js'
import { protect, admin } from '../middlewares/authMiddleware.js'
import express from 'express'

const router = express.Router()

router
  .route('/:id')
  .delete(protect, admin, deleteSemester)
  .put(protect, admin, updateSemester)
router.route('/').post(protect, admin, createSemester).get(protect, getSemesters)

export default router
