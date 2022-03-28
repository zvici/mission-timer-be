import mongoose from 'mongoose'
import dotenv from 'dotenv'
import color from 'colors'

import users from './data/user.js'
import User from './models/user.model.js'
import departments from './data/department.js'
import Departments from './models/department.model.js'

import connectDB from './config/db.js'

dotenv.config()

connectDB()

const importData = async () => {
  try {
    await User.deleteMany()
    const createdUsers = await User.insertMany(users)

    await Departments.deleteMany()
    await Departments.insertMany(departments)

    const adminUser = createdUsers[0]._id
    console.log('💎 Data Imported!'.green.inverse)
    process.exit()
  } catch (error) {
    console.log(`❗ ${error}`.red.inverse)
    process.exit(1)
  }
}
const destroyData = async () => {
  try {
    await User.deleteMany()
    await Departments.deleteMany()
    console.log('🧨 Data Destroyed!'.red.inverse)
    process.exit()
  } catch (error) {
    console.log(`❗ ${error}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
