import { Server } from 'socket.io'

const userSocketMap = {}

export default function initSocketServer(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    })

    io.on('connection', (socket) => {
        console.log("a user connected", socket.id)

        // The user joins a room based on the chat ID when they open a chat window (for Groups)
        const { room } = socket.handshake?.query || {}
        if (room) {
            socket.join(room)
        }

        // 1-to-1 User Registration
        socket.on("registeredUser", (userId) => {
            userSocketMap[userId] = socket.id
            console.log("Registered user for 1-to-1:", userId)
        })

        socket.on("PrivateMessage", (msgData) => {
            // Check if it's a Group Chat or a 1-to-1 Chat
            if (msgData.chat?.isGroupChat) {
                // Group Chat: Broadcast to the virtual room
                const roomId = msgData.chat._id || msgData.chat
                console.log(`Group Message: Broadcasting to virtual room ${roomId}`)
                socket.to(roomId).emit("PrivateMessage", msgData)
            } else {
                // 1-to-1 Chat: Use the direct Switchboard targeting
                const targetUserId = msgData.userId
                const targetSocketId = userSocketMap[targetUserId]
                console.log(`1-to-1 Message: Sending directly to user ${targetUserId}`)
                
                if (targetSocketId) {
                    io.to(targetSocketId).emit("PrivateMessage", msgData)
                }
            }
        })

        socket.on('disconnect', () => {
            // Clean up 1-to-1 mapping
            for (const userId in userSocketMap) {
                if (userSocketMap[userId] === socket.id) {
                    delete userSocketMap[userId]
                    break;
                }
            }
            console.log("user disconnected:", socket.id)
        })
    })
}