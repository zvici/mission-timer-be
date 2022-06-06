import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Thanh Nhã',
    userId: '00000',
    password: bcrypt.hashSync('123456', 10),
    role: 'ADMIN',
    email: 'nhatranthanh113@gmail.com',
    phone: '0334664242',
    address: 'TP HCM',
  },
]

export default users
