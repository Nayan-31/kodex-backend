import { useAuth } from './context/AuthContext'
import Auth from './components/Auth'
import ChatLayout from './components/ChatLayout'

function AppContent() {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="h-screen w-screen bg-gray-950 flex items-center justify-center text-indigo-500">Loading...</div>
  }

  return user ? <ChatLayout /> : <Auth />
}

export default function App() {
  return <AppContent />
}
