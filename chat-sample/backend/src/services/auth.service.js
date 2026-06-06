import { User } from '../models/user.model.js'
import ApiError from '../utils/ApiError.js'
import { STATUS } from '../constants/httpStatus.js'
import { MESSAGES } from '../constants/messages.js'

export const registerUser = async (userData) => {
    const { username, email, password } = userData

    // Check if a user with this email or username already exists in the database
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existingUser) {
        throw new ApiError(STATUS.CONFLICT, MESSAGES.USER_ALREADY_EXISTS)
    }

    // Create the new user object
    const user = await User.create({
        username,
        email,
        password
    })

    // Fetch the newly created user but EXCLUDE their password (-password)
    // We never want to send the password hash back to the frontend for security reasons!
    const createdUser = await User.findById(user._id).select('-password')

    if (!createdUser) {
        throw new ApiError(STATUS.SERVER_ERROR, "Something went wrong while registering the user")
    }

    return createdUser
}

export const loginUser = async (email, password) => {
    // Find the user by their email address
    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(STATUS.NOT_FOUND, MESSAGES.USER_NOT_FOUND)
    }

    // Compare the plain text password from the login form with the hashed password in the DB
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(STATUS.UNAUTHORIZED, MESSAGES.INVALID_CREDENTIALS)
    }

    // Once authenticated, fetch their details again without the password
    const loggedInUser = await User.findById(user._id).select('-password')

    return loggedInUser
}
