const noteModel = require("../model/notes.model")

const createNoteController = async(req,res)=>{
   const {title , description} = req.body

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

const deleteNoteController = async(req,res)=>{
    const {id} = req.params
    const note = await noteModel.findById(id)

    if(!note){
        return res.status(404).json({
          error : "Note not found"
        })
    }

   await note.deleteOne()

    return res.status(200).json({
        message : "description updated sucessfully"
    })
}

module.exports = {createNoteController , readNoteController , updateNoteController}