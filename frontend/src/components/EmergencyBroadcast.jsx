import { motion, AnimatePresence } from 'framer-motion'
import { Skull, AlertTriangle, Radio } from 'lucide-react'
import { useUIStore } from '../store/uiStore'

export default function EmergencyBroadcast() {
  const isEmergencyMode = useUIStore((s) => s.isEmergencyMode)
  const setEmergencyMode = useUIStore((s) => s.setEmergencyMode)

  return (
    <AnimatePresence>
      {isEmergencyMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-hidden font-orbitron"
        >
          {/* Fullscreen pulsing red overlay */}
          <motion.div 
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute inset-0 bg-cyber-red/20 pointer-events-none mix-blend-overlay"
          />

          {/* Glitch lines */}
          <motion.div 
            animate={{ y: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none mix-blend-overlay"
          />
          
          {/* Main Broadcast Panel */}
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="relative z-10 w-[90%] max-w-2xl bg-black border-2 border-cyber-red shadow-[0_0_100px_rgba(255,0,60,0.5)] p-1 overflow-hidden"
          >
            {/* Warning Tape Border */}
            <div className="absolute top-0 left-0 w-full h-4 overflow-hidden flex">
              {Array.from({length: 20}).map((_, i) => (
                <div key={i} className="h-full w-12 bg-cyber-red -skew-x-45 border-r-8 border-black shrink-0" />
              ))}
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-4 overflow-hidden flex">
              {Array.from({length: 20}).map((_, i) => (
                <div key={i} className="h-full w-12 bg-cyber-red -skew-x-45 border-r-8 border-black shrink-0" />
              ))}
            </div>

            <div className="p-8 pt-12 pb-12 flex flex-col items-center text-center">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="mb-6"
              >
                <Skull className="w-24 h-24 text-cyber-red drop-shadow-[0_0_20px_#FF003C]" />
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-[0.2em] uppercase neon-text-red">
                Emergency Alert
              </h1>
              
              <div className="flex items-center gap-3 text-cyber-red font-mono text-xs uppercase tracking-widest mb-8 border border-cyber-red/50 bg-cyber-red/10 px-4 py-2 animate-pulse">
                <Radio className="w-4 h-4 animate-ping" />
                Live Automated Broadcast System
              </div>

              <div className="space-y-4 font-mono text-sm md:text-base text-gray-300 max-w-xl mx-auto uppercase tracking-widest text-left border-l-4 border-cyber-red pl-4">
                <p className="flex items-center gap-2"><AlertTriangle className="text-cyber-red w-5 h-5 shrink-0"/> <span className="text-white font-bold">EVENT:</span> CRITICAL SEISMIC DISTURBANCE DETECTED</p>
                <p className="flex items-center gap-2"><AlertTriangle className="text-cyber-red w-5 h-5 shrink-0"/> <span className="text-white font-bold">ACTION:</span> IMMEDIATE EVACUATION ORDERED</p>
                <p className="flex items-center gap-2 text-cyber-red font-bold animate-pulse"><AlertTriangle className="text-cyber-red w-5 h-5 shrink-0"/> DO NOT AWAIT FURTHER INSTRUCTIONS. PROCEED TO SAFE ZONES.</p>
              </div>

              <button 
                onClick={() => setEmergencyMode(false)}
                className="mt-12 px-8 py-4 bg-transparent border border-white hover:border-cyber-red hover:text-cyber-red text-white uppercase tracking-[0.3em] font-bold text-sm transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,0,60,0.4)]"
              >
                Acknowledge Protocol
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
