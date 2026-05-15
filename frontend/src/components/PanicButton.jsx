import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, Crosshair } from 'lucide-react'
import { useUIStore } from '../store/uiStore'
import { useEmergencyStore } from '../store/emergencyStore'
import { sendEmergencyLocation, getNearbySafezones } from '../services/api'
import toast from 'react-hot-toast'

export default function PanicButton() {
  const [isHovered, setIsHovered] = useState(false)
  const [isActivating, setIsActivating] = useState(false)
  
  const setEvacuationMode = useUIStore((s) => s.setEvacuationMode)
  const setLiveLocation = useEmergencyStore((s) => s.setLiveLocation)
  const setSafeZones = useEmergencyStore((s) => s.setSafeZones)

  const handlePanic = async () => {
    setIsActivating(true)
    
    // 1. Get Geolocation
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setLiveLocation(latitude, longitude)
          
          try {
            // 2. Send location to backend
            await sendEmergencyLocation(latitude, longitude)
            
            // 3. Fetch Safe Zones
            const zones = await getNearbySafezones(latitude, longitude)
            setSafeZones(zones)
            
            // 4. Trigger Twilio SMS Alert (using existing route)
            await fetch('http://localhost:8000/api/send-alert', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                phone: '+919380362266', // placeholder
                message: `EMERGENCY PANIC ALERT: User at LAT:${latitude}, LNG:${longitude} has triggered evacuation protocol.`
              })
            }).catch(e => console.error("SMS failed", e))
            
            // 5. Activate Fullscreen Evacuation Mode
            setEvacuationMode(true)
            toast.success("Evacuation Protocol Initiated", { icon: '🚨' })
            
          } catch (error) {
            console.error("Emergency initialization failed", error)
            toast.error("Network error during broadcast")
            setEvacuationMode(true) // Open anyway for visual effect
          }
          setIsActivating(false)
        },
        (error) => {
          console.error('Error getting location', error)
          toast.error("Location access denied. Using estimated coordinates.")
          // Fallback to estimated/fake coordinates if denied so we can still show the UI
          const fakeLat = 37.7749
          const fakeLng = -122.4194
          setLiveLocation(fakeLat, fakeLng)
          setEvacuationMode(true)
          setIsActivating(false)
        }
      )
    } else {
      toast.error("Geolocation not supported")
      setIsActivating(false)
    }
  }

  return (
    <div className="fixed bottom-8 right-8 z-40">
      <AnimatePresence>
        {isHovered && !isActivating && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap bg-cyber-red/20 border border-cyber-red backdrop-blur-md text-white font-orbitron font-bold tracking-widest px-4 py-2 rounded shadow-[0_0_15px_rgba(255,0,60,0.5)]"
          >
            INITIATE PANIC ALERT
          </motion.div>
        )}
      </AnimatePresence>
      
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handlePanic}
        disabled={isActivating}
        className="relative group w-20 h-20 bg-black rounded-full border-4 border-cyber-red flex items-center justify-center shadow-[0_0_30px_rgba(255,0,60,0.6)] hover:shadow-[0_0_50px_rgba(255,0,60,0.8)] transition-all overflow-hidden disabled:opacity-50"
      >
        {/* Pulsing rings */}
        <div className="absolute inset-0 rounded-full border border-cyber-red animate-ping opacity-50" />
        <div className="absolute inset-2 rounded-full border border-cyber-red animate-ping opacity-30" style={{ animationDelay: '0.5s' }} />
        
        {/* Inner background hover effect */}
        <div className="absolute inset-0 bg-cyber-red scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full" />
        
        {isActivating ? (
          <Crosshair className="w-8 h-8 text-cyber-red animate-spin relative z-10" />
        ) : (
          <ShieldAlert className="w-8 h-8 text-cyber-red group-hover:text-white transition-colors relative z-10 animate-pulse" />
        )}
      </button>
    </div>
  )
}
