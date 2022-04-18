import { protect, admin } from '../middlewares/authMiddleware.js'
import express from 'express'
import {
  createContent,
  getContents,
  updateContent,
} from '../controller/content.controller.js'

const router = express.Router()

router
  .route('/')
  .post(protect, admin, createContent)
  .get(protect, admin, getContents)
router
  .route('/:id')
  .put(protect, admin, updateContent)
  .delete(protect, admin, updateContent)

export default router
