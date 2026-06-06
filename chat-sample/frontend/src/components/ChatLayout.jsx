import { useState } from 'react'
import Sidebar from './Sidebar'
import ChatWindow from './ChatWindow'

export default function ChatLayout() {
    const [selectedChat, setSelectedChat] = useState(null)

    return (
        <div className="flex h-screen w-full bg-gray-950 overflow-hidden">
            <Sidebar onSelectChat={setSelectedChat} />
            <ChatWindow chat={selectedChat} />
        </div>
    )
}
