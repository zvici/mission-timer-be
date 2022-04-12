import asyncHandler from 'express-async-handler'
import User from '../models/user.model.js'
import generateToken from '../utils/generateToken.js'
import jwt from 'jsonwebtoken'
import errorRespone from '../utils/errorRespone.js'
import formidable from 'formidable'
import cloudinary from '../config/cloudinary.config.js'
import uploads from '../config/cloudinary.config.js'

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
  const users = await User.find().sort({
    createdAt: -1,
  })

  if (users) {
    res.send({
      code: 1,
      msg: 'success',
      message: 'List all user',
      data: users,
    })
  } else {
    return res.status(401).json({
      code: 0,
      msg: 'error',
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
    })
  }
})

// @desc   Creat user
// @route  Post /api/users/
// @access Admin
const createUser = asyncHandler(async (req, res) => {
  const { userId } = req.body
  const isUserExist = users.findOne({ userId })
  if (isUserExist) {
    return res.status(400).json({
      code: 0,
      msg: 'error',
      message: 'User đã tồn tại!',
    })
  }
  const user = await User.save(req.body)
  if (user) {
    res.send({
      code: 1,
      msg: 'success',
      message: 'Tạo user thành công!',
      data: user,
    })
  } else {
    return res.status(401).json({
      code: 0,
      msg: 'error',
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
    })
  }
})

// @desc   Update user
// @route  PUT /api/users/
// @access Admin

const updateUser = asyncHandler(async (req, res) => {
  if (req.body) {
    let user = await User.findById(req.params.id)
    if (user) {
      let updateUser = await user.save()
      res.send({
        code: 1,
        msg: 'success',
        message: 'Successfully update user',
        data: updateUser,
      })
    } else {
      return res.status(404).json({
        code: 0,
        msg: 'error',
        message: 'Không tìm thấy user!',
      })
    }
  } else {
    return res.status(401).json({
      code: 0,
      msg: 'error',
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau!',
    })
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
    // check email exists
    const isEmailExists = User.exists({ email })
    if (isEmailExists && email != req.user.email) {
      return errorRespone(res, 409, 1, 'error', 'Email này đã tồn tại!')
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

const updateAvatar = asyncHandler(async (req, res) => {
  try {
    const uploader = async (path) => await uploads(path, 'Images')
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
}
