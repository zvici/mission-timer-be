import asyncHandler from 'express-async-handler'
import Activities from '../models/activity.model.js'
import Task from '../models/task.model.js'
import User from '../models/user.model.js'
import errorRespone from '../utils/errorRespone.js'

// @desc   Create one Task
// @route  POST /api/activity-detail
// @access Admin

const createTask = asyncHandler(async (req, res) => {
  const { activity, assignee } = req.body
  try {
    //Check activity exist
    const activityExist = await Activities.findById(activity)
    if (!activityExist) {
      return errorRespone(res, 404, 0, 'error', 'Không tìm thấy hoạt động này!')
    }
    //Check user exist
    const userExits = await User.findById(assignee)
    if (!userExits) {
      return errorRespone(
        res,
        404,
        0,
        'error',
        'Không tìm thấy người dùng này!'
      )
    }
    // Create Activity Detail

    const newTask = await new Task({
      activity,
      assignee,
    })
    const saveTask = await newTask.save()
    return res.send({
      code: 1,
      msg: 'success',
      message: 'Đã tạo công việc!',
      data: {
        task: saveTask,
      },
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

// @desc   Get avtivities of me
// @route  Get /api/activity-detail/me
// @access Admin

const getActivitiesDetailMe = asyncHandler(async (req, res) => {
  try {
    const task = await Task.find({
      assignee: req.user._id,
    })
      .populate('assignee', 'name')
      .populate('activity', 'content description startDate endDate')
    return res.send({
      code: 1,
      msg: 'success',
      message: 'Danh sách chi tiết hoạt động của bạn!',
      data: {
        task,
      },
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

// @desc   Update Task
// @route  Put /api/activity-detail/me
// @access ACADEMIC_STAFF, STAFF

const updateTaskMe = asyncHandler(async (req, res) => {
  try {
    const { id, description, quota, status, comments } = req.body
    const isTaskExist = await Task.findById(id)
    // Check activity detail exist
    if (!isTaskExist) {
      return errorRespone(res, 404, 0, 'error', 'Không tìm thấy hoạt động này!')
    }
    // Check assignee = id user request 
    if (
      !(isTaskExist.assignee.toString() === req.user._id.toString())
    ) {
      return errorRespone(res, 401, 0, 'error', 'Bạn không có quyền!')
    }
    // Update activity detail
    isTaskExist.description = description
    isTaskExist.quota = quota
    isTaskExist.status = status
    isTaskExist.comments = comments

    const updateTask = await isTaskExist.save()
    return res.send({
      code: 1,
      msg: 'success',
      message: 'Đã cập nhật!',
      data: {
        updateTask,
      },
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

export { createTask, getActivitiesDetailMe, updateTaskMe }
