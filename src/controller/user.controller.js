import asyncHandler from 'express-async-handler'
import User from '../models/user.model.js'
import generator from 'generate-password'
import generateToken from '../utils/generateToken.js'

// @desc   Create one user
// @route  Post /api/users/
// @access Admin

const createUser = asyncHandler(async (req, res) => {
  const userIdExist = await User.findOne({
    userId: req.body.userId,
  })
  if (userIdExist) {
    res.status(400)
    throw Error(JSON.stringify({ code: 0, message: 'User ID already exist' }))
  }
  // check user is already in database
  const emailExist = await User.findOne({ email: req.body.email })
  if (emailExist) {
    res.status(400)
    throw Error(JSON.stringify({ code: 0, message: 'Email already exist' }))
  }

  // create random password
  const randomPassword = generator.generate({
    length: 8,
    numbes: true,
  })
})
