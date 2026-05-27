require('dotenv').config()
let app = require('./src/app')
let connectToDB = require('./src/config/db')

connectToDB()

let port = process.env.PORT || 4000
app.listen(port , ()=>{
    console.log(`server is running on port ${port}`)
})