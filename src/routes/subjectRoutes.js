import { protect, admin } from '../middlewares/authMiddleware.js'
import express from 'express'
import {
  createSubject,
  deleteSubject,
  getSubjects,
  updateSubject,
} from '../controller/subject.controller.js'

const router = express.Router()

router
  .route('/')
  .post(protect, admin, createSubject)
  .get(protect, admin, getSubjects)
router
  .route('/:id')
  .put(protect, admin, updateSubject)
  .delete(protect, admin, deleteSubject)

export default router
