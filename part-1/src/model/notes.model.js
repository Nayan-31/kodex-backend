let mongoose = require('mongoose')

let userSchema = new mongoose.Schema(
    {
        title : String,
        description : String
    }
)

let userModel = mongoose.model('Notes' , notesSchema)

module.exports = userModel