import asyncHandler from 'express-async-handler'
import Years from '../models/year.model.js'

// @desc   Create one Year
// @route  POST /api/year
// @access Admin
const createYear = asyncHandler(async (req, res) => {
  const { name, startDate, endDate, description } = req.body
  if (name && startDate) {
  }
})

export { createYear }
