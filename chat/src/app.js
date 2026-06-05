import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
// console.log("directory name : " , __dirname)

const app = express()
app.use(express.static(path.join(__dirname , ".." , "public")))
// const publicPath = path.join(__dirname , ".." , "public")
// console.log(publicPath)

export default app