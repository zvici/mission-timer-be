import mongoose from 'mongoose'

const activityDetailSchema = mongoose.Schema({
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Activities',
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  description: {
    type: String,
    default: '',
  },
  quota: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    require: true,
    enum: ['accept', 'refuse', 'attended', 'notAnswered', 'notEngaged'],
    default: 'notAnswered',
  },
  image: {
    type: String,
    default: '',
  },
  comments: {
    type: String,
    default: '',
  },
  taskMasterComment: {
    type: String,
    default: '',
  },
})

const ActivityDetail = mongoose.model('ActivityDetail', activityDetailSchema)

export default ActivityDetail
