import asyncHandler from 'express-async-handler'
import Participants from '../models/participants.model.js'
import Semester from '../models/semester.model.js'
import User from '../models/user.model.js'
import errorRespone from '../utils/errorRespone.js'
import { sumQuota } from '../utils/statisticalFunction.js'
import Excel from 'exceljs'
import fs from 'fs'
import Activities from '../models/activity.model.js'
import romanize from '../helpers/romanize.js'

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

  //get list activity
  const listActivity = await Activities.find({}).populate({
    path: 'content',
    select: 'title',
  })

  let seenContent = new Set(listActivity.map((v) => v.content._id.toString()))

  let grActivity = []

  ;[...seenContent].forEach((element) => {
    let activityFilter = listActivity.filter(
      (i) => i.content._id.toString() === element
    )
    grActivity.push({
      id: element,
      name: activityFilter[0].content.title,
      actvity: activityFilter.map((el) => ({
        id: el._id,
        title: el.title,
        quota: el.quota,
      })),
    })
  })

  // for list activity
  let row = 8
  let numContent = 1
  grActivity.forEach((element) => {
    worksheet.insertRow(row, [romanize(numContent), element.name])
    row++
    let numActivity = 1
    element.actvity.forEach((el) => {
      worksheet.insertRow(row, [numActivity, '', el.title, el.quota])
      row++
      numActivity++
    })
    numContent++
  })

  //res.send(grActivity)

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=' + 'template_export.xlsx'
  )

  await workbook.xlsx.write(res)

  res.end()
})

export { activityUsersStatistics, activityAUserStatistics, exportFileExcel }
