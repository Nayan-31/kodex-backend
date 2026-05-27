let express = require('express')
let router = express.Router()

const {
  createNoteController,
  readNoteController,
  updateNoteController
} = require('../controller/notes.controller')

let {notesValidation} = require('../middleware/validator.middleware')


/**
 * @routes POST /api/notes/create
 * @description create a new note need title and description
 * @access public
 */


router.post('/create' , notesValidation , createNoteController)



/**
 * @routes GET /api/notes/read
 * @description get all the notes
 * @access public
 */

router.get('/read' , readNoteController)


/**
 * @routes PATCH /api/notes/update
 * @description update the notes by getting the id and it's done
 * @access public
 */

router.patch('/update' ,notesValidation , updateNoteController)



/**
 * @routes DELETE /api/notes/delete
 * @description get the id of that note and then filter it out
 * @access public
 */

// router.delete('/delete' , noteDeleteController)

module.exports = router