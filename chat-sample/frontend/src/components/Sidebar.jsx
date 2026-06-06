import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { MessageSquare, Users, LogOut, Loader2 } from 'lucide-react'

export default function Sidebar({ onSelectChat }) {
    const { user, logout } = useAuth()
    const [activeTab, setActiveTab] = useState('chats') // 'chats' or 'users'
    const [chats, setChats] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (activeTab === 'chats') {
            fetchChats()
        } else {
            fetchUsers()
        }
    }, [activeTab])

    const fetchChats = async () => {
        setLoading(true)
        try {
            const { data } = await api.get('/chats')
            setChats(data.data)
        } catch (error) {
            console.error("Failed to fetch chats", error)
        }
        setLoading(false)
    }

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const { data } = await api.get('/users')
            setUsers(data.data)
        } catch (error) {
            console.error("Failed to fetch users", error)
        }
        setLoading(false)
    }

    const startChat = async (userId) => {
        try {
            const { data } = await api.post('/chats', { userId })
            onSelectChat(data.data)
            setActiveTab('chats') // Switch back to chats view
        } catch (error) {
            console.error("Failed to start chat", error)
        }
    }

    // Helper to get the other user's name in a 1-to-1 chat
    const getOtherUser = (chatUsers) => {
        return chatUsers.find((u) => u._id !== user._id)
    }

    return (
        <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col h-screen">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-white font-semibold">{user.username}</h2>
                        <p className="text-xs text-gray-400">Online</p>
                    </div>
                </div>
                <button onClick={logout} className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-gray-800">
                    <LogOut size={20} />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex p-2 gap-2 bg-gray-900 border-b border-gray-800">
                <button
                    onClick={() => setActiveTab('chats')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'chats' ? 'bg-indigo-500/10 text-indigo-400' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                    }`}
                >
                    <MessageSquare size={16} /> Chats
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === 'users' ? 'bg-indigo-500/10 text-indigo-400' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                    }`}
                >
                    <Users size={16} /> Users
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2">
                {loading ? (
                    <div className="flex justify-center p-8 text-indigo-500">
                        <Loader2 className="animate-spin" size={24} />
                    </div>
                ) : activeTab === 'chats' ? (
                    <div className="space-y-1">
                        {chats.map((chat) => {
                            const otherUser = getOtherUser(chat.users)
                            return (
                                <button
                                    key={chat._id}
                                    onClick={() => onSelectChat(chat)}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition-colors text-left"
                                >
                                    <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-semibold shrink-0">
                                        {otherUser?.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-gray-200 font-medium truncate">{otherUser?.username}</h3>
                                        <p className="text-sm text-gray-500 truncate">
                                            {chat.latestMessage ? chat.latestMessage.content : 'No messages yet'}
                                        </p>
                                    </div>
                                </button>
                            )
                        })}
                        {chats.length === 0 && (
                            <p className="text-center text-gray-500 mt-8 text-sm">No chats yet. Go to Users to start one!</p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-1">
                        {users.map((u) => (
                            <button
                                key={u._id}
                                onClick={() => startChat(u._id)}
                                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-800 transition-colors text-left"
                            >
                                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-semibold shrink-0">
                                    {u.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-gray-200 font-medium">{u.username}</h3>
                                    <p className="text-sm text-gray-500">{u.email}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
