import { useState, useEffect, useRef } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { io } from 'socket.io-client'
import { Send, Loader2 } from 'lucide-react'

// Keep socket outside component to avoid reconnects on every render
let socket

export default function ChatWindow({ chat }) {
    const { user } = useAuth()
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)

    // Helper to get the other user in this chat
    const otherUser = chat ? chat.users.find((u) => u._id !== user._id) : null

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Fetch messages when chat changes
    useEffect(() => {
        if (!chat) return

        const fetchMessages = async () => {
            setLoading(true)
            try {
                const { data } = await api.get(`/messages/${chat._id}`)
                setMessages(data.data)
            } catch (error) {
                console.error("Failed to fetch messages", error)
            }
            setLoading(false)
        }

        fetchMessages()

        // Socket setup
        socket = io("http://localhost:8000", {
            query: { room: chat._id }
        })

        // Register the user with socket
        socket.emit("registeredUser", user._id)

        // Listen for incoming messages
        socket.on("PrivateMessage", (receivedMsg) => {
            // Append the message if it belongs to this chat
            // (In our simplified logic, the socket.io payload is the full message object from the DB)
            if (receivedMsg.chat._id === chat._id || receivedMsg.chat === chat._id) {
                setMessages((prev) => [...prev, receivedMsg])
            }
        })

        return () => {
            socket.disconnect()
        }
    }, [chat, user._id])

    const sendMessage = async (e) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        try {
            // 1. Save to database
            const { data } = await api.post('/messages', {
                content: newMessage,
                chatId: chat._id
            })
            
            const savedMessage = data.data
            setNewMessage('')
            
            // Add to local state instantly
            setMessages((prev) => [...prev, savedMessage])

            // 2. Emit to socket (so the other user gets it)
            // We emit the full saved message object instead of just the text
            socket.emit("PrivateMessage", {
                userId: otherUser._id, 
                text: savedMessage.content,
                // We'll pass the full message so the receiver can just append it
                ...savedMessage
            })
            
        } catch (error) {
            console.error("Failed to send message", error)
        }
    }

    if (!chat) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-950 text-gray-500">
                <div className="w-24 h-24 mb-6 rounded-full bg-gray-900 flex items-center justify-center border border-gray-800">
                    <Send size={32} className="text-gray-700" />
                </div>
                <p className="text-xl font-medium text-gray-400">Select a chat to start messaging</p>
                <p className="text-sm mt-2">Choose someone from the Users tab</p>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col bg-gray-950 h-screen relative">
            {/* Chat Header */}
            <div className="h-20 px-6 border-b border-gray-800 flex items-center gap-4 bg-gray-900/50 absolute top-0 left-0 right-0 z-10 backdrop-blur-md">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xl">
                    {otherUser?.username.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-white">{otherUser?.username}</h2>
                    <p className="text-sm text-gray-400">{otherUser?.email}</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 pt-28 pb-24 space-y-4 scroll-smooth">
                {loading ? (
                    <div className="flex justify-center pt-10">
                        <Loader2 className="animate-spin text-indigo-500" size={32} />
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMine = msg.sender._id === user._id || msg.sender === user._id
                        return (
                            <div key={index} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                                <div 
                                    className={`px-5 py-3 rounded-2xl max-w-[70%] shadow-sm ${
                                        isMine 
                                            ? 'bg-indigo-600 text-white rounded-br-sm' 
                                            : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-sm'
                                    }`}
                                >
                                    {msg.content || msg.text}
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-950 via-gray-950 to-transparent">
                <form onSubmit={sendMessage} className="flex gap-3 bg-gray-900 p-2 rounded-2xl border border-gray-800 shadow-xl max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 bg-transparent text-white px-4 py-2 focus:outline-none placeholder-gray-500"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
                    >
                        <Send size={20} className="ml-1" />
                    </button>
                </form>
            </div>
        </div>
    )
}
