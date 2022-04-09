import mongoose from 'mongoose'

const yearSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    description: String,
  },
  { timestamps: true }
)

const Year = mongoose.model('Year', yearSchema)

export default Year
