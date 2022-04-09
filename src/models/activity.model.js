import mongoose from 'mongoose'

const activitySchema = mongoose.Schema(
  {
    year: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Year',
    },
    content: {
      type: String,
      required: true,
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
    quota: {
      type: String,
      required: true,
    },
    rollUpType: {
      type: String,
      enum: ['STAFF', 'ACADEMIC_STAFF'],
      required: true,
    },
    status: {
      type: String,
      default: "active",
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
)
const Activities = mongoose.model('Activities', activitySchema)

export default Activities
