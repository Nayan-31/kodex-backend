import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check if user is logged in on load
        // Usually, we'd have a /me endpoint, but for simplicity, we can rely on local storage or just keep them logged in while the session lasts.
        // Let's check local storage for user data.
        const storedUser = localStorage.getItem('chat-user')
        if (storedUser) {
            const parsed = JSON.parse(storedUser)
            // Handle if the old token wrapper was cached by mistake
            setUser(parsed.user || parsed)
        }
        setLoading(false)
    }, [])

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
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
