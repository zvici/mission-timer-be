import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Department',
    },
    role: {
      type: String,
      enum: ['ADMIN', 'ACADEMIC_STAFF', 'STAFF'],
      required: true,
      default: 'STAFF',
    },
    email: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    isPasswordChanged: {
      type: Boolean,
      default: false,
    },
    phone: String,
    address: String,
    avatar: String,
  },
  { timestamps: true }
)

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const Users = mongoose.model('Users', userSchema)

export default Users
