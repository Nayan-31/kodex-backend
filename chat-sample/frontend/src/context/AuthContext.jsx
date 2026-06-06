import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../lib/api'
import { io } from 'socket.io-client'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [socket, setSocket] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedUser = localStorage.getItem('chat-user')
        if (storedUser) {
            const parsed = JSON.parse(storedUser)
            setUser(parsed.user || parsed)
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        if (user) {
            // Use the same domain if deploying to production, or localhost for dev
            const socketUrl = import.meta.env.VITE_API_URL 
                ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
                : 'https://kodex-backend-chat-sample.onrender.com'
                
            const newSocket = io(socketUrl)
            newSocket.emit("registeredUser", user._id)
            setSocket(newSocket)

            return () => {
                newSocket.disconnect()
            }
        } else if (socket) {
            socket.disconnect()
            setSocket(null)
        }
    }, [user])

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password })
        setUser(data.data.user)
        localStorage.setItem('chat-user', JSON.stringify(data.data.user))
    }

    const register = async (username, email, password) => {
        const { data } = await api.post('/auth/register', { username, email, password })
        setUser(data.data.user)
        localStorage.setItem('chat-user', JSON.stringify(data.data.user))
    }

    const logout = async () => {
        await api.post('/auth/logout')
        setUser(null)
        localStorage.removeItem('chat-user')
    }

    return (
        <AuthContext.Provider value={{ user, socket, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
