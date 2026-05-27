const noteModel = require("../model/notes.model")

const createNoteController = async(req,res)=>{
   const {title , description} = req.body

   /* validations */
   if(!title){
    return res.status(400).json({
        error : "title is required"
    })
   }

   if(!description){
    return res.status(400).json({
        error: "description is required"
    })
   }

   if(title.trim().length < 3){
    return res.status(400).json({
        error:"title must be atleast 3 characters"
    })
   }

   if(description.trim().length < 3){
    return res.status(400).json({
        error: "description must be atleast 6 letters long"
    })
   }

   const newNote = await noteModel.create({
     title,
     description
   })

   return res.status(201).json({
    message : "note created sucessfully"
   })
}

const readNoteController = async(req,res)=>{
   let note = await noteModel.find()

   return res.status(200).json({
    message : "all note fetched successfully"
   })

}

const updateNoteController = async(req,res)=>{
    const {id} = req.params
    const {description} = req.body

    if(!description){
        return res.status(400).json({
            error : "description must be there"
        })
    }

    if(description.trim().length < 3){
        return res.status(400).json({
            error : "description must be greater than 3 letters"
        })
    }

    const note = await noteModel.findById(id)

    if(!note){
        return res.status(404).json({
          error : "Note not found"
        })
    }

    note.description = description
    await note.save()

    return res.status(200).json({
        message : "description updated sucessfully"
    })
}

module.exports = {createNoteController , readNoteController , updateNoteController}