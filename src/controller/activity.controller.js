import asyncHandler from 'express-async-handler'
import Activities from '../models/activity.model.js'
import errorRespone from '../utils/errorRespone.js'

// @desc   Create one Activity
// @route  POST /api/activity
// @access Admin
const createActivity = asyncHandler(async (req, res) => {
  const {
    year,
    content,
    startDate,
    endDate,
    quota,
    rollUpType,
    specifiedTime,
    status,
    description,
  } = req.body

  try {
    const newActivity = await new Activities({
      year,
      content,
      startDate,
      endDate,
      quota,
      rollUpType,
      specifiedTime,
      status,
      description,
      taskMaster: req.user._id,
    })
    const activity = await newActivity.save()
    return res.json({
      code: 1,
      msg: 'success',
      message: 'Tạo hoạt động thành công!',
      data: {
        activity,
      },
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

// @desc   Get list activity
// @route  Get /api/activity
// @access Admin

const getActivities = asyncHandler(async (req, res) => {
  try {
    const activities = await Activities.find()
    return res.send({
      code: 1,
      msg: 'success',
      message: 'Danh sách hoạt động',
      data: {
        activities,
      },
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

export { createActivity, getActivities }
