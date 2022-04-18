import asyncHandler from 'express-async-handler'
import Activities from '../models/activity.model.js'
import Year from '../models/year.model.js'
import errorRespone from '../utils/errorRespone.js'

// @desc   Create one Activity
// @route  POST /api/activity
// @access Admin
const createActivity = asyncHandler(async (req, res) => {
  const { title, description, quota, year, type } = req.body

  try {
    const newActivity = await new Activities({
      title,
      description,
      quota,
      year,
      type,
      createdBy: req.user._id,
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
    const activities = await Activities.find({
      type: { $in: req.params.fillter.split(',') },
    })
      .populate('createdBy', 'name')
      .populate('createdBy', 'name')
    return res.send({
      code: 1,
      msg: 'success',
      message: 'Danh sách nội dung công tác khác',
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
  const { title, description, quota, year, type } = req.body

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
    activityExist.title = title
    activityExist.description = description
    activityExist.quota = quota
    activityExist.year = year
    activityExist.type = type
    activityExist.updatedBy = req.user._id

    const activity = await activityExist.save()
    return res.json({
      code: 1,
      msg: 'success',
      message: 'Cập nhật nội dung công tác khác thành công!',
      data: {
        activity,
      },
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

export { createActivity, getActivities, updateActivity }
