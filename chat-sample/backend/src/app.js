import express from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import limiter from './middlewares/rateLimit.middleware.js'
import errorHandler from './middlewares/error.middleware.js'
import authRoutes from './routes/auth.routes.js'
import chatRoutes from './routes/chat.routes.js'
import messageRoutes from './routes/message.routes.js'

const __fileName = fileURLToPath(import.meta.url) //extracts the absolute local file system path
const __dirname = path.dirname(__fileName) //directory name

const app = express()

// Global Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(limiter)

// Middleware to serve static files from 'public' directory
app.use(express.static(path.join(__dirname, "..", "public")))

// Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/chats', chatRoutes)
app.use('/api/v1/messages', messageRoutes)

// Global Error Handler Middleware
app.use(errorHandler)

export default app
