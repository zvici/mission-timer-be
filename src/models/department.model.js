import mongoose from "mongoose";

const departmentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: String,
    phone: String,
    address: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

const Departments = mongoose.model('Departments', departmentSchema)

export default Departments
