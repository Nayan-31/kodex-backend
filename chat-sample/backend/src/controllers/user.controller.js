import { User } from '../models/user.model.js'
import asyncHandler from '../utils/asyncHandler.js'
import ApiResponse from '../utils/ApiResponse.js'
import { STATUS } from '../constants/httpStatus.js'

export const getAllUsers = asyncHandler(async (req, res) => {
    // Fetch all users EXCEPT the currently logged-in user
    const users = await User.find({ _id: { $ne: req.user._id } }).select("-password")

    return res.status(STATUS.OK).json(
        new ApiResponse(
            STATUS.OK,
            users,
            "Users fetched successfully"
        )
    )
})
