import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, MapPin, Navigation, Shield, Check, PhoneCall, RadioTower } from 'lucide-react'
import { useUIStore } from '../store/uiStore'
import { useEmergencyStore } from '../store/emergencyStore'
import toast from 'react-hot-toast'

export default function EvacuationMode() {
  const isEvacuationMode = useUIStore((s) => s.isEvacuationMode)
  const setEvacuationMode = useUIStore((s) => s.setEvacuationMode)
  
  const liveLocation = useEmergencyStore((s) => s.liveLocation)
  const safeZones = useEmergencyStore((s) => s.safeZones)
  const countdownTimer = useEmergencyStore((s) => s.countdownTimer)
  const decrementTimer = useEmergencyStore((s) => s.decrementTimer)
  const activeDangerEvent = useEmergencyStore((s) => s.activeDangerEvent)

  // Timer countdown
  useEffect(() => {
    if (isEvacuationMode) {
      const interval = setInterval(decrementTimer, 1000)
      return () => clearInterval(interval)
    }
  }, [isEvacuationMode, decrementTimer])

  // Siren
  useEffect(() => {
    if (isEvacuationMode) {
      try {
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg')
        audio.loop = true
        audio.play().catch(() => console.log('Audio blocked'))
        return () => {
          audio.pause()
          audio.currentTime = 0
        }
      } catch (error) {
        console.error('Audio failed', error)
      }
    }
  }, [isEvacuationMode])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const handleDeactivate = () => {
    setEvacuationMode(false)
    toast.success("Evacuation Protocol Stood Down")
  }

  return (
    <AnimatePresence>
      {isEvacuationMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden font-inter"
        >
          {/* Background flashing effects */}
          <motion.div 
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="absolute inset-0 bg-cyber-red/30 pointer-events-none mix-blend-overlay"
          />
          
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none mix-blend-overlay" />

          {/* Warning tape */}
          <div className="absolute top-0 left-0 w-full h-6 flex overflow-hidden z-20 shadow-[0_0_20px_rgba(255,0,60,0.5)]">
            {Array.from({length: 40}).map((_, i) => (
              <div key={i} className="h-full w-12 bg-cyber-red -skew-x-45 border-r-[10px] border-black shrink-0" />
            ))}
          </div>
          <div className="absolute bottom-0 left-0 w-full h-6 flex overflow-hidden z-20 shadow-[0_0_20px_rgba(255,0,60,0.5)]">
            {Array.from({length: 40}).map((_, i) => (
              <div key={i} className="h-full w-12 bg-cyber-red -skew-x-45 border-r-[10px] border-black shrink-0" />
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="relative z-10 w-[95%] max-w-6xl h-[85vh] bg-[#0a0202] border-2 border-cyber-red shadow-[0_0_50px_rgba(255,0,60,0.3)] rounded-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-cyber-red/20 border-b border-cyber-red p-4 md:p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <AlertTriangle className="w-10 h-10 text-cyber-red animate-pulse drop-shadow-[0_0_10px_#FF003C]" />
                <div>
                  <h1 className="text-3xl font-orbitron font-black text-white tracking-widest uppercase neon-text-red">
                    EVACUATION MODE ACTIVE
                  </h1>
                  <div className="flex items-center gap-2 text-cyber-red font-mono text-sm uppercase tracking-widest mt-1">
                    <RadioTower className="w-4 h-4 animate-ping" />
                    Live Threat: {activeDangerEvent ? `${activeDangerEvent.type.toUpperCase()} - ${activeDangerEvent.distance_km}KM PROXIMITY` : 'CRITICAL WARNING'}
                  </div>
                </div>
              </div>
              
              <div className="text-right flex flex-col items-end">
                <span className="text-cyber-red/80 font-mono text-xs uppercase tracking-widest mb-1">Time to Impact</span>
                <div className={`text-5xl font-orbitron font-bold tracking-wider ${countdownTimer < 60 ? 'text-cyber-red animate-pulse' : 'text-orange-500'}`}>
                  {formatTime(countdownTimer)}
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 overflow-hidden">
              
              {/* LEFT COL: Instructions & AI */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="bg-black/60 border border-cyber-red/30 rounded-xl p-6 flex-1 shadow-inner">
                  <h3 className="font-orbitron font-bold text-white tracking-widest uppercase mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-cyber-red" />
                    AI Survival Instructions
                  </h3>
                  
                  <div className="space-y-4 font-mono text-sm">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                      className="bg-cyber-red/10 border-l-4 border-cyber-red p-4 text-gray-200"
                    >
                      <strong className="text-cyber-red">IMMEDIATE ACTION:</strong> Abandon heavy belongings. Move to the nearest {activeDangerEvent && activeDangerEvent.type.toLowerCase().includes('flood') ? 'elevated safe zone' : 'sturdy shelter structure'}.
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                      className="bg-white/5 border-l-4 border-orange-500 p-4 text-gray-200"
                    >
                      <strong className="text-orange-500">HAZARD WARNING:</strong> {activeDangerEvent ? `High-risk ${activeDangerEvent.type.toLowerCase()} environment detected within ${activeDangerEvent.distance_km}km.` : 'Unstable environmental conditions detected.'} Use mapped alternative paths.
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
                      className="bg-white/5 border-l-4 border-cyber-cyan p-4 text-gray-200"
                    >
                      <strong className="text-cyber-cyan">RESCUE TEAMS:</strong> Emergency responders have received your live coordinates and are inbound. Stay visible.
                    </motion.div>
                  </div>
                </div>

                <div className="bg-black/60 border border-cyber-red/30 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm font-mono text-gray-300">
                    <div className="w-3 h-3 bg-cyber-red rounded-full animate-ping" />
                    Live Location Broadcasting...
                  </div>
                  {liveLocation && (
                    <div className="font-mono text-xs text-cyber-cyan bg-cyber-cyan/10 px-3 py-1 rounded border border-cyber-cyan/30">
                      LAT: {liveLocation.lat.toFixed(4)} | LNG: {liveLocation.lng.toFixed(4)}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COL: Nearby Shelters */}
              <div className="flex-1 bg-black/60 border border-cyber-red/30 rounded-xl p-6 flex flex-col">
                <h3 className="font-orbitron font-bold text-white tracking-widest uppercase mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyber-red" />
                  Nearest Safe Zones
                </h3>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                  {safeZones.length > 0 ? safeZones.map((zone, idx) => (
                    <motion.div 
                      key={zone.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + (idx * 0.1) }}
                      className="bg-white/5 border border-white/10 hover:border-cyber-cyan/50 p-4 rounded-xl flex items-center justify-between group transition-colors cursor-pointer"
                    >
                      <div>
                        <h4 className="font-bold text-white group-hover:text-cyber-cyan transition-colors">{zone.name}</h4>
                        <p className="text-xs font-mono text-gray-400 mt-1">{zone.type} Facility</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-orbitron font-bold text-cyber-cyan">{zone.distance_km} km</div>
                        <button className="text-[10px] uppercase font-mono tracking-widest text-cyber-cyan/70 hover:text-cyber-cyan flex items-center gap-1 mt-1">
                          <Navigation className="w-3 h-3" /> Route
                        </button>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="h-full flex flex-col items-center justify-center text-cyber-red/50 font-mono text-sm animate-pulse">
                      <RadioTower className="w-12 h-12 mb-4 opacity-50" />
                      Scanning for safe zones...
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Footer Actions */}
            <div className="p-6 border-t border-cyber-red/30 bg-black/40 flex justify-between items-center">
              <button className="flex items-center gap-2 text-cyber-red hover:text-white transition-colors font-mono text-xs uppercase tracking-widest">
                <PhoneCall className="w-4 h-4" /> Emergency Contacts
              </button>
              
              <button 
                onClick={handleDeactivate}
                className="px-8 py-3 bg-transparent border-2 border-cyber-red hover:bg-cyber-red text-cyber-red hover:text-white font-orbitron font-bold uppercase tracking-widest transition-all rounded shadow-[0_0_15px_rgba(255,0,60,0.2)] hover:shadow-[0_0_30px_rgba(255,0,60,0.6)]"
              >
                DEACTIVATE PANIC MODE
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
