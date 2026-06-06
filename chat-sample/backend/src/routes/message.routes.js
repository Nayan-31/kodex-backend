import { Router } from 'express'
import { sendMessage, fetchMessages } from '../controllers/message.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = Router()

// Protect all message routes
router.use(authMiddleware)

/**
 * @route   POST /api/v1/messages
 * @desc    Send a message in a chat
 * @access  Private
 */
router.post('/', sendMessage)

/**
 * @route   GET /api/v1/messages/:chatId
 * @desc    Fetch all messages for a specific chat
 * @access  Private
 */
router.get('/:chatId', fetchMessages)

export default router
