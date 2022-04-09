import asyncHandler from 'express-async-handler'
import Activities from '../models/activity.model.js'
import ActivityDetail from '../models/activityDetail.model.js'
import User from '../models/user.model.js'
import errorRespone from '../utils/errorRespone.js'

// @desc   Create one ActivityDetail
// @route  POST /api/activity-detail
// @access Admin

const createActivityDetail = asyncHandler(async (req, res) => {
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

    const newActivityDetail = await new ActivityDetail({
      activity,
      assignee,
    })
    const saveActivityDetail = await newActivityDetail.save()
    return res.send({
      code: 1,
      msg: 'success',
      message: 'Tạo chi tiết hoạt động thành công!',
      data: {
        activityDetail: saveActivityDetail,
      },
    })
  } catch (error) {
    return errorRespone(res, 404, 0, 'error', error)
  }
})

export { createActivityDetail }
