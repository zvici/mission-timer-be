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
      validate: {
        validator: function (v) {
          var re = /\b\d{5}\b/
          return re.test(v)
        },
        message: 'is invalid.',
      },
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Departments',
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
    },
    role: {
      type: String,
      enum: ['ADMIN', 'MINISTRY', 'STAFF'],
      required: true,
      default: 'STAFF',
    },
    email: {
      type: String,
      required: true,
      unique: true,
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
    updatePasswordAt: {
      type: Date,
    },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          var re = /\b\d{10}\b/
          return re.test(v)
        },
        message: 'is invalid.',
      },
    },
    address: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    devices: {
      type: Array,
      default: [''],
    },
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

const User = mongoose.model('User', userSchema)

export default User
