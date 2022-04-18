import mongoose from 'mongoose'

const commentSchema = mongoose.Schema(
  {
    participants: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Participants',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const Comment = mongoose.model('Comment', commentSchema)

export default Comment
