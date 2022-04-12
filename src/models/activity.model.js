import mongoose from 'mongoose'

const activitySchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    year: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Year',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    taskMaster: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    location: {
      type: String,
      default: '',
    },
    quota: {
      type: Number,
      required: true,
    },
    rollUpType: {
      type: String,
      enum: ['STAFF', 'ACADEMIC_STAFF', 'MONITOR_EXAM'],
      required: true,
    },
    status: {
      type: String,
      default: 'active',
    },
  },
  { timestamps: true }
)
const Activities = mongoose.model('Activities', activitySchema)

export default Activities
