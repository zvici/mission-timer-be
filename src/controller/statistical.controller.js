import asyncHandler from 'express-async-handler'
import Participants from '../models/participants.model.js'
import Semester from '../models/semester.model.js'
import User from '../models/user.model.js'
import errorRespone from '../utils/errorRespone.js'
import { sumQuota } from '../utils/statisticalFunction.js'
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

export { activityUsersStatistics, activityAUserStatistics }
