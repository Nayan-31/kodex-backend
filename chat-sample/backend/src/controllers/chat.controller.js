import asyncHandler from '../utils/asyncHandler.js'
import ApiResponse from '../utils/ApiResponse.js'
import { STATUS } from '../constants/httpStatus.js'
import { MESSAGES } from '../constants/messages.js'
import { accessChat as accessChatService, fetchChats as fetchChatsService } from '../services/chat.service.js'

export const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body

    const chat = await accessChatService(userId, req.user._id)

    return res.status(STATUS.OK).json(
        new ApiResponse(
            STATUS.OK,
            chat,
            MESSAGES.CHAT_FETCHED
        )
    )
})

export const fetchChats = asyncHandler(async (req, res) => {
    const chats = await fetchChatsService(req.user._id)

    return res.status(STATUS.OK).json(
        new ApiResponse(
            STATUS.OK,
            chats,
            MESSAGES.CHAT_FETCHED
        )
    )
})
