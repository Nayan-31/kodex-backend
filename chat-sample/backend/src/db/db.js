import mongoose from 'mongoose'
import logger from '../utils/logger.js'

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app')
        logger.info(`MongoDB connected successfully! DB host: ${connectionInstance.connection.host}`)
    } catch (error) {
        logger.error(`MongoDB connection error: ${error.message}`)
        process.exit(1)
    }
}

export default connectDB
