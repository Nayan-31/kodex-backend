let mongoose = require('mongoose')

async function connectToDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI).then(()=>{
            console.log("connected to db")
        })
    } catch (error) {
        console.log("error is coming while connecting to db")
    }
}

module.exports = connectToDB