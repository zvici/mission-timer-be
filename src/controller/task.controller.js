import asyncHandler from 'express-async-handler'
import Activities from '../models/activity.model.js'
import Participants from '../models/participants.model.js'
import Semester from '../models/semester.model.js'
import Task from '../models/task.model.js'
import errorRespone from '../utils/errorRespone.js'
import removeEmpty from '../utils/removeEmpty.js'
import * as OneSignal from 'onesignal-node'
import client from '../config/onesignal.js'
import User from '../models/user.model.js'
import moment from 'moment'
import Notification from '../models/notification.model.js'

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
      semester,
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
    // Check semester exist
    const semesterExist = await Semester.findById(semester)
    if (!semesterExist) {
      return errorRespone(res, 404, 0, 'error', 'Không tìm thấy học kỳ này!')
    }
    // Create Activity Detail
    const newTask = await new Task({
      activity,
      description,
      semester,
      startDate,
      endDate,
      officeHours: parseInt(officeHours),
      createdBy: req.user._id,
    })
    const saveTask = await newTask.save()
    let participants
    // if admin and Ministry create task
    participants = await Participants.insertMany(
      [...listOfParticipants].map((item) => ({
        user: item.toString(),
        task: saveTask._id.toString(),
        createdBy: req.user._id.toString(),
      }))
    )

    Promise.all(
      listOfParticipants.map(async (item) => {
        const findIDUser = await User.findById(item.toString())
        const newNoti = await new Notification({
          title: 'Công việc mới',
          content: `${description} - ${moment(startDate)
            .format('DD/MM/YYYY - HH:mm')
            .toString()} - ${moment(endDate)
            .format('DD/MM/YYYY - HH:mm')
            .toString()}`,
          seen: false,
          user: item.toString(),
          createdBy: req.user._id,
        })
        const saveNoti = await newNoti.save()
        const notification = {
          // create notification
          included_segments: ['Subscribed Users'],
          filters: [
            {
              field: 'tag',
              key: 'userId',
              relation: '=',
              value: findIDUser.userId,
            },
          ],
          contents: {
            en: `${description} - ${moment(startDate)
              .format('DD/MM/YYYY - HH:mm')
              .toString()} - ${moment(endDate)
              .format('DD/MM/YYYY - HH:mm')
              .toString()}`,
          },
          headings: {
            en: 'Có công việc mới',
          },
          ios_badge_count: 1,
          ios_badge_type: 'Increase',
          data: {
            body: description,
            title: 'Có công việc mới',
            sound: 'alert.aiff',
            type: 'task',
            data: saveNoti,
          },
          send_after: moment().add(5, 'minutes').toString(),
        }
        await client.createNotification(notification)
      })
    )

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
    const { status, semester } = req.query
    const queryFind = { status }
    const listTasks = await Participants.find({
      user: req.user._id,
      ...removeEmpty(queryFind),
    })
      .select('-user')
      .populate({
        path: 'task',
        populate: {
          path: 'activity',
        },
      })
    let newListasks = [...listTasks]
    if (listTasks.length > 0 && semester) {
      newListasks = listTasks.filter(
        (task) => task.task.semester.toString() === semester
      )
    }

    return res.send({
      code: 1,
      msg: 'success',
      message: `Danh sách task của ${req.user.name}`,
      data: {
        tasks: newListasks,
      },
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

// @desc   Get getTasks
// @route  Get /api/task
// @access Admin

const getTasks = asyncHandler(async (req, res) => {
  try {
    const listTasks = await Task.find().populate('activity', 'type')
    return res.send({
      code: 1,
      msg: 'success',
      message: `Danh sách task`,
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
    const { activity, description, semester, startDate, endDate, officeHours } =
      req.body
    //Check task exist
    const taskExist = await Task.findById(req.params.id)
    if (!taskExist) {
      return errorRespone(res, 404, 0, 'error', 'Không tìm thấy task này!')
    }
    //Check role
    if (
      req.user.role === 'STAFF' &&
      taskExist.createdBy.toString() !== req.user._id
    ) {
      return errorRespone(res, 403, 0, 'error', 'Không được phép!')
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
    taskExist.semester = semester
    taskExist.startDate = startDate
    taskExist.endDate = endDate
    taskExist.officeHours = officeHours
    taskExist.updatedBy = req.user._id

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
export { createTask, getTasksMe, updateTask, getTasks }
