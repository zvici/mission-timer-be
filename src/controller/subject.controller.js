import asyncHandler from 'express-async-handler'
import Departments from '../models/department.model.js'
import Subject from '../models/subject.model.js'
import errorRespone from '../utils/errorRespone.js'

// @desc   Create one subject
// @route  POST /api/subject
// @access Ministry

const createSubject = asyncHandler(async (req, res) => {
  try {
    const { name, department, email, phone, address, description } = req.body
    // check department exist
    const isDepartmentExist = await Departments.findById(department)
    if (!isDepartmentExist) {
      return errorRespone(res, 404, 0, 'error', 'Không tồn tại khoa này!')
    }
    const subject = await new Subject({
      name,
      email,
      department,
      phone,
      address,
      description,
      createdBy: req.user._id,
    })
    const newSubject = await subject.save()
    res.send({
      code: 1,
      msg: 'success',
      message: 'Đã tạo bộ môn!',
      data: {
        subject: newSubject,
      },
    })
  } catch (err) {
    return errorRespone(res, 400, 0, 'error', err)
  }
})

// @desc   get list subjects
// @route  GET /api/subject?department=
// @access Ministry
const getSubjects = asyncHandler(async (req, res) => {
  try {
    const departmentQuery = req.query.department
      ? {
          department: req.query.department,
        }
      : {}
    const subjects = await Subject.find(departmentQuery)
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name')
      .populate('department', 'name')
    res.send({
      code: 1,
      msg: 'success',
      message: 'Danh sách bộ môn',
      data: {
        subjects,
      },
    })
  } catch (err) {
    return errorRespone(res, 400, 0, 'error', err)
  }
})

// @desc   update one subject
// @route  PUT /api/subject/:id
// @access Ministry
const updateSubject = asyncHandler(async (req, res) => {
  try {
    const { name, email, phone, address, description, department } = req.body
    // check department exist
    const isDepartmentExist = await Departments.findById(department)
    if (!isDepartmentExist) {
      return errorRespone(res, 404, 0, 'error', 'Không tồn tại khoa này!')
    }
    const isSubjectExist = await Subject.findById(req.params.id)
    if (!isSubjectExist) {
      return errorRespone(res, 404, 0, 'error', 'Không tìm thấy khoa này!')
    }
    isSubjectExist.name = name
    isSubjectExist.department = department
    isSubjectExist.email = email
    isSubjectExist.phone = phone
    isSubjectExist.address = address
    isSubjectExist.description = description
    isSubjectExist.updatedBy = req.user._id

    const updateSubject = await isSubjectExist.save()
    res.send({
      code: 1,
      msg: 'success',
      message: 'Đã cập nhật bộ môn',
      data: {
        subject: updateSubject,
      },
    })
  } catch (err) {
    return errorRespone(res, 400, 0, 'error', err)
  }
})

// @desc   delete one subject
// @route  DELETE /api/subject/:id
// @access Ministry
const deleteSubject = asyncHandler(async (req, res) => {
  try {
    const isSubjectExist = await Subject.findById(req.params.id)
    if (!isSubjectExist) {
      return errorRespone(res, 404, 0, 'error', 'Không tìm thấy bộ môn này!')
    }
    await Subject.deleteOne({ _id: req.params.id })
    res.send({
      code: 1,
      msg: 'success',
      message: 'Đã xóa bộ môn này',
    })
  } catch (err) {
    return errorRespone(res, 400, 0, 'error', err)
  }
})

export { createSubject, getSubjects, updateSubject, deleteSubject }
