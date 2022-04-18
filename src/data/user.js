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
  {
    name: 'Phan Thị Hồng Nhi',
    userId: '00002',
    password: bcrypt.hashSync('123456', 10),
    role: 'ACADEMIC_STAFF',
    email: 'hongnhi@gmail.com',
    phone: '0334664242',
    address: 'TP HCM',
  },
  {
    name: 'Phúc Hồ',
    userId: '00001',
    password: bcrypt.hashSync('1234567', 10),
    role: 'STAFF',
    email: 'phucho@gmail.com',
    phone: '0334446611',
    address: 'Bình Dương',
  },
  {
    name: 'Hoàng Linh Nhi',
    userId: '00003',
    password: bcrypt.hashSync('123456', 10),
    role: 'STAFF',
    email: 'linhnhi@gmail.com',
    phone: '0334664242',
    address: 'TP HCM',
  },
  {
    name: 'Vũ Phương Thảo',
    userId: '00004',
    password: bcrypt.hashSync('123456', 10),
    role: 'STAFF',
    email: 'phuongthao@gmail.com',
    phone: '0334664242',
    address: 'TP HCM',
  },
  {
    name: 'Vũ Phương Thảo',
    userId: '00004',
    password: bcrypt.hashSync('123456', 10),
    role: 'STAFF',
    email: 'phuongthao@gmail.com',
    phone: '0334664242',
    address: 'TP HCM',
  },
  {
    name: 'Huyền Trang',
    userId: '00005',
    password: bcrypt.hashSync('123456', 10),
    role: 'STAFF',
    email: 'huyentrang@gmail.com',
    phone: '0334664242',
    address: 'TP HCM',
  },
]

export default users
