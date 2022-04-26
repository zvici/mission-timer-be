import asyncHandler from 'express-async-handler'
import Semester from '../models/semester.model.js'
import Year from '../models/year.model.js'
import errorRespone from '../utils/errorRespone.js'

// @desc   Create one Semester
// @route  POST /api/semester
// @access Admin
const createSemester = asyncHandler(async (req, res) => {
  const { startDate, endDate, year, name, description } = req.body

  const yearExist = await Year.findById(year)
  //Check year exist
  if (!yearExist) {
    return errorRespone(res, 404, 0, 'error', 'Năm học không tồn tạii tồn tại!')
  }
  try {
    const semester = await new Semester({
      name,
      year,
      startDate,
      endDate,
      description,
      createdBy: req.user._id,
    })
    const newSemester = await semester.save()
    res.send({
      code: 1,
      msg: 'success',
      message: 'Tạo học kỳ thành công!',
      data: {
        semester: newSemester,
      },
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

// @desc   Delete one year
// @route  DELETE /api/semester/:id
// @access Admin
const deleteSemester = asyncHandler(async (req, res) => {
  const semester = await Semester.findById(req.params.id)
  if (!semester) {
    return errorRespone(res, 404, 0, 'error', 'Học kỳ không tồn tại!')
  }
  // delete semester
  try {
    await semester.remove()
    return res.send({
      code: 1,
      msg: 'success',
      message: 'Đã xoá học kỳ này',
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

// @desc   Get list semesters
// @route  GET /api/semesters?year=year
// @access Admin
const getSemesters = asyncHandler(async (req, res) => {
  try {
    const yearQuery = req.query.year
      ? {
          year: req.query.year,
        }
      : {}
    const semesters = await Semester.find(yearQuery)
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name')
    res.send({
      code: 1,
      msg: 'success',
      message: 'Danh sách học kỳ',
      data: {
        semesters,
      },
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

// @desc   Update Semester
// @route  PUT /api/semesters/:id
// @access Admin

const updateSemester = asyncHandler(async (req, res) => {
  try {
    const { name, year, startDate, endDate, description } = req.body
    // check semester exist
    const semesterExist = await Semester.findById(req.params.id)
    if (!semesterExist) {
      return errorRespone(res, 404, 1, 'error', 'Không tìm thấy học kỳ này!')
    }
    // check semester exist
    const yearExist = await Year.findById(year)
    if (!yearExist) {
      return errorRespone(res, 404, 1, 'error', 'Không tìm thấy năm học này!')
    }
    //
    semesterExist.startDate = startDate
    semesterExist.endDate = endDate
    semesterExist.description = description
    semesterExist.name = name
    semesterExist.year = year
    semesterExist.updatedBy = req.user._id
    const upadateSemester = await semesterExist.save()
    return res.send({
      code: 1,
      msg: 'success',
      message: 'Cập nhật học kỳ thành công!',
      data: {
        semester: upadateSemester,
      },
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

export { createSemester, getSemesters, deleteSemester, updateSemester }
