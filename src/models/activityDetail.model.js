import mongoose from 'mongoose'

const activitySchema = mongoose.Schema(
  {
    activityType: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    taskMaster: {
      type: String,
      required: true,
    },

    assignee: {
      type: String,
      required: true,
    },

    quota: {
      type: String,
      required: true,
    },

    year: {
      type: String,
      required: true,
    },

    specifiedTime: Number,
    status: String,
    description: String,
  },
  { timestamps: true }
)
const Activities = mongoose.model('Activities', activitySchema)

export default Activities
