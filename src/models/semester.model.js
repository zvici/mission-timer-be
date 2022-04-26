import mongoose from 'mongoose'

const semesterSchema = mongoose.Schema(
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
    year: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Year',
    },
    description: {
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

const Semester = mongoose.model('Semester', semesterSchema)

export default Semester
