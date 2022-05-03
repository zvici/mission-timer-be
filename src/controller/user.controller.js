import asyncHandler from 'express-async-handler'
import User from '../models/user.model.js'
import generateToken from '../utils/generateToken.js'
import jwt from 'jsonwebtoken'
import errorRespone from '../utils/errorRespone.js'
import uploads from '../config/cloudinary.config.js'
import sendMail from '../helpers/sendmail.js'
import Otps from '../models/otp.model.js'
import moment from 'moment'
import { resHtmlForgotPassword } from '../helpers/html/resHtml.js'
import removeEmpty from '../utils/removeEmpty.js'
import Departments from '../models/department.model.js'
import Subject from '../models/subject.model.js'

// @desc   Auth admin and get token
// @route  POST /api/user/login
// @access Public
const authAdmin = asyncHandler(async (req, res) => {
  const { userId, password } = req.body

  const user = await User.findOne({ userId })

  if (!user) {
    return res.status(401).json({
      code: 0,
      msg: 'error',
      message: 'Sai tài khoản hoặc mật khẩu!',
    })
  }

  if (user.role !== 'ADMIN') {
    return res.status(401).json({
      code: 0,
      msg: 'error',
      message: 'Không được phép đăng nhập!',
    })
  }

  if (user && (await user.matchPassword(password))) {
    const userRes = await User.findOne({ userId }).select(['-password'])
    return res.json({
      code: 1,
      msg: 'success',
      message: 'Đăng nhập thành công!',
      data: {
        user: userRes,
        token: generateToken(user._id),
      },
    })
  } else {
    return res.status(401).json({
      code: 0,
      msg: 'error',
      message: 'Sai tài khoản hoặc mật khẩu!',
    })
  }
})

// @desc   Auth staff and get token
// @route  POST /api/user/staff/login
// @access Public
const authStaff = asyncHandler(async (req, res) => {
  const { userId, password } = req.body
  const user = await User.findOne({ userId })
  if (!user) {
    return res.status(401).json({
      code: 0,
      msg: 'error',
      message: 'Sai tài khoản hoặc mật khẩu!',
    })
  }

  if (user.role !== 'STAFF') {
    return res.status(401).json({
      code: 0,
      msg: 'error',
      message: 'Không được phép đăng nhập!',
    })
  }
  if (user && (await user.matchPassword(password))) {
    const userRes = await User.findOne({ userId }).select(['-password'])
    res.json({
      code: 1,
      msg: 'success',
      message: 'Đăng nhập thành công!',
      data: {
        user: userRes,
        token: generateToken(user._id),
      },
    })
  } else {
    return res.status(401).json({
      code: 0,
      msg: 'error',
      message: 'Sai tài khoản hoặc mật khẩu!',
    })
  }
})

// @desc   Get list
// @route  Get /api/user/
// @access Admin
const getUsers = asyncHandler(async (req, res) => {
  try {
    const { role } = req.query
    const queryFind = { role }
    const users = await User.find(removeEmpty(queryFind))
      .populate('department', 'name')
      .populate('subject', 'name')
      .sort({
        userId: 1,
      })
      .select('-password')
    res.send({
      code: 1,
      msg: 'success',
      message: 'Danh sách người dùng',
      data: { users },
    })
  } catch (err) {
    return errorRespone(res, 400, 0, 'error', err)
  }
})

// @desc   Creat user
// @route  Post /api/users/
// @access Admin
const createUser = asyncHandler(async (req, res) => {
  try {
    const { name, userId, department, subject, role, email, phone, address } =
      req.body
    const newUser = await new User({
      name,
      userId,
      password: 123456,
      department,
      subject,
      role,
      email,
      phone,
      address,
    })
    const user = await newUser.save(req.body)
    return res.send({
      code: 1,
      msg: 'success',
      message: 'Tạo user thành công!',
      data: {
        user,
      },
    })
  } catch (error) {
    return errorRespone(res, 401, 0, 'error', error)
  }
})

// @desc   Update user
// @route  PUT /api/users/
// @access Admin

const updateUser = asyncHandler(async (req, res) => {
  try {
    const { userId, name, department, subject, role, email, phone, address } =
      req.body
    const userExists = await User.findById(req.params.id)
    if (!userExists) {
      return errorRespone(
        res,
        404,
        0,
        'error',
        'Không tìm thấy người dùng này!'
      )
    }
    // Check department exist
    const isDepartmentExist = await Departments.findById(department)
    if (!isDepartmentExist) {
      return errorRespone(res, 404, 0, 'error', 'Không tìm thấy khoa này!')
    }
    // Check subject exist
    const isSubjetExist = await Subject.findById(subject)
    if (!isSubjetExist) {
      return errorRespone(res, 404, 0, 'error', 'Không tìm thấy bộ môn này!')
    }
    userExists.userId = userId
    userExists.name = name
    userExists.department = department
    userExists.subject = subject
    userExists.role = role
    userExists.email = email
    userExists.phone = phone
    userExists.address = address

    await userExists.save()
    return res.send({
      code: 1,
      msg: 'success',
      message: 'Đã cập nhật người dùng!',
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

// @desc   Update password for user
// @route  Put /api/user/password
// @access Public
const updateUserPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const token = req.headers.authorization.split(' ')[1]
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  const user = await User.findById(decoded.id)

  // Check current password match password in database
  if (!(await user.matchPassword(currentPassword))) {
    return errorRespone(res, 401, 0, 'error', 'Mật khẩu hiện tại không đúng!')
  }

  // upadate password
  try {
    user.password = newPassword
    user.isPasswordChanged = true
    await user.save()
    return res.status(200).json({
      code: 1,
      msg: 'success',
      message: 'Cập nhật mật khẩu thành công!',
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

// @desc   Update profile for user
// @route  Put /api/user/me
// @access Protect
const getProfileMe = asyncHandler(async (req, res) => {
  return res.status(200).json({
    code: 1,
    msg: 'success',
    message: 'Thông tin hồ sơ cá nhân!',
    data: {
      profile: req.user,
    },
  })
})

// @desc   Update profile for user
// @route  Put /api/user/updateprofile
// @access Public
const updateProfileUser = asyncHandler(async (req, res) => {
  try {
    const { phone, address, email } = req.body
    if (email !== req.user.email) {
      const isEmailExists = await User.exists({ email })
      if (isEmailExists) {
        return errorRespone(res, 409, 1, 'error', 'Email này đã tồn tại!')
      }
    }
    // update profile user
    await User.findByIdAndUpdate(req.user._id, {
      phone,
      address,
      email,
    })
    return res.status(200).json({
      code: 1,
      msg: 'success',
      message: 'Cập nhật thành công!',
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})
// @desc   Update avatar for user
// @route  Put /api/user/avatar
// @access protect
const updateAvatar = asyncHandler(async (req, res) => {
  try {
    const uploader = async (path) => await uploads(path, 'Avatars')
    const newPath = await uploader(req.file.path)
    const user = await User.findById(req.user._id)
    user.avatar = newPath.url
    await user.save()
    res.status(200).json({
      code: 1,
      msg: 'success',
      message: 'Cập nhật hình thành công',
      data: newPath,
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

// @desc   Forgot password
// @route  POST /api/password/forgot-password
// @access Public
const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body
    //check if user not exists
    const userExists = await User.findOne({ userId })
    if (!userExists) {
      return errorRespone(
        res,
        404,
        0,
        'error',
        'Không tìm thấy người dùng này!'
      )
    }
    //create OTP number
    const OTPStr = Math.floor(100000 + Math.random() * 900000).toString()
    //check otp exist
    const otpExists = await Otps.findOne({ user: userExists._id })
    //If it exists, update it else create it
    if (otpExists) {
      otpExists.otp = OTPStr
      otpExists.expirationTime = moment().add(15, 'minutes')
      otpExists.save()
    } else {
      await Otps.create({
        user: userExists._id,
        otp: OTPStr,
        expirationTime: moment().add(15, 'minutes'),
      })
    }
    // sendMail
    await sendMail(
      userExists.email,
      'Xác minh đổi mật khẩu',
      OTPStr,
      resHtmlForgotPassword({ name: userExists.name, otp: OTPStr })
    )
    res.status(200).json({
      code: 1,
      msg: 'success',
      message: 'Gửi mail thành công',
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})
// @desc   check Otp
// @route  POST /api/password/check-otp
// @access Public

const checkOtp = asyncHandler(async (req, res) => {
  try {
    const { userId, otp } = req.body
    //check if user not exists
    const userExists = await User.findOne({ userId })
    if (!userExists) {
      return errorRespone(
        res,
        404,
        0,
        'error',
        'Không tìm thấy người dùng này!'
      )
    }
    const otpExists = await Otps.findOne({
      user: userExists._id,
      otp: otp,
      expirationTime: { $gt: Date.now() },
    })
    if (!otpExists) {
      return errorRespone(
        res,
        404,
        0,
        'error',
        'OTP của bạn đã nhập không đúng hoặc đã hết hạn!'
      )
    }
    res.status(200).json({
      code: 1,
      msg: 'success',
      message: 'OTP chính xác!',
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})
// @desc   Change password with Otp
// @route  POST /api/password/change-pass-otp
// @access Public
const changePassWithOTP = asyncHandler(async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body
    //check if user not exists
    const userExists = await User.findOne({ userId })
    if (!userExists) {
      return errorRespone(
        res,
        404,
        0,
        'error',
        'Không tìm thấy người dùng này!'
      )
    }
    const otpExists = await Otps.findOne({
      user: userExists._id,
      otp: otp,
      expirationTime: { $gt: Date.now() },
    })
    if (!otpExists) {
      return errorRespone(
        res,
        404,
        0,
        'error',
        'OTP của bạn đã nhập không đúng hoặc đã hết hạn!'
      )
    }
    await otpExists.delete()
    userExists.password = newPassword
    userExists.isPasswordChanged = true
    await userExists.save()
    return res.status(200).json({
      code: 1,
      msg: 'success',
      message: 'Cập nhật mật khẩu thành công!',
    })
  } catch (error) {
    return errorRespone(res, 400, 0, 'error', error)
  }
})

export {
  getUsers,
  authAdmin,
  authStaff,
  createUser,
  updateUser,
  updateUserPassword,
  updateProfileUser,
  getProfileMe,
  updateAvatar,
  forgotPassword,
  checkOtp,
  changePassWithOTP,
}
