import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'

export default function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cyber-darker text-white font-orbitron overflow-hidden relative selection:bg-cyber-cyan/30">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black pointer-events-none" />
      
      {/* Particles/Ripple Effect (Mocked with CSS circles) */}
      <motion.div 
        animate={{ scale: [1, 2], opacity: [0.3, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        className="absolute w-[600px] h-[600px] border border-cyber-cyan/20 rounded-full pointer-events-none"
      />
      <motion.div 
        animate={{ scale: [1, 2], opacity: [0.2, 0] }}
        transition={{ repeat: Infinity, duration: 4, delay: 2, ease: "linear" }}
        className="absolute w-[400px] h-[400px] border border-cyber-red/20 rounded-full pointer-events-none"
      />

      {/* Main Content Box */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="z-10 flex flex-col items-center glass-card p-12 border border-cyber-cyan/30 shadow-[0_0_50px_rgba(0,240,255,0.1)] relative"
      >
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-cyan" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyber-cyan" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyber-cyan" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-cyan" />

        <Shield className="w-20 h-20 text-cyber-cyan mb-6 animate-pulse-glow drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
        
        <h1 className="text-sm tracking-[0.3em] text-cyber-cyan/80 mb-2">WELCOME TO</h1>
        <h2 className="text-5xl font-bold mb-4 neon-text-cyan tracking-widest text-center">SENTINEL CORE</h2>
        <p className="text-xs font-mono text-gray-400 tracking-widest mb-10 text-center max-w-md">
          GLOBAL DISASTER INTELLIGENCE NETWORK. <br/>
          UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED.
        </p>

        <div className="flex gap-6 w-full max-w-sm">
          <Link to="/login" className="flex-1">
            <button className="w-full relative group px-6 py-3 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 border border-cyber-cyan/50 text-cyber-cyan tracking-widest font-bold text-sm transition-all uppercase overflow-hidden">
              <span className="relative z-10">INITIALIZE</span>
              <div className="absolute inset-0 h-full w-0 bg-cyber-cyan/20 group-hover:w-full transition-all duration-300 ease-out" />
            </button>
          </Link>
          <Link to="/signup" className="flex-1">
            <button className="w-full px-6 py-3 bg-transparent border border-gray-600 hover:border-gray-400 text-gray-400 hover:text-white tracking-widest font-bold text-sm transition-all uppercase">
              REGISTER
            </button>
          </Link>
        </div>
      </motion.div>
      
      <div className="absolute bottom-6 text-[10px] font-mono text-gray-500 tracking-widest opacity-50">
        SYS.VER 1.0.4 // ENCRYPTED CONNECTION ESTABLISHED
      </div>
    </div>
  )
}
