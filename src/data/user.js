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
    departmentId: 'CNTT',
  },
  {
    name: 'Phúc Hồ',
    userId: '00001',
    password: bcrypt.hashSync('123456', 10),
    role: 'STAFF',
    email: 'nhatranthanh117@gmail.com',
    phone: '0334446611',
    address: 'Bình Dương',
    departmentId: 'CNTT',
  },
]

export default users
