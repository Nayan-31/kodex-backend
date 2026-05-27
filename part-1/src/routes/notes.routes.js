let express = require('express')

let router = express.Router()

/**
* @route POST /create
* @description create a new note need title and description in the request body
* @access public
*/

router.post('/create')

/**
 * @route GET /get
 * @description get all notes
 * @access public
 */

router.get('/get')

/**
 * @route /:id
 * @description update notes by id requires description for update 
 * @access public
 */


module.exports = router