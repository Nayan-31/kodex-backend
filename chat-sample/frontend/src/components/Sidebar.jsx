import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { Search, Loader2, Users, X, Check } from 'lucide-react'

export default function Sidebar({ onSelectChat, selectedChat }) {
    const { user } = useAuth()
    const [chats, setChats] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    
    // Group Chat UI State
    const [showGroupModal, setShowGroupModal] = useState(false)
    const [groupChatName, setGroupChatName] = useState('')
    const [selectedUsers, setSelectedUsers] = useState([])
    const [groupSearchQuery, setGroupSearchQuery] = useState('')

    useEffect(() => {
        // Fetch both initially so we can search through everything
        fetchChats()
        fetchUsers()
    }, [])

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
        try {
            const { data } = await api.get('/users')
            setUsers(data.data)
        } catch (error) {
            console.error("Failed to fetch users", error)
        }
    }

    const startChat = async (userId) => {
        try {
            const { data } = await api.post('/chats', { userId })
            onSelectChat(data.data)
            fetchChats() // Refresh chat list
            setSearchQuery('') // Clear search
        } catch (error) {
            console.error("Failed to start chat", error)
        }
    }

    const createGroupChat = async (e) => {
        e.preventDefault()
        if (!groupChatName || selectedUsers.length < 2) return

        try {
            const { data } = await api.post('/chats/group', {
                name: groupChatName,
                users: selectedUsers
            })
            onSelectChat(data.data)
            fetchChats()
            setShowGroupModal(false)
            setGroupChatName('')
            setSelectedUsers([])
            setGroupSearchQuery('')
        } catch (error) {
            console.error("Failed to create group", error)
        }
    }

    const toggleUserSelection = (userId) => {
        setSelectedUsers(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId) 
                : [...prev, userId]
        )
    }

    // Helper to get the other user's name in a 1-to-1 chat
    const getOtherUser = (chatUsers) => {
        if (!chatUsers) return null
        return chatUsers.find((u) => u._id !== user._id)
    }

    // Time formatter
    const formatTime = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)
        
        if (diffMins < 60) return `${diffMins || 1}m ago`
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
        return 'Yesterday'
    }

    // Filter logic based on search
    const filteredChats = chats.filter(chat => {
        if (chat.isGroupChat) {
            return chat.chatName?.toLowerCase().includes(searchQuery.toLowerCase())
        }
        const otherUser = getOtherUser(chat.users)
        return otherUser?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    })

    const filteredUsers = users.filter(u => 
        u.username.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const filteredGroupUsers = users.filter(u => 
        u._id !== user._id && u.username.toLowerCase().includes(groupSearchQuery.toLowerCase())
    )

    // Are we showing search results or active chats?
    const isSearching = searchQuery.trim().length > 0

    return (
        <div className="w-full md:w-80 lg:w-[340px] bg-slate-50 border-r border-slate-200 flex flex-col h-full shrink-0">
            {/* Search Bar & Actions */}
            <div className="p-4 border-b border-slate-200 flex items-center gap-2">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Search size={16} />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search conversations..."
                        className="block w-full pl-10 pr-4 py-2 border-none rounded-full bg-slate-200/60 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
                    />
                </div>
                <button 
                    onClick={() => setShowGroupModal(true)}
                    className="p-2 bg-slate-200/60 text-slate-600 rounded-full hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                    title="Create Group Chat"
                >
                    <Users size={18} strokeWidth={2.5} />
                </button>
            </div>

            {/* List Area */}
            <div className="flex-1 overflow-y-auto">
                {loading && !isSearching ? (
                    <div className="flex justify-center p-8 text-emerald-500">
                        <Loader2 className="animate-spin" size={24} />
                    </div>
                ) : (
                    <div className="py-2">
                        {isSearching && (
                            <div className="px-4 py-2 text-xs font-bold tracking-wider text-slate-400 uppercase">
                                Global Users
                            </div>
                        )}

                        {isSearching ? (
                            // Render Global User Search Results
                            filteredUsers.map((u) => (
                                <button
                                    key={u._id}
                                    onClick={() => startChat(u._id)}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100 transition-colors text-left"
                                >
                                    <div className="w-12 h-12 rounded-full bg-slate-300 flex items-center justify-center font-bold text-slate-600 shrink-0 relative overflow-hidden">
                                        <img src={`https://ui-avatars.com/api/?name=${u.username}&background=random`} alt={u.username} />
                                    </div>
                                    <div>
                                        <h3 className="text-slate-800 font-semibold">{u.username}</h3>
                                        <p className="text-xs text-emerald-600 font-medium mt-0.5">Start new chat</p>
                                    </div>
                                </button>
                            ))
                        ) : (
                            // Render Active Chats
                            filteredChats.map((chat) => {
                                const otherUser = getOtherUser(chat.users)
                                const isSelected = selectedChat?._id === chat._id
                                
                                return (
                                    <button
                                        key={chat._id}
                                        onClick={() => onSelectChat(chat)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left relative ${
                                            isSelected ? 'bg-white shadow-sm border-y border-slate-100' : 'hover:bg-slate-100/80 border-y border-transparent'
                                        }`}
                                    >
                                        {/* Active Indicator line */}
                                        {isSelected && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-600 rounded-r-md"></div>
                                        )}

                                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 shrink-0 relative">
                                            {chat.isGroupChat ? (
                                                <Users size={22} className="text-slate-500" />
                                            ) : (
                                                <img className="rounded-full w-full h-full object-cover" src={`https://ui-avatars.com/api/?name=${otherUser?.username}&background=random`} alt={otherUser?.username} />
                                            )}
                                            {/* Online Dot (Mocked active for demo) */}
                                            {!chat.isGroupChat && (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-0.5">
                                                <h3 className={`font-semibold truncate ${isSelected ? 'text-slate-900' : 'text-slate-800'}`}>
                                                    {chat.isGroupChat ? chat.chatName : otherUser?.username}
                                                </h3>
                                                <span className="text-[11px] font-medium text-slate-400 shrink-0 ml-2">
                                                    {chat.latestMessage ? formatTime(chat.latestMessage.updatedAt) : ''}
                                                </span>
                                            </div>
                                            <p className={`text-sm truncate ${
                                                isSelected ? 'text-slate-600' : 'text-slate-500'
                                            }`}>
                                                {chat.latestMessage ? chat.latestMessage.content : 'New Chat...'}
                                            </p>
                                        </div>
                                    </button>
                                )
                            })
                        )}

                        {!isSearching && filteredChats.length === 0 && (
                            <div className="p-6 text-center">
                                <p className="text-slate-500 text-sm">No chats yet.</p>
                                <p className="text-slate-400 text-xs mt-1">Search above to find contacts.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Create Group Modal */}
            {showGroupModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800">Create Group Chat</h2>
                            <button onClick={() => setShowGroupModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={createGroupChat} className="p-5 flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Group Name</label>
                                <input
                                    type="text"
                                    value={groupChatName}
                                    onChange={(e) => setGroupChatName(e.target.value)}
                                    placeholder="e.g. Engineering Team"
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    Select Members ({selectedUsers.length} selected)
                                </label>
                                <input
                                    type="text"
                                    value={groupSearchQuery}
                                    onChange={(e) => setGroupSearchQuery(e.target.value)}
                                    placeholder="Search users..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 mb-3"
                                />
                                
                                <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 p-2 space-y-1">
                                    {filteredGroupUsers.map(u => {
                                        const isChecked = selectedUsers.includes(u._id)
                                        return (
                                            <button
                                                type="button"
                                                key={u._id}
                                                onClick={() => toggleUserSelection(u._id)}
                                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                                    isChecked ? 'bg-emerald-50' : 'hover:bg-slate-200/50'
                                                }`}
                                            >
                                                <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                                                    isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'
                                                }`}>
                                                    {isChecked && <Check size={14} strokeWidth={3} />}
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
                                                    <img src={`https://ui-avatars.com/api/?name=${u.username}&background=random`} alt={u.username} />
                                                </div>
                                                <span className="text-sm font-medium text-slate-700">{u.username}</span>
                                            </button>
                                        )
                                    })}
                                    {filteredGroupUsers.length === 0 && (
                                        <p className="text-center text-sm text-slate-500 py-4">No users found.</p>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!groupChatName.trim() || selectedUsers.length < 2}
                                className="mt-2 w-full py-3 rounded-xl bg-emerald-600 text-white font-bold tracking-wide hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:hover:bg-emerald-600"
                            >
                                Create Group
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
