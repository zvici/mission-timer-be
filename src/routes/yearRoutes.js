import {
  createYear,
  deleteYear,
  getYears,
  updateYear,
} from '../controller/year.controller.js'
import { protect, admin } from '../middlewares/authMiddleware.js'
import express from 'express'

const router = express.Router()

router.route('/:id').delete(protect, admin, deleteYear).put(protect, admin, updateYear)
router.route('/').post(protect, admin, createYear).get(protect, getYears)

export default router
