import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, User, MessageSquare, ArrowRight } from 'lucide-react'
import heroImg from '../assets/hero.png'

export default function Auth() {
    const { login, register } = useAuth()
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        
        if (!isLogin && password !== confirmPassword) {
            return setError('Passwords do not match')
        }

        setLoading(true)
        try {
            if (isLogin) {
                await login(email, password)
            } else {
                await register(username, email, password)
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
            {/* Left Pane - Desktop Only */}
            <div className="hidden md:flex flex-col md:w-1/2 bg-teal-800 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-700 to-teal-900 opacity-90"></div>
                
                {/* Decorative shape */}
                <div className="absolute -left-[20%] top-1/4 w-[140%] h-[140%] rounded-full bg-teal-600/20 mix-blend-screen blur-3xl"></div>

                <div className="relative z-10 p-12 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-16">
                        <div className="bg-white text-teal-800 p-2 rounded-xl">
                            <MessageSquare size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">ChatSphere</span>
                    </div>

                    <div className="max-w-md">
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                            Connect with clarity and speed.
                        </h1>
                        <p className="text-teal-100 text-lg leading-relaxed mb-12">
                            Experience the next generation of professional real-time communication designed for high-performance teams.
                        </p>
                    </div>

                    <div className="mt-auto relative rounded-2xl overflow-hidden shadow-2xl border border-teal-500/30 bg-teal-900/50 aspect-square max-w-sm mx-auto">
                        <img 
                            src={heroImg} 
                            alt="3D spheres floating" 
                            className="object-cover w-full h-full mix-blend-luminosity opacity-80"
                            onError={(e) => {
                                // Fallback if image not found
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Right Pane - Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-10 relative">
                    
                    {/* Mobile Logo */}
                    <div className="md:hidden flex flex-col items-center justify-center mb-8">
                        <div className="bg-emerald-500 text-white p-3 rounded-2xl mb-4 shadow-lg shadow-emerald-500/20">
                            <MessageSquare size={32} strokeWidth={2} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">ChatSphere</h2>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">
                            {isLogin ? 'Welcome Back' : 'Create an account'}
                        </h2>
                        <p className="text-slate-500 text-sm">
                            {isLogin 
                                ? 'Enter your credentials to continue your conversations.' 
                                : 'Start your conversation journey today.'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                                        placeholder="Alex Johnson"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                        <User size={18} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-400"
                                    placeholder="name@company.com"
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                    <Mail size={18} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-medium text-slate-700">Password</label>
                                {isLogin && (
                                    <a href="#" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                                        Forgot password?
                                    </a>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-400 tracking-widest font-mono"
                                    placeholder="••••••••"
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                    <Lock size={18} />
                                </div>
                            </div>
                        </div>

                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-400 tracking-widest font-mono"
                                        placeholder="••••••••"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                        <Lock size={18} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {isLogin && (
                            <div className="flex items-center">
                                <input id="remember" type="checkbox" className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600" />
                                <label htmlFor="remember" className="ml-2 block text-sm text-slate-600">
                                    Remember this device
                                </label>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all active:scale-[0.98] disabled:opacity-70"
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
                            {!isLogin && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-3 bg-white text-slate-400 uppercase font-semibold tracking-wider">
                                    Or {isLogin ? 'continue' : 'register'} with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                                GitHub
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <span className="text-sm text-slate-500">
                            {isLogin ? "Don't have an account?" : "Already have an account?"} 
                        </span>
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin)
                                setError('')
                            }}
                            className="ml-1 text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors"
                        >
                            {isLogin ? 'Sign up now' : 'Sign In'}
                        </button>
                    </div>
                </div>

                {/* Mobile Footer Links */}
                <div className="md:hidden absolute bottom-4 text-center w-full max-w-md mx-auto left-0 right-0 flex justify-center gap-4 text-xs font-medium text-slate-400">
                    <a href="#" className="hover:text-slate-600">Privacy Policy</a>
                    <a href="#" className="hover:text-slate-600">Terms of Service</a>
                    <a href="#" className="hover:text-slate-600">Contact Support</a>
                </div>
            </div>
        </div>
    )
}
