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
    description: String,
  },
  { timestamps: true }
)

const Semester = mongoose.model('Semester', semesterSchema)

export default Semester
