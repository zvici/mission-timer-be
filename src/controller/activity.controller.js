import asyncHandler from 'express-async-handler'
import Activities from '../models/activity.model.js'
import Year from '../models/year.model.js'
import errorRespone from '../utils/errorRespone.js'
import Content from '../models/content.model.js'
import Task from '../models/task.model.js'
import removeEmpty from '../utils/removeEmpty.js'

// @desc   Create one Activity
// @route  POST /api/activity
// @access Admin
const createActivity = asyncHandler(async (req, res) => {
  try {
    const { title, description, quota, content, type } = req.body
    //Check content exist
    const contentExist = await Content.findById(content)
    if (!contentExist) {
      return errorRespone(res, 404, 0, 'error', 'Nội dung này không tồn tại!')
    }
    const newActivity = await new Activities({
      title,
      description,
      quota,
      content,
      type,
      createdBy: req.user._id,
    })
    const activity = await newActivity.save()
    return res.json({
      code: 1,
      msg: 'success',
      message: 'Tạo hoạt động thành công!',
      data: {
        activity,
      },
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

// @desc   Get list activity
// @route  Get /api/activity
// @access Admin

const getActivities = asyncHandler(async (req, res) => {
  try {
    const { content, type } = req.query
    const queryFind = { content, type }
    const activities = await Activities.find(removeEmpty(queryFind))
      .populate('content', 'title')
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name')
    return res.send({
      code: 1,
      msg: 'success',
      message: 'Danh sách hoạt động công tác khác',
      data: {
        activities,
      },
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

// @desc   Update activity
// @route  Put /api/activity:id
// @access Admin

const updateActivity = asyncHandler(async (req, res) => {
  const { title, description, quota, content, type } = req.body

  try {
    //Check activity exist
    const activityExist = await Activities.findById(req.params.id)
    if (!activityExist) {
      return errorRespone(res, 404, 0, 'error', 'Hoạt động không tồn tại')
    }
    //Check content exist
    const contentExist = await Content.findById(content)
    if (!contentExist) {
      return errorRespone(res, 404, 0, 'error', 'Nội dung này không tồn tại!')
    }

    //Update activity
    activityExist.title = title
    activityExist.description = description
    activityExist.quota = quota
    activityExist.content = content
    activityExist.type = type
    activityExist.updatedBy = req.user._id

    const activity = await activityExist.save()
    return res.json({
      code: 1,
      msg: 'success',
      message: 'Cập nhật nội dung công tác khác thành công!',
      data: {
        activity,
      },
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

// @desc   Delete activity
// @route  Put /api/activity:id
// @access Admin

const deleteActivity = asyncHandler(async (req, res) => {
  try {
    //Check activity exist
    const activityExist = await Activities.findById(req.params.id)
    if (!activityExist) {
      return errorRespone(res, 404, 0, 'error', 'Hoạt động không tồn tại')
    }
    //Check activity exist in task ne
    const activityExistTask = await Task.find({ activity: req.params.id })
    if (!activityExistTask) {
      return errorRespone(res, 400, 0, 'error', 'Không được xóa hoạt dộng này')
    }
    await Activities.deleteOne({ _id: req.params.id })
    return res.json({
      code: 1,
      msg: 'success',
      message: 'Đã xóa hoạt động này',
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

export { createActivity, getActivities, updateActivity, deleteActivity }
