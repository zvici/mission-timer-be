import mongoose from 'mongoose'

const activitySchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    quota: {
      type: String,
      default: '',
    },
    content: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Content',
    },
    year: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Year',
    },
    type: {
      type: String,
      enum: ['STAFF', 'MINISTRY', 'MONITOR_EXAM'],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)
const Activities = mongoose.model('Activities', activitySchema)

export default Activities
