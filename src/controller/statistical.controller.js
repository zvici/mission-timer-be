import asyncHandler from 'express-async-handler'
import Participants from '../models/participants.model.js'
import User from '../models/user.model.js'
import errorRespone from '../utils/errorRespone.js'
import { sumQuota } from '../utils/statisticalFunction.js'
const activityUsersStatistics = asyncHandler(async (req, res) => {
  try {
    const result = await Participants.find().populate({
      path: 'task',
      select: 'officeHours activity',
      populate: {
        path: 'activity',
        select: 'year',
        populate: {
          path: 'year',
          select: 'name',
        },
      },
    })
    const listUser = await User.find({ role: 'STAFF' }).select('name')
    let resultC = []
    if (result && listUser) {
      listUser.map((item) => {
        resultC.push({
          id: item._id,
          name: item.name,
          userId: item.userId,
          ...sumQuota(item.id, result),
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
    const result = await Participants.find({}).populate({
      path: 'task',
      select: 'officeHours activity',
      populate: {
        path: 'activity',
        select: 'year',
        populate: {
          path: 'year',
          select: 'name',
        },
      },
    })

    const listUser = await User.findById(req.params.user)
    if (!listUser) {
      return errorRespone(
        res,
        404,
        0,
        'error',
        'Không tìm thấy người dùng này!'
      )
    }
    let resultC = {
      id: listUser._id,
      name: listUser.name,
      userId: listUser.userId,
      ...sumQuota(listUser.id, result),
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

export { activityUsersStatistics, activityAUserStatistics }
