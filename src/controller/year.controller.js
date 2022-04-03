import asyncHandler from 'express-async-handler'
import Years from '../models/year.model.js'

// @desc   Create one Year
// @route  POST /api/year
// @access Admin
const createYear = asyncHandler(async (req, res) => {
  const { name, startDate, endDate, description } = req.body

  try{
    const year = await new Years({
      name,
      startDate,
      endDate,
      description
    })
    const newYear = await year.save()
    res.send({
      code: 1,
      msg: 'success',
      message: 'Tạo year thành công!',
      data: {
        year: newYear
      },
    })
  }catch(error){
    return errorRespone(res, 400, 1, 'error', error)
  }
})

export { createYear }
