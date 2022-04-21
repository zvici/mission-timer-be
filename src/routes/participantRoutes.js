import { protect, admin } from '../middlewares/authMiddleware.js'
import express from 'express'
import {
  deleteAParticipant,
  updateAnswerParticipants,
} from '../controller/participants.controller.js'
const router = express.Router()

router.route('/:id').delete(protect, admin, deleteAParticipant)
router.route('/answers/:id').put(protect, admin, updateAnswerParticipants)

export default router
