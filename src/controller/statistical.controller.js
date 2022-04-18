import asyncHandler from 'express-async-handler'
import ActivityDetail from '../models/activityDetail.model.js'
import User from '../models/user.model.js'
import errorRespone from '../utils/errorRespone.js'
import { countStatusActivity, sumQuota } from '../utils/statisticalFunction.js'
const activityUsersStatistics = asyncHandler(async (req, res) => {
  try {
    const result = await ActivityDetail.find()
      .select('quota status')
      .populate({
        path: 'activity',
        select: 'content',
        populate: {
          path: 'year',
          select: 'name',
        },
      })
      .populate('assignee', 'name')
    const listUser = await User.find({ role: 'STAFF' }).select('name')
    let resultC = []
    if (result && listUser) {
      listUser.map((item) => {
        resultC.push({
          id: item._id,
          name: item.name,
          sumQuota: sumQuota(item.id, result),
          notAnswered: countStatusActivity(item.id, result, 'notAnswered'),
          refuse: countStatusActivity(item.id, result, 'refuse'),
          attended: countStatusActivity(item.id, result, 'attended'),
          accept: countStatusActivity(item.id, result, 'accept'),
          notEngaged: countStatusActivity(item.id, result, 'notEngaged'),
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

export { activityUsersStatistics }
