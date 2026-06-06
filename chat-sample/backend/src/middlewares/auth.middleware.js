import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'
import { STATUS } from "../constants/httpStatus.js"
import { MESSAGES } from "../constants/messages.js"

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1]

        if (!token) {
            return res.status(STATUS.NOT_FOUND).json({
                message: MESSAGES.INVALID_TOKEN
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_dev_key_only')

        if (!decoded) {
            return res.status(STATUS.UNAUTHORIZED).json({
                message: MESSAGES.UNAUTHORIZED
            })
        }

        let user = await User.findById(decoded.userId)
        
        if (!user) {
            return res.status(STATUS.NOT_FOUND).json({
                message: MESSAGES.USER_NOT_FOUND
            })
        }

        req.user = user

        next()

    } catch (error) {
        console.log(error)
        return res.status(STATUS.SERVER_ERROR).json({
            message: MESSAGES.MIDDLEWARE_ERR
        })
    }
}
