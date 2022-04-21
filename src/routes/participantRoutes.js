import { protect, admin } from '../middlewares/authMiddleware.js'
import express from 'express'
import {
  deleteAParticipant,
  updateAnswerParticipants,
  udpateEvidence,
} from '../controller/participants.controller.js'
import upload from '../config/multer.js'
const router = express.Router()

router.route('/:id').delete(protect, admin, deleteAParticipant)
router.route('/answers/:id').put(protect, admin, updateAnswerParticipants)
router.route('/evidence').post(protect, upload.single('NAME'), udpateEvidence)

export default router
