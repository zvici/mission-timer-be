import mongoose from 'mongoose'

const taskSchema = mongoose.Schema(
  {
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Activities',
    },
    description: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
    },
    endDate: { type: Date },
    officeHours: {
      type: Number,
      default: 0,
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

const Task = mongoose.model('Task', taskSchema)

export default Task
