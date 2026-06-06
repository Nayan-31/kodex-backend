import { Server } from 'socket.io'

const userSocketMap = {}

export default function initSocketServer(httpServer) {
    const io = new Server(httpServer)

    io.on('connection', (socket) => {
        console.log("a user connected")

        const { room } = socket.handshake?.query || {}
        if (room) {
            console.log(`user connected using room ${room}`)
            socket.join(room)
        }

        socket.on("registeredUser", (userId) => {
            console.log("registered User :", userId)
            userSocketMap[userId] = socket.id
            console.log(userSocketMap)
        })

        socket.on("PrivateMessage", ({ userId, text }) => {
            console.log("sending it to user", userId)
            const targetSocketId = userSocketMap[userId]
            console.log("targetSocketId", targetSocketId)
            if (targetSocketId) {
                io.to(targetSocketId).emit("PrivateMessage", {
                    from: socket.id,
                    text
                })
            }
        })

        socket.on('disconnect', () => {
            for (const userId in userSocketMap) {
                if (userSocketMap[userId] === socket.id) {
                    delete userSocketMap[userId]
                    break;
                }
            }
            console.log("user disconnected. active users:", userSocketMap)
        })
    })
}