import asyncHandler from 'express-async-handler'
import Participants from '../models/participants.model.js'
import Semester from '../models/semester.model.js'
import User from '../models/user.model.js'
import errorRespone from '../utils/errorRespone.js'
import { sumQuota } from '../utils/statisticalFunction.js'
import Excel from 'exceljs'
import fs from 'fs'
import Activities from '../models/activity.model.js'

const activityUsersStatistics = asyncHandler(async (req, res) => {
  try {
    const { semester } = req.query
    const semesterExist = await Semester.findById(semester)
    if (!semesterExist) {
      return errorRespone(res, 404, 0, 'error', 'Không tìm thấy học kỳ này!')
    }
    const result = await Participants.find().populate({
      path: 'task',
      select: 'officeHours semester',
      populate: {
        path: 'activity',
        select: 'type',
      },
    })
    let newResult = [...result]
    if (result.length > 0 && semester) {
      newResult = newResult.filter(
        (task) => task.task.semester.toString() === semester
      )
    }
    const listUser = await User.find({ role: 'STAFF' })
    let resultC = []
    if (result && listUser) {
      listUser.map((item) => {
        resultC.push({
          id: item._id,
          name: item.name,
          avatar: item.avatar,
          email: item.email,
          userId: item.userId,
          ...sumQuota(item.id, newResult),
        })
      })
    }
    return res.send({
      code: 1,
      msg: 'success',
      message: 'Thông kê trạng thái hoạt động của giảng viên.',
      data: {
        statistic: resultC,
      },
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

const activityAUserStatistics = asyncHandler(async (req, res) => {
  try {
    const { user } = req.params
    const { semester } = req.query
    const userExist = await User.findById(user)
    if (!userExist) {
      return errorRespone(
        res,
        404,
        0,
        'error',
        'Không tìm thấy người dùng này!'
      )
    }
    const semesterExist = await Semester.findById(semester)
    if (!semesterExist) {
      return errorRespone(res, 404, 0, 'error', 'Không tìm thấy học kỳ này!')
    }
    const result = await Participants.find({ user: user }).populate({
      path: 'task',
      select: 'officeHours semester',
      populate: {
        path: 'activity',
        select: 'type',
      },
    })

    let newResult = [...result]
    if (result.length > 0 && semester) {
      newResult = newResult.filter(
        (task) => task.task.semester.toString() === semester
      )
    }
    let resultC = []
    resultC.push({
      id: userExist._id,
      name: userExist.name,
      avatar: userExist.avatar,
      userId: userExist.userId,
      email: userExist.email,
      ...sumQuota(userExist.id, newResult),
    })

    return res.send({
      code: 1,
      msg: 'success',
      message: `Thông kê trạng thái hoạt động của giảng viên trong ${semesterExist.name}`,
      data: {
        statistic: resultC,
      },
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

const exportFileExcel = asyncHandler(async (req, res) => {
  const { user, semester } = req.query
  const path = 'src/helpers/excel/template_export.xlsx'
  const excel = fs.realpathSync(path, { encoding: 'utf8' })
  const workbook = new Excel.Workbook()
  await workbook.xlsx.readFile(excel)
  let worksheet = workbook.getWorksheet('name')
  // get list paricipants by user
  const result = await Participants.find({ user: user }).populate({
    path: 'task',
    select: 'officeHours semester description',
    populate: {
      path: 'activity',
      select: 'title',
      populate: {
        path: 'content',
        select: 'title',
      },
    },
  })
  // filter by semester
  let filterSemester = result.filter(
    (item) => item.task.semester.toString() === semester
  )

  // group object content -> activity -> task

  let seenContent = new Set(
    filterSemester.map((v) => v.task.activity.content._id.toString())
  )

  // console.log(seenContent)

  let output;
  [...seenContent].forEach((item) => {
    let groupContent = filterSemester.filter(
      (i) => i.task.activity.content._id.toString() === item
    )
    let seenActivity = new Set(
      groupContent.map((v) => v.task.activity._id.toString())
    )
    let listActivity = []
    ;[...seenActivity].forEach((it) => {
      let listTask = []
      groupContent.map((el) => {
        if (el.task.activity._id.toString() === it)
          listTask.push(el.task.description)
      })
      console.log(listTask)
      // listActivity.push({
      //   activity: it,
      //   task: listTask,
      // })
    })
    output.push({
      content: item,
      activity: listActivity,
    })
  })

  res.send(output)

  // worksheet.insertRow(8, [3, 'Sam', new Date()])

  // res.setHeader(
  //   'Content-Type',
  //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  // )
  // res.setHeader(
  //   'Content-Disposition',
  //   'attachment; filename=' + 'template_export.xlsx'
  // )

  // await workbook.xlsx.write(res)

  // res.end()
})

export { activityUsersStatistics, activityAUserStatistics, exportFileExcel }
