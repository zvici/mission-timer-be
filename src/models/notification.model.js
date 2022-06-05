import mongoose from 'mongoose'

const notificationSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    data: {
      type: Object,
    },
    content: {
      type: String,
    },
    seen: {
      type: Boolean,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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

const Notification = mongoose.model('Notification', notificationSchema)

export default Notification
