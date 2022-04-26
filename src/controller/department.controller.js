import asyncHandler from 'express-async-handler'
import Department from '../models/department.model.js'
import errorRespone from '../utils/errorRespone.js'

// @desc   Create one year
// @route  POST /api/department
// @access Ministry

const createDepartment = asyncHandler(async (req, res) => {
  try {
    const { name, email, phone, address, description } = req.body
    const department = await new Department({
      name,
      email,
      phone,
      address,
      description,
      createdBy: req.user._id,
    })
    const newDepartment = await department.save()
    res.send({
      code: 1,
      msg: 'success',
      message: 'Đã tạo khoa!',
      data: {
        department: newDepartment,
      },
    })
  } catch (err) {
    return errorRespone(res, 400, 0, 'error', err)
  }
})

// @desc   get list departments
// @route  GET /api/department
// @access Ministry
const getDepartments = asyncHandler(async (req, res) => {
  try {
    const departments = await Department.find({})
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name')
    res.send({
      code: 1,
      msg: 'success',
      message: 'Danh sách khoa',
      data: {
        departments,
      },
    })
  } catch (err) {
    return errorRespone(res, 400, 0, 'error', err)
  }
})

// @desc   update one department
// @route  PUT /api/department/:id
// @access Ministry
const updateDepartment = asyncHandler(async (req, res) => {
  try {
    const { name, email, phone, address, description } = req.body
    const isDepartmentExist = await Department.findById(req.params.id)
    if (!isDepartmentExist) {
      return errorRespone(res, 404, 0, 'error', 'Không tìm thấy khoa này!')
    }
    isDepartmentExist.name = name
    isDepartmentExist.email = email
    isDepartmentExist.phone = phone
    isDepartmentExist.address = address
    isDepartmentExist.description = description
    isDepartmentExist.updatedBy = req.user._id

    const updateDepartment = await isDepartmentExist.save()
    res.send({
      code: 1,
      msg: 'success',
      message: 'Đã cập nhật khoa',
      data: {
        department: updateDepartment,
      },
    })
  } catch (err) {
    return errorRespone(res, 400, 0, 'error', err)
  }
})

// @desc   delete one department
// @route  DELETE /api/department/:id
// @access Ministry
const deleteDepartment = asyncHandler(async (req, res) => {
  try {
    const isDepartmentExist = await Department.findById(req.params.id)
    if (!isDepartmentExist) {
      return errorRespone(res, 404, 0, 'error', 'Không tìm thấy khoa này!')
    }
    await Department.deleteOne({ _id: req.params.id })
    res.send({
      code: 1,
      msg: 'success',
      message: 'Đã xóa khoa này',
    })
  } catch (err) {
    return errorRespone(res, 400, 0, 'error', err)
  }
})

export { createDepartment, getDepartments, updateDepartment, deleteDepartment }
