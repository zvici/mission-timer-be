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
  },
  { timestamps: true }
)

const Notification = mongoose.model('Notification', notificationSchema)

export default Year
