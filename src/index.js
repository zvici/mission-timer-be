import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import connectDB from './config/db.js'
import swaggerUi from 'swagger-ui-express'
import cors from 'cors'
import colors from 'colors'

import userRoutes from './routes/userRoutes.js'

dotenv.config()
connectDB()

// middlewares
const app = express()
app.use(morgan('combined'))
app.use(express.json())
app.use(cors())

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup('../swagger.json'))

// app.use('/api/auth', routes.auth)
app.use('/api/user', userRoutes)
// app.use('/api/department', routes.department)
// app.use('/api/year', routes.year)
// app.use('/api/subject', routes.subject)
// app.use('/api/otp', routes.otp)
// app.use('/api/activity-type', routes.activityType)
// app.use('/api/activity', routes.activity)

app.get('/', (req, res) => {
  res.send({
    message: 'Welcome to Api Mission timer',
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(
    `🚝 Server running in ${process.env.NODE_ENV} mode on port ${PORT}, click to http://localhost:${PORT}`
      .yellow.bold
  )
})
