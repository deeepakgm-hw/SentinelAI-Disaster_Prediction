import { Bell, Bot, Scan, TerminalSquare, LogOut, User, Siren } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useUIStore } from '../store/uiStore'
import { useNotificationStore } from '../store/notificationStore'
import { useEmergencyStore } from '../store/emergencyStore'
import { useLiveGPS } from '../hooks/useLiveGPS'
import { simulateEmergency } from '../services/api'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Navbar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const toggleNotifications = useUIStore((s) => s.toggleNotifications)
  const isTrackingGPS = useEmergencyStore((s) => s.isTrackingGPS)
  const { toggleTracking, simulateDanger } = useLiveGPS()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast('Session Terminated', { icon: '👋' })
    navigate('/welcome')
  }

  const handleSimulateEmergency = async () => {
    try {
      await simulateEmergency()
    } catch (error) {
      console.error("Simulation failed", error)
      toast.error("Simulation failed")
    }
  }

  return (
    <header className="h-16 border-b border-cyber-cyan/20 bg-cyber-dark/80 backdrop-blur-xl flex items-center justify-between px-6 z-30 shadow-[0_4px_30px_rgba(0,240,255,0.05)]">
      
      <div className="flex items-center gap-4">
        <Scan className="text-cyber-cyan w-6 h-6 animate-[spin_10s_linear_infinite]" />
        
        <div className="flex flex-col">
          <h2 className="text-lg font-orbitron font-bold text-white tracking-widest uppercase">
            Sentinel Core Network
          </h2>
          <span className="text-[10px] text-cyber-cyan/60 font-mono flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-pulse-glow" />
            NEURAL UPLINK SECURED & ACTIVE
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 relative">
        <div className="hidden md:flex items-center gap-3 mr-4 border-r border-cyber-border/50 pr-4">
          <button 
            onClick={toggleTracking} 
            className={`p-1.5 px-3 rounded flex items-center gap-2 font-orbitron text-xs tracking-wider transition-colors border ${isTrackingGPS ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan shadow-[0_0_10px_rgba(0,240,255,0.3)]' : 'border-gray-600 bg-gray-800 text-gray-400 hover:text-white'}`}
          >
            <Scan size={14} className={isTrackingGPS ? "animate-spin" : ""} />
            {isTrackingGPS ? 'GPS ACTIVE' : 'ENABLE GPS SHIELD'}
          </button>

          {isTrackingGPS && (
             <button 
               onClick={simulateDanger} 
               title="Simulate Danger Proximity" 
               className="p-1.5 px-3 rounded border border-cyber-red/30 bg-cyber-red/10 hover:bg-cyber-red/20 text-cyber-red text-xs font-mono font-bold transition-colors"
             >
               DEMO DANGER
             </button>
          )}

          <button onClick={handleSimulateEmergency} title="Trigger Mock Emergency" className="p-1.5 rounded hover:bg-cyber-red/20 text-cyber-red/50 hover:text-cyber-red transition-colors ml-2">
            <Siren size={14} />
          </button>
        </div>

        {user && (
          <div className="flex items-center gap-2 mr-2 bg-black/40 border border-cyber-cyan/30 px-3 py-1 rounded-sm text-xs font-mono text-cyber-cyan tracking-widest">
            <User size={14} />
            <span className="uppercase">{user.username}</span>
          </div>
        )}

        <button 
          onClick={useUIStore((s) => s.toggleChat)}
          className="relative p-2 rounded border border-cyber-blue/30 bg-cyber-blue/10 text-cyber-blue hover:bg-cyber-blue/20 hover:shadow-[0_0_15px_rgba(0,102,255,0.4)] transition-all group overflow-hidden"
        >
          <Bot size={20} className="relative z-10 group-hover:scale-110 transition-transform" />
        </button>

        <button 
          onClick={toggleNotifications}
          className="relative p-2 rounded border border-cyber-red/30 bg-cyber-red/10 text-cyber-red hover:bg-cyber-red/20 hover:shadow-[0_0_15px_rgba(255,0,60,0.4)] transition-all group overflow-hidden"
        >
          <Bell size={20} className="relative z-10 group-hover:scale-110 transition-transform" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-cyber-red text-white text-[9px] font-bold shadow-[0_0_8px_#FF003C] animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        <button 
          onClick={handleLogout}
          className="ml-2 relative p-2 rounded border border-gray-600 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all group"
          title="Disconnect Session"
        >
          <LogOut size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </header>
  )
}
