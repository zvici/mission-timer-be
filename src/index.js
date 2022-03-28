import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import connectDB from './config/db.js'
import swaggerUi from 'swagger-ui-express'
import cors from 'cors'
import swaggerDocument from '../swagger.json'
import routes from './routes'
import colors from 'colors'

dotenv.config()
connectDB();

// middlewares
const app = express();
app.use(morgan('combined'))
app.use(express.json())
app.use(cors())

// routes
// app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// app.use('/api/auth', routes.auth)
// app.use('/api/user', routes.user)
// app.use('/api/department', routes.department)
// app.use('/api/year', routes.year)
// app.use('/api/subject', routes.subject)
// app.use('/api/otp', routes.otp)
// app.use('/api/activity-type', routes.activityType)
// app.use('/api/activity', routes.activity)

app.get('/', (req, res) => {
  res.send('API mission timer')
})

app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
})
