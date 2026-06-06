import { useState, useEffect, useRef } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { io } from 'socket.io-client'
import { Send, Loader2, Video, Settings, Plus, Smile, MessageSquare, Users, ChevronLeft } from 'lucide-react'

// Keep socket outside component to avoid reconnects on every render
let socket

export default function ChatWindow({ chat, onBack }) {
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

        // Register the user with socket for 1-to-1 routing
        socket.emit("registeredUser", user._id)

        // Listen for incoming messages
        socket.on("PrivateMessage", (receivedMsg) => {
            // Append the message if it belongs to this chat
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

            // 2. Emit to socket
            // We pass userId so the backend knows who to send it to if it's a 1-to-1 chat!
            socket.emit("PrivateMessage", {
                ...savedMessage,
                userId: otherUser?._id // The target user for 1-to-1 routing
            })
            
        } catch (error) {
            console.error("Failed to send message", error)
        }
    }

    const formatMessageTime = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    if (!chat) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-white border-l border-slate-200">
                <div className="w-24 h-24 mb-6 rounded-3xl bg-slate-50 flex items-center justify-center shadow-inner">
                    <MessageSquare size={36} className="text-emerald-500/50" />
                </div>
                <p className="text-2xl font-bold text-slate-800 tracking-tight">Your Messages</p>
                <p className="text-slate-500 mt-2">Select a chat or search for a user to start a conversation.</p>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col bg-white h-full relative border-l border-slate-200 shadow-sm z-10">
            {/* Chat Header */}
            <div className="h-[68px] px-4 md:px-6 border-b border-slate-200 flex items-center justify-between shrink-0 bg-[#f8fafc] md:bg-white/95 backdrop-blur z-20">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={onBack}
                        className="md:hidden p-1.5 -ml-2 text-slate-500 hover:bg-slate-200 rounded-full transition-colors"
                    >
                        <ChevronLeft size={26} strokeWidth={2.5} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700 relative overflow-hidden shadow-sm border border-emerald-200/50">
                        {chat.isGroupChat ? (
                            <Users size={20} className="text-emerald-600" />
                        ) : (
                            <img src={`https://ui-avatars.com/api/?name=${otherUser?.username}&background=random`} alt={otherUser?.username} />
                        )}
                        {/* Online Indicator for Mobile */}
                        {!chat.isGroupChat && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#f8fafc]"></div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-[17px] font-bold text-slate-800 leading-tight">
                            {chat.isGroupChat ? chat.chatName : otherUser?.username}
                        </h2>
                        <p className="text-[13px] font-semibold text-emerald-500 mt-0.5">
                            {chat.isGroupChat ? `${chat.users.length} members` : 'Online'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-slate-700">
                    <button className="hover:text-emerald-600 transition-colors"><Video size={24} strokeWidth={2} /></button>
                    <button className="hover:text-emerald-600 transition-colors"><Settings size={22} strokeWidth={2} /></button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 lg:px-12 pt-8 pb-32 space-y-6 scroll-smooth bg-[#f8fafc]">
                {/* Date separator mockup */}
                <div className="flex justify-center mb-6">
                    <span className="px-3 py-1 bg-slate-200/50 rounded-full text-xs font-bold text-slate-500">Today</span>
                </div>

                {loading ? (
                    <div className="flex justify-center pt-10">
                        <Loader2 className="animate-spin text-emerald-500" size={32} />
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMine = msg.sender._id === user._id || msg.sender === user._id
                        return (
                            <div key={index} className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-4`}>
                                {!isMine && (
                                    <div className="w-8 h-8 rounded-full bg-slate-300 mr-3 shrink-0 overflow-hidden self-end mb-5">
                                        <img src={`https://ui-avatars.com/api/?name=${msg.sender.username || otherUser?.username}&background=random`} alt="Avatar" />
                                    </div>
                                )}
                                <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} max-w-[70%]`}>
                                    <div 
                                        className={`px-5 py-3.5 shadow-sm text-[15px] leading-relaxed ${
                                            isMine 
                                                ? 'bg-emerald-500 text-white rounded-2xl rounded-br-sm' 
                                                : 'bg-slate-100 text-slate-800 rounded-2xl rounded-bl-sm'
                                        }`}
                                    >
                                        {msg.content || msg.text}
                                    </div>
                                    <span className="text-[11px] font-semibold text-slate-400 mt-1.5 flex items-center gap-1">
                                        {formatMessageTime(msg.createdAt || new Date())}
                                        {isMine && (
                                            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                        )}
                                    </span>
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 bg-[#f8fafc] md:bg-white md:border-t border-slate-100 z-20 pb-safe pb-16 md:pb-5">
                <form onSubmit={sendMessage} className="max-w-4xl mx-auto flex items-center gap-3">
                    <button type="button" className="p-1 text-slate-700 hover:bg-slate-200 rounded-full transition-colors shrink-0">
                        <Plus size={24} strokeWidth={2.5} />
                    </button>
                    
                    <div className="flex-1 bg-white border border-slate-200 rounded-full flex items-center px-4 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all min-h-[46px]">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent py-2 focus:outline-none text-[15px] text-slate-800 placeholder:text-slate-500"
                        />
                        <button type="button" className="p-1 text-slate-700 hover:text-emerald-600 transition-colors shrink-0">
                            <Smile size={24} strokeWidth={2} />
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="w-[46px] h-[46px] shrink-0 bg-emerald-500 text-white rounded-full flex items-center justify-center hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 shadow-sm transition-all active:scale-95"
                    >
                        <Send size={20} strokeWidth={2.5} className="ml-0.5" />
                    </button>
                </form>
            </div>
        </div>
    )
}
