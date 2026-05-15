import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleReset = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await api.post('/api/auth/forgot-password', { email })
      setIsSent(true)
      toast.success('Reset link dispatched')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to dispatch reset link')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cyber-darker text-white font-orbitron overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
      
      <Link to="/login" className="absolute top-8 left-8 text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-xs tracking-widest uppercase z-20">
        <ArrowLeft className="w-4 h-4" /> Return
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="z-10 w-full max-w-md bg-black/60 backdrop-blur-md p-8 border border-gray-600 shadow-[0_0_20px_rgba(255,255,255,0.05)] relative"
      >
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-400" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gray-400" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gray-400" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-400" />

        {!isSent ? (
          <>
            <div className="flex justify-center mb-6">
              <KeyRound className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-center tracking-[0.2em] text-white uppercase">Cipher Recovery</h2>
            <p className="text-xs font-mono text-center text-gray-400 mb-8 uppercase">Input comms link to receive reset token</p>

            <form onSubmit={handleReset} className="space-y-6 font-mono text-sm">
              <div>
                <label className="block text-gray-500 mb-2 uppercase text-[10px] tracking-widest">Comms Link (Email)</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-gray-600 focus:border-white px-4 py-3 text-white outline-none transition-colors"
                  placeholder="operator@sentinel.core"
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full relative group px-6 py-4 bg-gray-800 hover:bg-gray-700 border border-gray-500 text-white tracking-[0.2em] font-bold text-sm transition-all uppercase overflow-hidden disabled:opacity-50 mt-4"
              >
                <span className="relative z-10">{isLoading ? 'TRANSMITTING...' : 'DISPATCH LINK'}</span>
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <CheckCircle2 className="w-16 h-16 text-cyber-cyan mx-auto mb-4 animate-pulse-glow" />
            <h2 className="text-lg font-bold mb-2 tracking-[0.2em] text-white">Transmission Sent</h2>
            <p className="text-xs font-mono text-gray-400 mb-8">
              Check your secure comms link. If registered, a cipher reset token has been dispatched.
            </p>
            <Link to="/login">
              <button className="w-full px-6 py-3 border border-cyber-cyan/50 text-cyber-cyan tracking-widest font-bold text-xs uppercase hover:bg-cyber-cyan/10">
                Acknowledge
              </button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}
