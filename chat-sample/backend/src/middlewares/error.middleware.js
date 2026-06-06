import { STATUS } from '../constants/httpStatus.js'
import logger from '../utils/logger.js'

const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err

    if (!statusCode) {
        statusCode = STATUS.SERVER_ERROR
    }

    logger.error(`Error: ${message} | StatusCode: ${statusCode} | Path: ${req.originalUrl}`, {
        stack: err.stack,
    })

    const response = {
        success: false,
        statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        errors: err.errors || []
    }

    res.status(statusCode).json(response)
}

export default errorHandler
