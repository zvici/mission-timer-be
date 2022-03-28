import mongoose from "mongoose";

const activityDetailSchema = mongoose.Schema(
  {
    activity: {
      type: String,
      required: true,
    },

    startDate: Date,
    endDate: Date,
    content: String,
    image: String,
  },
  { timestamps: true }
);

const ActivityDetails = mongoose.model('ActivityDetails', activityDetailSchema)

export default ActivityDetails
