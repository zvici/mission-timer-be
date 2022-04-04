import asyncHandler from 'express-async-handler'
import Years from '../models/year.model.js'
import errorRespone from '../utils/errorRespone.js'

// @desc   Create one Year
// @route  POST /api/year
// @access Admin
const createYear = asyncHandler(async (req, res) => {
  const { name, startDate, endDate, description } = req.body
  try {
    const year = await new Years({
      name,
      startDate,
      endDate,
      description,
    })
    const newYear = await year.save()
    res.send({
      code: 1,
      msg: 'success',
      message: 'Tạo năm học thành công!',
      data: {
        year: newYear,
      },
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

// @desc   Delete one year
// @route  DELETE /api/year
// @access Admin
const deleteYear = asyncHandler(async (req, res) => {
  const year = await Years.findById(req.params.id)
  if (!year) {
    return errorRespone(res, 404, 0, 'error', 'Năm học không tồn tại!')
  }
  // delete year
  try {
    await year.remove()
    return res.send({
      code: 1,
      msg: 'success',
      message: 'Đã xoá năm học',
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

// @desc   Get list Year
// @route  GET /api/year
// @access Admin
const getYears = asyncHandler(async (req, res) => {
  try {
    const years = await Years.find()
    res.send({
      code: 1,
      msg: 'success',
      message: 'Danh sách năm học',
      data: {
        years,
      },
    })
  } catch (error) {
    return errorRespone(res, 400, 1, 'error', error)
  }
})

export { createYear, getYears, deleteYear }
