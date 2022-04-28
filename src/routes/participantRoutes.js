import { protect, admin } from '../middlewares/authMiddleware.js'
import express from 'express'
import {
  deleteAParticipant,
  updateAnswerParticipants,
  udpateEvidence,
  getParticipants,
  updateApprove,
  createParticipant,
} from '../controller/participants.controller.js'
import upload from '../config/multer.js'
const router = express.Router()

router.route('/:id').delete(protect, admin, deleteAParticipant)
router.route('/answers/:id').put(protect, updateAnswerParticipants)
router.route('/evidence').post(protect, upload.single('NAME'), udpateEvidence)
router
  .route('/')
  .get(protect, admin, getParticipants)
  .post(protect, admin, createParticipant)
router.route('/approve/:id').put(protect, admin, updateApprove)
export default router
