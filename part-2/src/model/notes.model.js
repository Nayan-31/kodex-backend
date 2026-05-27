let mongoose = require('mongoose')


let notesSchema = new mongoose.Schema(

let userSchema = new mongoose.Schema(

    {
        title : String,
        description : String
    }
)

let userModel = mongoose.model('Notes' , notesSchema)

module.exports = userModel