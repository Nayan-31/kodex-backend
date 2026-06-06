import { Message } from '../models/message.model.js'
import { Chat } from '../models/chat.model.js'
import { User } from '../models/user.model.js'
import ApiError from '../utils/ApiError.js'
import { STATUS } from '../constants/httpStatus.js'

export const sendMessage = async (chatId, content, senderId) => {
    if (!content || !chatId) {
        throw new ApiError(STATUS.BAD_REQUEST, "Invalid data passed into request")
    }

    // Step 1: Prepare the new message object
    const newMessage = {
        sender: senderId,
        content: content,
        chat: chatId
    }

    try {
        // Step 2: Save the message into the database
        let message = await Message.create(newMessage)

        // Step 3: Populate sender details and the chat it belongs to
        // This makes sure the frontend gets all the info it needs immediately to render the message
        message = await message.populate("sender", "username email")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: "chat.users",
            select: "username email"
        })

        // Step 4: Update the Chat document's "latestMessage" field to point to this new message
        // This makes it easy for the sidebar to quickly load the last text sent without scanning all messages!
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id })

        return message
    } catch (error) {
        throw new ApiError(STATUS.SERVER_ERROR, "Error saving message")
    }
}

export const fetchMessages = async (chatId) => {
    try {
        // Grab all messages that belong to a specific chat room
        const messages = await Message.find({ chat: chatId })
            .populate("sender", "username email") // Fetch sender details so we can show their name next to the text
            .populate("chat")

        return messages
    } catch (error) {
        throw new ApiError(STATUS.SERVER_ERROR, "Error fetching messages")
    }
}
