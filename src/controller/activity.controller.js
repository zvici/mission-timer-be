import asyncHandler from 'express-async-handler'
import Activities from '../models/activity.model.js'

// @desc   Create one Activity
// @route  POST /api/activity
// @access Admin
const createActivity = asyncHandler(async (req, res) => {
  const {
    content,
    taskMaster,
    assignee,
    quota,
    year,
    rollUpType,
    specifiedTime,
    status,
    description,
  } = req.body
  
})

export { createActivity }
