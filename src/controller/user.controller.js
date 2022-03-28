import asyncHandler from 'express-async-handler'
import User from '../models/user.model.js'
import generateToken from '../utils/generateToken.js'

// @desc   Auth admin and get token
// @route  POST /api/users/login
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

// @desc   Auth staff and get token
// @route  POST /api/users/staff/login
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
// @route  Get /api/users/
// @access Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({
    createdAt: -1,
  })

  if (users) {
    res.send({
      code: 0,
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

export { getUsers, authAdmin, authStaff }
