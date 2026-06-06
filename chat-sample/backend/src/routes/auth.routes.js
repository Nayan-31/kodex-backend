import { Router } from 'express'
import { register, login } from '../controllers/auth.controller.js'
import { registerValidator, loginValidator } from '../validators/auth.validator.js'

const router = Router()

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user and generate a JWT
 * @access  Public
 */
router.post('/register', registerValidator, register)

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user & get a JWT
 * @access  Public
 */
router.post('/login', loginValidator, login)

export default router
