import { useState } from 'react'
import Sidebar from './Sidebar'
import ChatWindow from './ChatWindow'
import { useAuth } from '../context/AuthContext'
import { MessageSquare, Settings } from 'lucide-react'

export default function ChatLayout() {
    const [selectedChat, setSelectedChat] = useState(null)
    const { user } = useAuth()

    return (
        <div className="flex flex-col h-screen w-full bg-slate-50 font-sans overflow-hidden">
            {/* Top Navigation Bar (Hidden on Mobile) */}
            <header className="hidden md:flex h-16 bg-white border-b border-slate-200 items-center justify-between px-6 shrink-0 z-20">
                {/* Left: Branding & User */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-300 flex items-center justify-center relative">
                            {/* Simple placeholder avatar using initials */}
                            <span className="font-bold text-slate-600">{user?.username?.charAt(0)?.toUpperCase()}</span>
                            {/* Online indicator */}
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-emerald-500 text-white p-1.5 rounded-lg">
                            <MessageSquare size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-xl font-bold text-slate-800 tracking-tight">ChatSphere</span>
                    </div>
                </div>

                {/* Center: Nav Links (Desktop) */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
                    <button className="text-teal-700">Chats</button>
                    <button className="hover:text-slate-800 transition-colors">Contacts</button>
                    <button className="hover:text-slate-800 transition-colors">Settings</button>
                </nav>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    <button className="text-slate-600 hover:text-slate-900 transition-colors p-2 rounded-full hover:bg-slate-100">
                        <Settings size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden relative pb-[60px] md:pb-0">
                <div className={`w-full md:w-auto h-full flex shrink-0 transition-transform ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
                    <Sidebar onSelectChat={setSelectedChat} selectedChat={selectedChat} />
                </div>
                <div className={`w-full flex-1 h-full ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
                    <ChatWindow chat={selectedChat} onBack={() => setSelectedChat(null)} />
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[60px] bg-slate-50 border-t border-slate-200 flex items-center justify-around z-50 px-2 pb-safe">
                <button className="flex flex-col items-center justify-center w-20 gap-1 text-emerald-600">
                    <MessageSquare size={22} strokeWidth={2} />
                    <span className="text-[10px] font-semibold">Chats</span>
                </button>
                <button className="flex flex-col items-center justify-center w-20 gap-1 text-slate-500 hover:text-slate-800 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <span className="text-[10px] font-semibold">Contacts</span>
                </button>
                <button className="flex flex-col items-center justify-center w-20 gap-1 text-slate-500 hover:text-slate-800 transition-colors">
                    <Settings size={22} strokeWidth={2} />
                    <span className="text-[10px] font-semibold">Settings</span>
                </button>
            </nav>
        </div>
    )
}
