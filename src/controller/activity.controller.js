import asyncHandler from 'express-async-handler'
import Activities from '../models/activity.model.js'
import Year from '../models/year.model.js'
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
    rollUpType,
    description,
  } = req.body

  try {
    const newActivity = await new Activities({
      year,
      content,
      startDate,
      endDate,
      rollUpType,
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
  console.log(req.params.fillter.split(','))
  try {
    const activities = await Activities.find({
      rollUpType: { $in: req.params.fillter.split(',') },
    }).populate('taskMaster', 'name')
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

// @desc   Update activity
// @route  Put /api/activity
// @access Admin

const updateActivity = asyncHandler(async (req, res) => {
  const {
    year,
    content,
    startDate,
    endDate,
    rollUpType,
    description,
  } = req.body

  try {
    //Check activity exist
    const activityExist = await Activities.findById(req.params.id)
    if (!activityExist) {
      return errorRespone(res, 404, 0, 'error', 'Hoạt động không tồn tại')
    }

    //Check year exist
    const yearExist = await Year.findById(year)
    if (!yearExist) {
      return errorRespone(res, 404, 0, 'error', 'Năm học không tồn tại')
    }

    //Update activity
    activityExist.year = year
    activityExist.content = content
    activityExist.startDate = startDate
    activityExist.endDate = endDate
    activityExist.description = description
    activityExist.rollUpType = rollUpType
    const activity = await activityExist.save()
    return res.json({
      code: 1,
      msg: 'success',
      message: 'Cập nhật hoạt động thành công!',
      data: {
        activity,
      },
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

export { createActivity, getActivities, updateActivity }
