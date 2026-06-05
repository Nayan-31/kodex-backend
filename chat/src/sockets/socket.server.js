import {Server} from 'socket.io'

const userSocketMap = {};

export default function initSocketServer(httpServer){
    
   const io = new Server(httpServer)
   io.on('connection' , (socket)=>{ //server pe listen karna hai user ko
   
     const {room} = socket.handshake.query
     console.log(`user joined using ${room}`)
     socket.join(room)

    socket.on('registeredUser', (userId)=>{
      console.log("Registered:", userId)
      userSocketMap[userId] = socket.id
       console.log(userSocketMap)
    })

    socket.on("privateMessage" , ({userId , text})=>{
        console.log("Sending to:", userId)
        console.log(text)
      const targetSocketId = userSocketMap[userId]
        console.log("Target Socket:", targetSocketId)
      if(targetSocketId){
        io.to(targetSocketId).emit("privateMessage" , {
          from : socket.id,
          text
        })
      }
    })

    socket.on("disconnect", () => {
    for (const userId in userSocketMap) {
    if (userSocketMap[userId] === socket.id) {
      delete userSocketMap[userId];

      console.log(`${userId} removed`);
      console.log(userSocketMap);

      break;
    }
  }
});
   })
}