import multer from 'multer'
import path from 'path'

const __dirname = path.resolve()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'src/uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
  },
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    //reject file
    cb(
      {
        message: 'Unsupported file format',
      },
      false
    )
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
})

export default upload
