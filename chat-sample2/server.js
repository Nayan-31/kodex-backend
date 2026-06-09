import app from './src/app.js'
import {createServer} from 'http'

const httpServer = createServer(app)
initSocketServer(httpServer)

httpServer.listen(3000 , ()=>{
  console.log("server is running on port 3000")
})