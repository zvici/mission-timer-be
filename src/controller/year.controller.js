import asyncHandler from 'express-async-handler'
import Years from '../models/year.model.js'
import errorRespone from '../utils/errorRespone.js'

// @desc   Create one Year
// @route  POST /api/year
// @access Admin
const createYear = asyncHandler(async (req, res) => {
  const { startDate, endDate, description } = req.body
  const yearCut = startDate.split('-')[0]
  //Check year exist
  const existYear = await Years.findOne({ name: { $regex: `^${yearCut}` } })
  if (existYear) {
    return errorRespone(res, 400, 0, 'error', 'Năm học đã tồn tại!')
  }
  try {
    const year = await new Years({
      name: `${yearCut}-${Number(yearCut) + 1}`,
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
    return errorRespone(res, 400, 0, 'error', error)
  }
})

// @desc   Update Year
// @route  PUT /api/year
// @access Admin

const updateYear = asyncHandler(async (req, res) => {
  const { startDate, endDate, description } = req.body
  let year = await Years.findById(req.params.id)
  if (!year) {
    return errorRespone(res, 404, 1, 'error', 'Không tìm thấy năm học này!')
  }
  const yearCut = startDate.split('-')[0]
  const existYear = await Years.findOne({ name: { $regex: `^${yearCut}` } })
  if (existYear && (existYear.startDate.toString() !== year.startDate.toString())) {
    return errorRespone(res, 400, 0, 'error', 'Năm học đã tồn tại!')
  }
  try {
    year.startDate = startDate;
    year.endDate = endDate;
    year.description = description;
    const upadateYear = await year.save()
    return res.send({
      code: 1,
      msg: 'success',
      message: 'Cập nhật năm học thành công!',
      data: {
        year: upadateYear,
      }
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

export { createYear, getYears, deleteYear, updateYear }
