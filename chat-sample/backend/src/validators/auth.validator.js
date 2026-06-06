import { body, validationResult } from 'express-validator'

export const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        })
    }
    next()
}

export const registerValidator = [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email').trim().isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    validate
]

export const loginValidator = [
    body('email').trim().isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
]
