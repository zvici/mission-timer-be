import asyncHandler from 'express-async-handler'
import Activities from '../models/activity.model.js'
import Participants from '../models/participants.model.js'
import Task from '../models/task.model.js'
import errorRespone from '../utils/errorRespone.js'

// @desc   Create one Task
// @route  POST /api/activity-detail
// @access Admin

const createTask = asyncHandler(async (req, res) => {
  try {
    const {
      activity,
      description,
      startDate,
      endDate,
      officeHours,
      listOfParticipants,
    } = req.body
    //Check activity exist
    const activityExist = await Activities.findById(activity)
    if (!activityExist) {
      return errorRespone(res, 404, 0, 'error', 'Không tìm thấy hoạt động này!')
    }
    if (
      req.user.role.toString() === 'STAFF' &&
      activityExist.type.toString() === 'MINISTRY'
    ) {
      return errorRespone(
        res,
        403,
        0,
        'error',
        'Bạn không có quyền tạo task với hoạt động này!'
      )
    }
    // Create Activity Detail
    const newTask = await new Task({
      activity,
      description,
      startDate,
      endDate,
      officeHours,
      createdBy: req.user._id,
    })
    const saveTask = await newTask.save()
    let participants
    // if user create Task
    if (
      activityExist.type.toString() === 'STAFF' &&
      req.user.role.toString() === 'STAFF'
    ) {
      // Create new participants
      participants = await new Participants({
        task: saveTask._id.toString(),
        user: req.user._id.toString(),
        createdBy: req.user._id,
      })
      await participants.save()
    }
    // if admin and Ministry create task
    if (
      req.user.role.toString() === 'ADMIN' ||
      req.user.role.toString() === 'MINISTRY'
    ) {
      participants = await Participants.insertMany([
        listOfParticipants.map((item) => [
          {
            user: item.user,
            task: saveTask._id.toString(),
            createdBy: req.user._id,
          },
        ]),
      ])
      await participants.save()
    }
    return res.send({
      code: 1,
      msg: 'success',
      message: 'Đã tạo task!',
      data: {
        task: saveTask,
        participants,
      },
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

// @desc   Get getTasksMe
// @route  Get /api/task/me
// @access Admin

const getTasksMe = asyncHandler(async (req, res) => {
  try {
    const listTasks = await Participants.find({ user: req.user._id })
      .select('-user')
      .populate({
        path: 'task',
        populate: {
          path: 'activity',
        },
      })

    return res.send({
      code: 1,
      msg: 'success',
      message: `Danh sách task của ${req.user.name}`,
      data: {
        tasks: listTasks,
      },
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

// @desc   Update Task
// @route  Put /api/task/:id
// @access MINISTRY, STAFF

const updateTask = asyncHandler(async (req, res) => {
  try {
    const { activity, description, startDate, endDate, officeHours } = req.body
    //Check task exist
    const taskExist = await Task.findById(req.params.id)
    if (!taskExist) {
      return errorRespone(res, 404, 0, 'error', 'Không tìm thấy task này!')
    }
    //Check activity exist
    const activityExist = await Activities.findById(activity)
    if (!activityExist) {
      return errorRespone(res, 404, 0, 'error', 'Không tìm thấy hoạt động này!')
    }
    //Check role
    if (req.user.role === 'STAFF' && activityExist.type !== 'STAFF') {
      return errorRespone(
        res,
        403,
        0,
        'error',
        'Bạn không được chọn hoạt động này!'
      )
    }

    taskExist.activity = activity
    taskExist.description = description
    taskExist.startDate = startDate
    taskExist.endDate = endDate
    taskExist.officeHours = officeHours

    const saveTask = await taskExist.save()
    return res.send({
      code: 1,
      msg: 'success',
      message: 'Đã cập nhật task',
      data: {
        task: saveTask,
      },
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

export { createTask, getTasksMe, updateTask }
