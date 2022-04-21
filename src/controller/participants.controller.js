import asyncHandler from 'express-async-handler'
import Comment from '../models/comment.model.js'
import Participants from '../models/participants.model.js'
import errorRespone from '../utils/errorRespone.js'

// @desc   delete a participant
// @route  DELETE /api/participant/:id
// @access STAFF

const deleteAParticipant = asyncHandler(async (req, res) => {
  try {
    // check id participants exist
    const isParticipantExist = await Participants.findById(req.params.id)
    if (!isParticipantExist) {
      return errorRespone(
        res,
        404,
        0,
        'error',
        'Không tìm thấy người tham gia này!'
      )
    }
    // delete a participant from the participants
    await Participants.deleteOne({ _id: req.params.id })
    return res.json({
      code: 1,
      msg: 'success',
      message: 'Đã xóa người tham gia này này',
    })
  } catch (err) {
    return errorRespone(res, 400, 0, 'error', err)
  }
})

// @desc   update answers
// @route  PUT /api/participant/answers/:id
// @access STAFF

const updateAnswerParticipants = asyncHandler(async (req, res) => {
  try {
    const { status, content } = req.body
    // check id participants exist
    const isParticipantExist = await Participants.findById(req.params.id)
    if (!isParticipantExist) {
      return errorRespone(
        res,
        404,
        0,
        'error',
        'Không tìm thấy người tham gia này!'
      )
    }
    // check permission
    if (req.user._id.toString() !== isParticipantExist.user.toString()) {
      return errorRespone(res, 403, 0, 'error', 'Không được phép!')
    }
    // If you refuse, there must be a reason
    if (status === 'refuse') {
      const newComent = await new Comment.save({
        participant: isParticipantExist.toString(),
        user: req.user._id,
        content,
      })
      await newComent.save()
    }
    // update participant
    isParticipantExist.status = status
    await isParticipantExist.save()
    return res.send({
      code: 1,
      msg: 'success',
      message: 'Đã cập nhật!',
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

export { deleteAParticipant, updateAnswerParticipants }
