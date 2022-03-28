import mongoose from "mongoose";

const activityTypeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    estimatedTime: {
      type: Number,
      required: true,
    },

    rollUp: {
      type: String,
      enum: ["STAFF", "ACADEMIC_STAFF"],
      required: true,
      default: "ACADEMIC_STAFF",
    },

    description: String,
  },
  {
    timestamps: true,
  }
);

const ActivityTypes = mongoose.model('ActivityTypes', activityTypeSchema)

export default ActivityTypes
