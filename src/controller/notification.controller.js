import asyncHandler from 'express-async-handler'
import Notification from '../models/notification.model.js'
import User from '../models/user.model.js'
import errorRespone from '../utils/errorRespone.js'
import client from '../config/onesignal.js'

// @desc   Create one notification
// @route  POST /api/notification
// @access Ministry

const createNoti = asyncHandler(async (req, res) => {
  try {
    const { title, data, content, startDate } = req.body
    const listUser = await User.find({ role: 'STAFF' })
    let listIns = []
    listUser.map(async (user) => {
      listIns.push({
        title,
        content,
        seen: false,
        user: user._id.toString(),
        createdBy: req.user._id,
      })
    })
    await Notification.insertMany(listIns)
    const notificationAfter = {
      // create notification
      included_segments: ['Subscribed Users'],
      contents: {
        en: `${content} - ${moment(startDate).format('DD/MM/YYYY - HH:mm')}`,
      },
      headings: {
        en: title,
      },
      ios_badge_count: 1,
      ios_badge_type: 'Increase',
      data: {
        body: content,
        title: title,
        sound: 'alert.aiff',
        type: 'admin',
      },
      send_after: moment(startDate).toString(),
    }
    await client.createNotification(notificationAfter)
    res.send({
      code: 1,
      msg: 'success',
      message: 'Đã tạo thông báo!',
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
    const { page, limit } = req.query
    const countNoti = await Notification.count({
      user: req.user._id,
    })
    const listNotiMe = await Notification.find({
      user: req.user._id,
    })
      .limit(limit)
      .skip(limit * page - limit)
    res.send({
      code: 1,
      msg: 'success',
      message: 'Danh sách thông báo',
      data: {
        notifications: listNotiMe,
        page: parseInt(page),
        pages: Math.floor(countNoti / limit + 1),
      },
    })
  } catch (err) {
    return errorRespone(res, 400, 0, 'error', err)
  }
})

// @desc   update one
// @route  PUT /api/notification/seen/:id
// @access Staff
const updateNotification = asyncHandler(async (req, res) => {
  try {
    // check notification exist
    const isNotificaitonExist = await Notification.findById(req.params.id)
    if (!isNotificaitonExist) {
      return errorRespone(res, 404, 0, 'error', 'Không tìm thấy thông báo này!')
    }
    if (isNotificaitonExist.user.toString() !== req.user._id.toString()) {
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
