import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/user.model.js'

const protect = asyncHandler(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id).select('-password')
      if (!req.user.isActive) {
        return res.status(403).json({
          code: 0,
          msg: 'error',
          message: 'Unauthorized',
        })
      }
      next()
    } catch {
      return res.status(401).json({
        code: 0,
        msg: 'error',
        message: 'Not Authorized, token failed',
      })
    }
  }
  if (!token) {
    return res.status(401).json({
      code: 0,
      msg: 'error',
      message: 'Not Authorized, token failed',
    })
  }
})

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next()
  } else {
    return res.status(401).json({
      code: 0,
      msg: 'error',
      message: 'Not authorized as an ADMIN',
    })
  }
}

const ministry = (req, res, next) => {
  if (req.user && req.user.role === 'MINISTRY') {
    next()
  } else {
    return res.status(401).json({
      code: 0,
      msg: 'error',
      message: 'Not authorized as an MINISTRY',
    })
  }
}

export { protect, admin, ministry }
