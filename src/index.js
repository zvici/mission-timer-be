import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import connectDB from './config/db.js'
import swaggerUi from 'swagger-ui-express'
import { readFile } from 'fs/promises'

import cors from 'cors'
import colors from 'colors'

const swaggerDocument = JSON.parse(
  await readFile(new URL('./config/swagger.json', import.meta.url))
)

import userRoutes from './routes/userRoutes.js'
import yearRoutes from './routes/yearRoutes.js'
import activityRoutes from './routes/activityRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import statisticalRoutes from './routes/statisticalRoutes.js'
import contentRoutes from './routes/contentRoutes.js'
import semesterRoutes from './routes/semesterRouter.js'
import participantRoutes from './routes/participantRoutes.js'

dotenv.config()
connectDB()

// middlewares
const app = express()
app.use(morgan('combined'))
app.use(express.json())
app.use(cors())

app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
  })
)

// Use router

app.use('/api/user', userRoutes)
app.use('/api/semester', semesterRoutes)
app.use('/api/year', yearRoutes)
app.use('/api/content', contentRoutes)
app.use('/api/statistical', statisticalRoutes)
app.use('/api/activity', activityRoutes)
app.use('/api/task', taskRoutes)
app.use('/api/participant', participantRoutes)

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
