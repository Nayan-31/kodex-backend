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
import userRoutes from './routes/user.routes.js'

const __fileName = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__fileName)

const app = express()

// Enable CORS
app.use(cors({
    origin: "http://localhost:5173", // Vite default port
    credentials: true
}))

// Middleware to parse JSON request bodies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Apply rate limiting to all requests
app.use(cookieParser())
app.use(limiter)
// Middleware to serve static files from 'public' directory
app.use(express.static(path.join(__dirname, "..", "public")))

// Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/chats', chatRoutes)
app.use('/api/v1/messages', messageRoutes)

// Global Error Handler Middleware
app.use(errorHandler)

export default app
