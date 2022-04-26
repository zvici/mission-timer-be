import { protect, admin } from '../middlewares/authMiddleware.js'
import express from 'express'
import {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} from '../controller/department.controller.js'

const router = express.Router()

router
  .route('/')
  .post(protect, admin, createDepartment)
  .get(protect, admin, getDepartments)
router
  .route('/:id')
  .put(protect, admin, updateDepartment)
  .delete(protect, admin, deleteDepartment)

export default router
