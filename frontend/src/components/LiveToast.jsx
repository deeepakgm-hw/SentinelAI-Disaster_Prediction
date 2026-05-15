import { useEffect } from 'react'
import { AlertTriangle, Radio } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToastStore } from '../store/toastStore'

export default function LiveToast() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  useEffect(() => {
    if (!toasts.length) return
    const timers = toasts.map((toast) =>
      setTimeout(() => {
        removeToast(toast.id)
      }, 5000)
    )
    return () => {
      timers.forEach(clearTimeout)
    }
  }, [toasts, removeToast])

  return (
    <div className="fixed top-6 right-6 z-[99999] flex flex-col gap-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9, skewX: 10 }}
            animate={{ opacity: 1, x: 0, scale: 1, skewX: 0 }}
            exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="w-[360px] pointer-events-auto bg-cyber-dark/90 backdrop-blur-md border border-cyber-red/50 shadow-[0_0_20px_rgba(255,0,60,0.3)] rounded-lg p-4 relative overflow-hidden group"
          >
            {/* Animated Cyber Lines */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyber-red to-transparent opacity-70 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyber-red to-transparent opacity-70 animate-pulse" />
            
            <div className="absolute top-0 right-0 w-16 h-full bg-cyber-red/5 skew-x-12 translate-x-4 animate-glitch" />

            <div className="flex items-start gap-4 relative z-10">
              <div className="p-3 rounded-lg bg-cyber-red/10 border border-cyber-red/30 text-cyber-red relative shadow-[0_0_15px_rgba(255,0,60,0.2)]">
                <AlertTriangle size={24} className="animate-pulse" />
                <div className="absolute inset-0 border border-cyber-red/50 animate-ping rounded-lg" />
              </div>

              <div className="flex-1 font-mono">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-white font-orbitron tracking-wide truncate pr-2">
                    {toast.title}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-red text-cyber-dark font-bold uppercase tracking-widest animate-pulse-glow flex items-center gap-1 shrink-0">
                    <Radio size={10} /> LIVE
                  </span>
                </div>

                <p className="text-cyber-cyan/80 text-xs mb-3 truncate border-b border-cyber-cyan/20 pb-2">
                  {toast.location}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-1">
                    <div className="w-1 h-1 bg-cyber-red rounded-full animate-ping" />
                    Incoming Threat
                  </span>
                  <span className="text-cyber-red text-xs font-bold bg-cyber-red/10 px-2 py-0.5 rounded border border-cyber-red/30">
                    {toast.level}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
