import asyncHandler from 'express-async-handler'
import Content from '../models/content.model.js'
import errorRespone from '../utils/errorRespone.js'

// @desc   Create one content
// @route  POST /api/content
// @access Academic staff
const createContent = asyncHandler(async (req, res) => {
  try {
    const { title, description } = req.body
    const content = await new Content({
      title,
      description,
      createdBy: req.user._id,
    })
    const newContent = await content.save()
    res.send({
      code: 1,
      msg: 'success',
      message: 'Đã tạo nội dung!',
      data: {
        content: newContent,
      },
    })
  } catch (err) {
    return errorRespone(res, 400, 0, 'error', err)
  }
})
// @desc   get list contents
// @route  GET /api/content
// @access Academic staff
const getContents = asyncHandler(async (req, res) => {
  try {
    const contents = await Content.find({})
    res.send({
      code: 1,
      msg: 'success',
      message: 'Danh sách nội dung công tác',
      data: {
        contents,
      },
    })
  } catch (err) {
    return errorRespone(res, 400, 0, 'error', err)
  }
})

// @desc   update one content
// @route  PUT /api/content/:id
// @access Academic staff
const updateContent = asyncHandler(async (req, res) => {
  try {
    const { title, description } = await Content.find
    const isContentExist = await Content.findById(res.params.id)
    if (!isContentExist) {
      return errorRespone(
        res,
        404,
        0,
        'error',
        'Không tìm thấy nội dung hoạt động này!'
      )
    }

    isContentExist.title = title
    isContentExist.description = description
    isContentExist.createdBy = req.user._id
    const updateContent = await isContentExist.save()
    res.send({
      code: 1,
      msg: 'success',
      message: 'Đã cập nhật nội dung công tác',
      data: {
        content: updateContent,
      },
    })
  } catch (err) {
    return errorRespone(res, 400, 0, 'error', err)
  }
})

// @desc   delete one content
// @route  DELETE /api/content/:id
// @access Academic staff
const deleteContent = asyncHandler(async (req, res) => {
  try {
    const isContentExist = await Content.findById(res.params.id)
    if (!isContentExist) {
      return errorRespone(
        res,
        404,
        0,
        'error',
        'Không tìm thấy nội dung hoạt động này!'
      )
    }
    await Content.deleteOne({ id: res.params.id })
    res.send({
      code: 1,
      msg: 'success',
      message: 'Đã xóa nội dung công tác này',
    })
  } catch (err) {
    return errorRespone(res, 400, 0, 'error', err)
  }
})

export { createContent, getContents, deleteContent, updateContent }
