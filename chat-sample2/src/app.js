import express from 'express'
import path from 'path'
import {fileURLToPath} from 'url'

const __fileName = fileURLToPath(import.meta.url) //basically points to the current file you're writing the code
const __dirName = path.dirname(__fileName)

const app = express()

app.use(express.static(path.join(__dirName , ".." , public)))

export default app