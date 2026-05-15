import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldAlert, Loader2, ArrowLeft } from 'lucide-react'
import { login } from '../services/api'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const setAuth = useAuthStore((state) => state.setAuth)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const data = await login(username, password)
      setAuth(data.access_token, { username })
      toast.success('Access Granted')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Authentication Failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cyber-darker text-white font-orbitron overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-50" />
      
      <Link to="/welcome" className="absolute top-8 left-8 text-gray-400 hover:text-cyber-cyan transition-colors flex items-center gap-2 text-xs tracking-widest uppercase">
        <ArrowLeft className="w-4 h-4" /> Abort
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md bg-black/60 backdrop-blur-md p-8 border border-cyber-cyan/30 shadow-[0_0_30px_rgba(0,240,255,0.05)] relative"
      >
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyber-cyan" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyber-cyan" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyber-cyan" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyber-cyan" />

        <div className="flex justify-center mb-6">
          <ShieldAlert className="w-12 h-12 text-cyber-cyan opacity-80" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-center tracking-[0.2em] text-white">SYSTEM LOGIN</h2>
        <p className="text-xs font-mono text-center text-cyber-cyan/70 mb-8 uppercase">Awaiting credentials</p>

        <form onSubmit={handleLogin} className="space-y-6 font-mono text-sm">
          <div>
            <label className="block text-gray-400 mb-2 uppercase text-[10px] tracking-widest">Operator ID</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/40 border border-cyber-border/30 focus:border-cyber-cyan px-4 py-3 text-white outline-none transition-colors"
              placeholder="Enter username"
            />
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2 uppercase text-[10px] tracking-widest">Passcode</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-cyber-border/30 focus:border-cyber-cyan px-4 py-3 text-white outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
            <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white">
              <input type="checkbox" className="accent-cyber-cyan bg-black" />
              Maintain Link
            </label>
            <Link to="/forgot-password" className="text-cyber-cyan/80 hover:text-cyber-cyan hover:underline">
              Reset Cipher?
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full relative group px-6 py-4 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/50 text-cyber-cyan tracking-[0.2em] font-bold text-sm transition-all uppercase overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> VERIFYING...
              </span>
            ) : (
              <span className="relative z-10">AUTHENTICATE</span>
            )}
            <div className="absolute inset-0 h-full w-0 bg-cyber-cyan/20 group-hover:w-full transition-all duration-300 ease-out" />
          </button>
        </form>

        <div className="mt-8 text-center text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          No clearance? <Link to="/signup" className="text-cyber-cyan hover:underline ml-1">Request Access</Link>
        </div>
      </motion.div>
    </div>
  )
}
