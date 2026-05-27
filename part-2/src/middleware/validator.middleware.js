const { body, validationResult } = require('express-validator'); //body → used to define validation rules for request body fields.

const respondWithValidationResult = (req,res,next)=>{
    const errors = validationResult(req) //validationResult : checks whether validation failed or passed.  
    if(!errors.isEmpty()){
     return res.status(400).json({
        errors : errors.array()
     })
    }
    next()
}

const notesValidation = [
    body('title')
    .isString()
    .withMessage('title must be a string')
    .isLength({min : 3})
    .withMessage("title must be three characters long"),

    body('description')
    .isString()
    .withMessage('description must be a string')
    .isLength({min : 3})
    .withMessage("description must be three characters long"),

    respondWithValidationResult
]

module.exports = {notesValidation}
