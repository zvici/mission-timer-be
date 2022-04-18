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
    year: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Year',
    },
    type: {
      type: String,
      enum: ['STAFF', 'ACADEMIC_STAFF', 'MONITOR_EXAM'],
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
