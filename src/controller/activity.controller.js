import asyncHandler from 'express-async-handler'
import Activities from '../models/activity.model.js'
import errorRespone from '../utils/errorRespone.js'

// @desc   Create one Activity
// @route  POST /api/activity
// @access Admin
const createActivity = asyncHandler(async (req, res) => {
  const {
    content,
    taskMaster,
    assignee,
    quota,
    year,
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
      taskMaster,
      assignee,
      quota,
      year,
      rollUpType,
      specifiedTime,
      status,
      description,
    })
    return res.json({
      code: 1,
      msg: 'success',
      message: 'Tạo hoạt động thành công!',
      data: {
        activity: newActivity,
      },
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

export { createActivity }
