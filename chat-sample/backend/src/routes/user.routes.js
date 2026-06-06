import { Router } from 'express'
import { getAllUsers } from '../controllers/user.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = Router()

// Protect all user routes
router.use(authMiddleware)

/**
 * @route   GET /api/v1/users
 * @desc    Fetch all users to start a chat with
 * @access  Private
 */
router.get('/', getAllUsers)

export default router
