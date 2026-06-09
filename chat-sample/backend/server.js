import dotenv from "dotenv"
import app from "./src/app.js"
import { createServer } from 'http'
import initSocketServer from "./src/sockets/socket.server.js"
import connectDB from "./src/db/db.js"

dotenv.config({
    path: "./env"
})

const httpServer = createServer(app)
initSocketServer(httpServer)

const port = process.env.PORT || 8000

// Initialize Database connection then start server
connectDB().then(() => {
    httpServer.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
}).catch((err) => {
    console.error("MongoDB connection failed!", err)
})
