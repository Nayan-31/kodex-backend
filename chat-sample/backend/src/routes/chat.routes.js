import { Router } from 'express'
import { accessChat, fetchChats, createGroupChat } from '../controllers/chat.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const router = Router()

// Protect all chat routes
router.use(authMiddleware)

/**
 * @route   POST /api/v1/chats
 * @desc    Create or fetch a 1-to-1 chat with a user
 * @access  Private
 */
router.post('/', accessChat)

/**
 * @route   GET /api/v1/chats
 * @desc    Fetch all chats for the logged in user
 * @access  Private
 */
router.get('/', fetchChats)

/**
 * @route   POST /api/v1/chats/group
 * @desc    Create a new group chat
 * @access  Private
 */
router.post('/group', createGroupChat)

export default router
