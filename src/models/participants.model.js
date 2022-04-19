import mongoose from 'mongoose'

const participantsSchema = mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    status: {
      type: String,
      require: true,
      enum: ['accept', 'refuse', 'notAnswered'],
      default: 'notAnswered',
    },
    isApprove: {
      type: Boolean,
      default: false,
    },
    confirmBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    image: {
      type: String,
      default: '',
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
const Participants = mongoose.model('Participants', participantsSchema)

export default Participants
