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
import removeAccents from '../helpers/removeAccents.js'
import Year from '../models/year.model.js'

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
// @desc   export excel
// @route  GET /api/statistical/export?user=user&year=year
// @access ADMIN
const exportFileExcel = asyncHandler(async (req, res) => {
  const { user, year } = req.query

  const userExist = await User.findById(user)
  if (!userExist) {
    return errorRespone(res, 404, 0, 'error', 'Không tìm thấy người dùng này!')
  }

  const yearExist = await Year.findById(year)
  if (!yearExist) {
    return errorRespone(res, 404, 0, 'error', 'Không tìm thấy năm học này!')
  }

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
        id: el._id.toString(),
        title: el.title,
        quota: el.quota,
      })),
    })
  })

  //get semester by year
  const resultSe = await Semester.find({
    year: year,
  })

  let resultPar = await Participants.find({
    user: user,
    semester: { $in: resultSe.map((item) => item._id.toString()) },
  }).populate({
    path: 'task',
    select: 'officeHours semester description',
    populate: {
      path: 'activity',
      select: 'type',
    },
  })

  console.log(resultPar)

  //set name
  worksheet.getCell('F22').value = userExist.name

  //set year
  worksheet.getCell('A5').value = `Năm học ${yearExist.name}`

  // for list activity
  let row = 8
  let numContent = 1
  let countRows = 8
  // location title
  let locationTitle = []
  grActivity.forEach((element) => {
    worksheet.insertRow(row, [romanize(numContent), element.name])
    locationTitle.push(row)
    row++
    countRows++
    let numActivity = 1
    element.actvity.forEach((el) => {
      let filterParByAc = resultPar.filter(
        (item) => item.task.activity._id.toString() === el.id
      )
      worksheet.insertRow(row, [
        numActivity,
        '',
        el.title,
        el.quota,
        [...filterParByAc].length > 1
          ? [...filterParByAc].reduce(function (prev, curr) {
              return prev.task.officeHours + curr.task.officeHours
            })
          : [...filterParByAc].length === 1
          ? [...filterParByAc][0].task.officeHours
          : '',
        [...filterParByAc].map((it) => it.task.description).toString(),
      ])
      row++
      numActivity++
      countRows++
    })
    numContent++
  })

  //Style
  const createBorderRange = (
    worksheet,
    start = { row: 8, col: 1 },
    end = { row: countRows, col: 6 },
    borderWidth = 'thin'
  ) => {
    const borderStyle = {
      style: borderWidth,
    }
    for (let x = start.row; x <= end.row; x++) {
      for (let y = start.col; y <= end.col; y++) {
        const cell = worksheet.getCell(x, y)
        cell.border = {
          left: borderStyle,
          right: borderStyle,
          top: borderStyle,
          bottom: borderStyle,
        }
        cell.font = {
          size: 12,
          name: 'Times New Roman',
        }
      }
    }
  }
  createBorderRange(worksheet)
  // style Title
  locationTitle.forEach((row) => {
    const cellTitle = worksheet.getCell(row, 2)
    cellTitle.font = {
      size: 12,
      name: 'Times New Roman',
      bold: true,
    }
    const cellNum = worksheet.getCell(row, 1)
    cellNum.font = {
      size: 12,
      name: 'Times New Roman',
      bold: true,
    }
    cellNum.alignment = { horizontal: 'right' }
  })

  //sumQuota
  worksheet.getCell(`E${countRows}`).value = {
    formula: `SUM(E8:E${countRows - 1})`,
  }
  worksheet.getCell(`E${countRows + 1}`).value = 10
  worksheet.getCell(`E${countRows + 2}`).value = {
    formula: `E${countRows}-E${countRows + 1}`,
  }

  //res.send()

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=' + `${removeAccents(userExist.name)}.xlsx`
  )

  await workbook.xlsx.write(res)

  res.end()
})

export { activityUsersStatistics, activityAUserStatistics, exportFileExcel }
