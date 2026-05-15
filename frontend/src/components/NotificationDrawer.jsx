import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, Check, Trash2, ShieldAlert, AlertTriangle, Info, Skull } from 'lucide-react'
import { useUIStore } from '../store/uiStore'
import { useNotificationStore } from '../store/notificationStore'
import { getNotifications, markNotificationRead, markAllNotificationsRead, clearNotifications } from '../services/api'
import toast from 'react-hot-toast'

const severityConfig = {
  LOW: { color: 'text-cyber-cyan', border: 'border-cyber-cyan/30', bg: 'bg-cyber-cyan/5', icon: Info },
  MEDIUM: { color: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-500/5', icon: AlertTriangle },
  HIGH: { color: 'text-orange-500', border: 'border-orange-500/30', bg: 'bg-orange-500/5', icon: ShieldAlert },
  CRITICAL: { color: 'text-cyber-red', border: 'border-cyber-red/50', bg: 'bg-cyber-red/10', icon: Skull, glow: 'shadow-[0_0_15px_rgba(255,0,60,0.2)]' }
}

export default function NotificationDrawer() {
  const isNotificationsOpen = useUIStore((s) => s.isNotificationsOpen)
  const closeNotifications = useUIStore((s) => s.closeNotifications)
  
  const notifications = useNotificationStore((s) => s.notifications)
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const setNotifications = useNotificationStore((s) => s.setNotifications)
  const markAsRead = useNotificationStore((s) => s.markAsRead)
  const markAllAsReadStore = useNotificationStore((s) => s.markAllAsRead)
  const clearNotificationsStore = useNotificationStore((s) => s.clearNotifications)

  useEffect(() => {
    if (isNotificationsOpen) {
      loadNotifications()
    }
  }, [isNotificationsOpen])

  const loadNotifications = async () => {
    try {
      const data = await getNotifications()
      setNotifications(data)
    } catch (error) {
      console.error("Failed to fetch notifications", error)
    }
  }

  const handleRead = async (id) => {
    try {
      await markNotificationRead(id)
      markAsRead(id)
    } catch (error) {
      console.error("Failed to update status", error)
      toast.error("Failed to update status")
    }
  }

  const handleReadAll = async () => {
    try {
      await markAllNotificationsRead()
      markAllAsReadStore()
      toast.success("All comms acknowledged")
    } catch (error) {
      console.error("Failed to update", error)
      toast.error("Failed to update")
    }
  }

  const handleClear = async () => {
    try {
      await clearNotifications()
      clearNotificationsStore()
      toast.success("Logs wiped")
    } catch (error) {
      console.error("Failed to wipe logs", error)
      toast.error("Failed to wipe logs")
    }
  }

  return (
    <AnimatePresence>
      {isNotificationsOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-16 right-0 bottom-0 w-full md:w-[450px] z-40 flex flex-col bg-cyber-darker/95 backdrop-blur-2xl border-l border-cyber-red/30 shadow-[-10px_0_40px_rgba(255,0,60,0.05)] font-mono text-sm"
        >
          {/* Header */}
          <div className="p-4 border-b border-cyber-red/30 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="w-5 h-5 text-cyber-red animate-pulse-glow" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#fff] animate-ping" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-orbitron font-bold text-white tracking-widest text-sm uppercase">Comms & Alerts</span>
                <span className="text-[10px] text-cyber-red/70 tracking-widest uppercase">{unreadCount} Unread Transmissions</span>
              </div>
            </div>
            <button onClick={closeNotifications} className="p-1 text-gray-400 hover:text-cyber-red transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="p-2 flex border-b border-cyber-red/20 bg-black/20 text-[10px] uppercase tracking-widest text-gray-400">
            <button onClick={handleReadAll} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-white/5 hover:text-white transition-colors border-r border-cyber-red/20">
              <Check size={14} /> Acknowledge All
            </button>
            <button onClick={handleClear} className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-cyber-red/10 hover:text-cyber-red transition-colors">
              <Trash2 size={14} /> Wipe Logs
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 relative scrollbar-thin scrollbar-thumb-cyber-red/30 scrollbar-track-transparent">
            {notifications.length === 0 ? (
              <div className="text-center text-gray-500 mt-20 text-xs tracking-widest uppercase">
                <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-20" />
                No active transmissions
              </div>
            ) : (
              notifications.map((n) => {
                const conf = severityConfig[n.severity] || severityConfig.LOW
                const Icon = conf.icon
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={n.id}
                    className={`p-4 border ${conf.border} ${conf.bg} ${conf.glow || ''} relative group overflow-hidden`}
                  >
                    {!n.is_read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyber-red animate-pulse" />
                    )}
                    
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-sm border ${conf.border} bg-black/40 ${conf.color}`}>
                        <Icon size={20} className={n.severity === 'CRITICAL' ? 'animate-pulse' : ''} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className={`text-xs font-bold uppercase tracking-widest ${n.is_read ? 'text-gray-300' : 'text-white'}`}>
                            {n.title}
                          </h4>
                          <span className="text-[9px] text-gray-500 whitespace-nowrap ml-2">
                            {new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        
                        <p className={`text-[10px] leading-relaxed mb-3 ${n.is_read ? 'text-gray-500' : 'text-gray-300'}`}>
                          {n.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] px-2 py-0.5 border ${conf.border} ${conf.color} bg-black/40 rounded-sm`}>
                            {n.disaster_type} • {n.severity}
                          </span>
                          
                          {!n.is_read && (
                            <button 
                              onClick={() => handleRead(n.id)}
                              className="text-[9px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1"
                            >
                              <Check size={10} /> Mark Read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
