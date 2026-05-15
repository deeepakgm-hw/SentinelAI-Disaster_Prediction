import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldPlus, Loader2, ArrowLeft } from 'lucide-react'
import { signup } from '../services/api'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function Signup() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const setAuth = useAuthStore((state) => state.setAuth)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const data = await signup(username, email, password)
      setAuth(data.access_token, { username, email })
      toast.success('Registration Complete. Access Granted.')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration Failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cyber-darker text-white font-orbitron overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-red to-transparent opacity-50" />
      
      <Link to="/welcome" className="absolute top-8 left-8 text-gray-400 hover:text-cyber-red transition-colors flex items-center gap-2 text-xs tracking-widest uppercase">
        <ArrowLeft className="w-4 h-4" /> Abort
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md bg-black/60 backdrop-blur-md p-8 border border-cyber-red/30 shadow-[0_0_30px_rgba(255,0,60,0.05)] relative"
      >
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyber-red" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyber-red" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyber-red" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyber-red" />

        <div className="flex justify-center mb-6">
          <ShieldPlus className="w-12 h-12 text-cyber-red opacity-80" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-center tracking-[0.2em] text-white">NEW OPERATOR</h2>
        <p className="text-xs font-mono text-center text-cyber-red/70 mb-8 uppercase">Register for Clearance</p>

        <form onSubmit={handleSignup} className="space-y-5 font-mono text-sm">
          <div>
            <label className="block text-gray-400 mb-2 uppercase text-[10px] tracking-widest">Desired ID</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/40 border border-cyber-border/30 focus:border-cyber-red px-4 py-3 text-white outline-none transition-colors"
              placeholder="e.g. Neo"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2 uppercase text-[10px] tracking-widest">Comms Link (Email)</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-cyber-border/30 focus:border-cyber-red px-4 py-3 text-white outline-none transition-colors"
              placeholder="operator@sentinel.core"
            />
          </div>
          
          <div>
            <label className="block text-gray-400 mb-2 uppercase text-[10px] tracking-widest">Cipher (Password)</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-cyber-border/30 focus:border-cyber-red px-4 py-3 text-white outline-none transition-colors"
              placeholder="••••••••"
            />
            {password.length > 0 && password.length < 6 && (
              <p className="text-[9px] text-cyber-red mt-1">Cipher must be at least 6 characters</p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isLoading || password.length < 6}
            className="w-full relative group px-6 py-4 bg-cyber-red/10 hover:bg-cyber-red/20 border border-cyber-red/50 text-cyber-red tracking-[0.2em] font-bold text-sm transition-all uppercase overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> ENCRYPTING...
              </span>
            ) : (
              <span className="relative z-10">INITIALIZE LINK</span>
            )}
            <div className="absolute inset-0 h-full w-0 bg-cyber-red/20 group-hover:w-full transition-all duration-300 ease-out" />
          </button>
        </form>

        <div className="mt-8 text-center text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          Already cleared? <Link to="/login" className="text-cyber-red hover:underline ml-1">Authenticate</Link>
        </div>
      </motion.div>
    </div>
  )
}
