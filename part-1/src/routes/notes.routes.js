let express = require('express')
const { createNoteController, readNoteController, updateNoteController } = require('../controller/notes.controller')

let router = express.Router()

/**
* @route POST /create
* @description create a new note need title and description in the request body
* @access public
*/

router.post('/create' , createNoteController)

/**
 * @route GET /get
 * @description get all notes
 * @access public
 */

router.get('/get' , readNoteController)

/**
 * @route /:id
 * @description update notes by id requires description for update 
 * @access public
 */

router.patch('/update' , updateNoteController)

module.exports = router