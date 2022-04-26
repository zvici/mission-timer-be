import asyncHandler from 'express-async-handler'
import Activities from '../models/activity.model.js'
import Participants from '../models/participants.model.js'
import Semester from '../models/semester.model.js'
import Task from '../models/task.model.js'
import errorRespone from '../utils/errorRespone.js'
import https from 'https'
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
      await Participants.insertMany(
        listOfParticipants.map((item) => [
          {
            user: item.user,
            task: saveTask._id.toString(),
            createdBy: req.user._id.toString(),
          },
        ])
      )
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

// @desc   Get getTasks
// @route  Get /api/task
// @access Admin

const getTasks = asyncHandler(async (req, res) => {
  try {
    var sendNotification = function (data) {
      var headers = {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: 'Basic MzZhOTBkMzEtM2ZlNy00YzA3LWE1NzgtMWM4MTEyMzE5NmZl',
      }

      var options = {
        host: 'onesignal.com',
        port: 443,
        path: '/api/v1/notifications',
        method: 'POST',
        headers: headers,
      }
      var req = https.request(options, function (res) {
        res.on('data', function (data) {
          console.log('Response:')
          console.log(JSON.parse(data))
        })
      })

      req.on('error', function (e) {
        console.log('ERROR:')
        console.log(e)
      })

      req.write(JSON.stringify(data))
      req.end()
    }

    var message = {
      app_id: '22906000-58fe-4443-8f57-0ffd53bd63cf',
      contents: { en: 'English Message' },
      channel_for_external_user_ids: 'push',
      include_external_user_ids: ['da0b04b0-54a4-470c-8556-3b1f672b5b22'],
    }

    sendNotification(message)
    const listTasks = await Task.find()

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
