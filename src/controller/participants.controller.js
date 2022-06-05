import asyncHandler from 'express-async-handler'
import Participants from '../models/participants.model.js'
import errorRespone from '../utils/errorRespone.js'
import uploads from '../config/cloudinary.config.js'
import removeEmpty from '../utils/removeEmpty.js'
import User from '../models/user.model.js'
import Task from '../models/task.model.js'

// @desc   get a participant
// @route  GET /api/participant
// @access ADMIN

const getParticipants = asyncHandler(async (req, res) => {
  try {
    const { task } = req.query
    const queryFind = { task }
    // get list participants by task
    const participants = await Participants.find(removeEmpty(queryFind))
      .populate('user', 'name userId')
      .populate('task')
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name')
    return res.json({
      code: 1,
      msg: 'success',
      message: 'Danh sách người tham gia',
      data: {
        participants,
      },
    })
  } catch (err) {
    return errorRespone(res, 400, 0, 'error', err)
  }
})

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
    const { status, reason, image } = req.body
    // check id participants exist
    const isParticipantExist = await Participants.findById(
      req.params.id
    ).populate({
      path: 'task',
      select: 'officeHours semester',
      populate: {
        path: 'activity',
        select: 'type',
      },
    })
    if (!isParticipantExist) {
      return errorRespone(
        res,
        404,
        0,
        'error',
        'Không tìm thấy người tham gia này!'
      )
    }
    if (isParticipantExist.task.activity.type !== 'STAFF') {
      return errorRespone(res, 403, 0, 'error', 'Không được phép!')
    }
    if (req.user._id.toString() !== isParticipantExist.user.toString()) {
      return errorRespone(res, 403, 0, 'error', 'Không được phép!')
    }
    // If you refuse, there must be a reason
    if (status === 'refuse') {
      if (!reason) {
        return errorRespone(res, 401, 0, 'error', 'Từ chối phải có lý do!')
      }
      isParticipantExist.reason = reason
    }
    // when completed, must have proof
    if (status === 'done') {
      if (!image) {
        return errorRespone(
          res,
          401,
          0,
          'error',
          'Hoàn thành phải có minh chứng!'
        )
      }
      isParticipantExist.image = image
    }
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

// @desc   push image evidence
// @route  POST /api/participant/evidence/:id
// @access STAFF
const udpateEvidence = asyncHandler(async (req, res) => {
  try {
    const uploader = async (path) => await uploads(path, 'Evidences')
    const newPath = await uploader(req.file.path)
    const participant = await Participants.findById(req.params.id)
    participant.image = newPath.url
    await participant.save()
    res.status(200).json({
      code: 1,
      msg: 'success',
      message: 'Cập nhật hình thành công',
      data: participant,
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

// @desc   app
// @route  PUT /api/participant/approve/:id
// @access ADMIN
const updateApprove = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body
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

    isParticipantExist.status = status
    isParticipantExist.updatedBy = req.user._id
    isParticipantExist.confirmBy = req.user._id
    await isParticipantExist.save()
    res.status(200).json({
      code: 1,
      msg: 'success',
      message: 'Đã cập nhật',
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

// @desc   app
// @route  POST /api/participant/approve/:id
// @access STAFF
const createParticipant = asyncHandler(async (req, res) => {
  try {
    const { task, user } = req.body
    // Check task exist
    const isTaskExist = await Task.findById(task)
    if (!isTaskExist) {
      return errorRespone(res, 404, 0, 'error', 'Không tìm công việc này!')
    }
    // Check user exist
    const isUserExist = await User.findById(user)
    if (!isUserExist) {
      return errorRespone(
        res,
        404,
        0,
        'error',
        'Không tìm thấy người dùng này!'
      )
    }

    const isParticipantExist = await Participants.findOne({
      user: user,
      task: task,
    })
    if (isParticipantExist) {
      return errorRespone(
        res,
        404,
        0,
        'error',
        'Người này đã có trong công việc này!'
      )
    }
    const newParticiant = new Participants({
      user: user,
      task: task,
      createdBy: req.user._id,
    })
    await newParticiant.save()
    res.status(200).json({
      code: 1,
      msg: 'success',
      message: 'Đã thêm người dùng vào công việc',
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

export {
  deleteAParticipant,
  updateAnswerParticipants,
  udpateEvidence,
  getParticipants,
  updateApprove,
  createParticipant,
}
