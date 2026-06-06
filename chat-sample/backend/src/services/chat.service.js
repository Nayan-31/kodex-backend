import { Chat } from '../models/chat.model.js'
import { User } from '../models/user.model.js'
import ApiError from '../utils/ApiError.js'
import { STATUS } from '../constants/httpStatus.js'

export const accessChat = async (userId, loggedInUserId) => {
    if (!userId) {
        throw new ApiError(STATUS.BAD_REQUEST, "UserId parameter is required")
    }

    // We use $elemMatch to precisely find a chat array that contains BOTH the logged-in user and the target user.
    // This prevents creating duplicate 1-on-1 chats if they already talked before.
    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: loggedInUserId } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    })
    .populate("users", "-password") // Populate replaces the User IDs with actual User details (name, email)
    .populate("latestMessage") // Also fetch the content of the most recent message so we can show it in the UI

    // We do a second population to get the details of the user who sent that latestMessage
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "username email"
    })

    if (isChat.length > 0) {
        return isChat[0]
    } else {
        // If they never talked, create a brand new chat document
        const chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [loggedInUserId, userId]
        }

        try {
            const createdChat = await Chat.create(chatData)
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password")
            return fullChat
        } catch (error) {
            throw new ApiError(STATUS.SERVER_ERROR, "Error creating chat")
        }
    }
}

export const fetchChats = async (loggedInUserId) => {
    try {
        // Find all chats where the currently logged-in user is part of the "users" array
        let results = await Chat.find({ users: { $elemMatch: { $eq: loggedInUserId } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 }) // Sort them from newest to oldest so recent chats appear at the top

        // Get sender details for the latest message in each chat
        results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "username email"
        })

        return results
    } catch (error) {
        throw new ApiError(STATUS.SERVER_ERROR, "Error fetching chats")
    }
}
