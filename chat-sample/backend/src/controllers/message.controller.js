import asyncHandler from '../utils/asyncHandler.js'
import ApiResponse from '../utils/ApiResponse.js'
import { STATUS } from '../constants/httpStatus.js'
import { MESSAGES } from '../constants/messages.js'
import { sendMessage as sendMessageService, fetchMessages as fetchMessagesService } from '../services/message.service.js'

export const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body

    const message = await sendMessageService(chatId, content, req.user._id)

    return res.status(STATUS.CREATED).json(
        new ApiResponse(
            STATUS.CREATED,
            message,
            MESSAGES.MESSAGE_SENT
        )
    )
})

export const fetchMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params

    const messages = await fetchMessagesService(chatId)

    return res.status(STATUS.OK).json(
        new ApiResponse(
            STATUS.OK,
            messages,
            MESSAGES.MESSAGE_FETCHED
        )
    )
})
