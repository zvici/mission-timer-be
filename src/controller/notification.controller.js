import asyncHandler from 'express-async-handler'
import Notification from '../models/notification.model.js'
import User from '../models/user.model.js'
import errorRespone from '../utils/errorRespone.js'

// @desc   Create one notification
// @route  POST /api/notification
// @access Ministry

const createNoti = asyncHandler(async (req, res) => {
  try {
    const { title, data, content, seen, user } = req.body
    // check department exist
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
    const notification = await new Notification({
      title,
      content,
      seen,
      user,
      createdBy: req.user._id,
    })
    const newNotification = await notification.save()
    res.send({
      code: 1,
      msg: 'success',
      message: 'Đã tạo thông báo!',
      data: {
        notification: newNotification,
      },
    })
  } catch (err) {
    return errorRespone(res, 400, 0, 'error', err)
  }
})

// @desc   get list notification me
// @route  GET /api/notification/me
// @access Staff
const getNotiMe = asyncHandler(async (req, res) => {
  try {
    const listNotiMe = await Notification.find({
      user: req.user._id,
    })
    res.send({
      code: 1,
      msg: 'success',
      message: 'Danh sách thông báo',
      data: {
        notifications: listNotiMe,
      },
    })
  } catch (err) {
    return errorRespone(res, 400, 0, 'error', err)
  }
})

// @desc   update one
// @route  PUT /api/notification/seen
// @access Staff
const updateNotification = asyncHandler(async (req, res) => {
  try {
    // check notification exist
    const isNotificaitonExist = await Notification.findById(req.params.id)
    if (!isNotificaitonExist) {
      return errorRespone(res, 404, 0, 'error', 'Không tìm thấy thông báo này!')
    }
    if (isNotificaitonExist.user.toString() !== req.user._id) {
      return errorRespone(res, 403, 0, 'error', 'Bạn không có quyền!')
    }
    isNotificaitonExist.seen = true

    const updateNotification = await isNotificaitonExist.save()
    res.send({
      code: 1,
      msg: 'success',
      message: 'Đã cập nhật thông báo',
      data: {
        notification: updateNotification,
      },
    })
  } catch (err) {
    return errorRespone(res, 400, 0, 'error', err)
  }
})

// @desc   delete one notification
// @route  DELETE /api/notification/:id
// @access Ministry
const deleteNotification = asyncHandler(async (req, res) => {
  try {
    const isNotificaitonExist = await Notification.findById(req.params.id)
    if (!isNotificaitonExist) {
      return errorRespone(res, 404, 0, 'error', 'Không tìm thấy thông báo này!')
    }
    if (isNotificaitonExist.user.toString() !== req.user._id) {
      return errorRespone(res, 403, 0, 'error', 'Bạn không có quyền!')
    }
    await Notification.deleteOne({ _id: req.params.id })
    res.send({
      code: 1,
      msg: 'success',
      message: 'Đã xóa thông báo này',
    })
  } catch (err) {
    return errorRespone(res, 400, 0, 'error', err)
  }
})

export { createNoti, getNotiMe, updateNotification, deleteNotification }
