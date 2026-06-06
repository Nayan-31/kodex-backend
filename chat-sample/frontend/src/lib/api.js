import axios from 'axios'

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://kodex-backend-chat-sample.onrender.com/api/v1',
    withCredentials: true, // Crucial for sending/receiving cookies (JWT)
})
