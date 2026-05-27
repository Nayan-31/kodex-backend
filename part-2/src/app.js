let express = require('express')
let notesRoute = require('../src/routes/notes.routes')
let app = express()

app.use(express.json())

app.use('/api/notes' , notesRoute)

module.exports = app