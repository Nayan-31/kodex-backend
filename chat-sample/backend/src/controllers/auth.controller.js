import asyncHandler from '../utils/asyncHandler.js'
import ApiResponse from '../utils/ApiResponse.js'
import { STATUS } from '../constants/httpStatus.js'
import { MESSAGES } from '../constants/messages.js'
import { registerUser, loginUser } from '../services/auth.service.js'
import { generateToken } from '../helpers/token.helper.js'

export const register = asyncHandler(async (req, res) => {
    const user = await registerUser(req.body)

    const token = generateToken(user._id)

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }

    return res
        .status(STATUS.CREATED)
        .cookie("token", token, cookieOptions)
        .json(
            new ApiResponse(
                STATUS.CREATED,
                { user, token },
                MESSAGES.REGISTER_SUCCESS
            )
        )
})

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await loginUser(email, password)

    const token = generateToken(user._id)

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }

    return res
        .status(STATUS.OK)
        .cookie("token", token, cookieOptions)
        .json(
            new ApiResponse(
                STATUS.OK,
                { user, token },
                MESSAGES.LOGIN_SUCCESS
            )
        )
})
