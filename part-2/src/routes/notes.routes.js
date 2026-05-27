let express = require('express')
let router = express.Router()
let notesValidation = require('../middleware/validator.middleware')
/**
 * @routes POST /api/notes/create
 * @description create a new note need title and description
 * @access public
 */

router.post('/create' , notesValidation , noteCreateController)

/**
 * @routes POST /api/notes/read
 * @description get all the notes
 * @access public
 */

router.get('/read' , noteReadController)

/**
 * @routes POST /api/notes/update
 * @description update the notes by getting the id and it's done
 * @access public
 */

router.patch('/update' ,notesValidation , noteUpdateController)

/**
 * @routes POST /api/notes/delete
 * @description get the id of that note and then filter it out
 * @access public
 */

router.delete('/delete' , noteDeleteController)

module.exports = router