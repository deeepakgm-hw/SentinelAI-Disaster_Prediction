import { LayoutDashboard, Map, Bell, ShieldAlert, BrainCircuit, Settings, Activity, Cpu } from 'lucide-react'
import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'

const menu = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Global Map', path: '/map', icon: Map },
  { name: 'Alert Feeds', path: '/alerts', icon: Bell },
  { name: 'Emergency', path: '/emergency', icon: ShieldAlert },
  { name: 'AI Prediction', path: '/ai', icon: BrainCircuit },
  { name: 'Settings', path: '/settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="w-[260px] bg-cyber-darker border-r border-cyber-border/20 h-screen p-5 flex flex-col relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
      
      {/* BRANDING */}
      <div className="flex items-center gap-3 mb-10 mt-2">
        <div className="w-10 h-10 bg-cyber-cyan/5 border border-cyber-cyan/30 rounded flex items-center justify-center relative overflow-hidden">
          <Activity className="w-5 h-5 text-cyber-cyan" />
        </div>
        <div>
          <h1 className="text-xl font-orbitron font-bold text-white tracking-widest">
            SENTINEL<span className="text-cyber-cyan"> AI</span>
          </h1>
          <p className="text-cyber-cyan/50 text-[9px] font-mono tracking-[0.2em] uppercase mt-0.5">
            Command Center
          </p>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-1.5">
        {menu.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              to={item.path}
              key={item.name}
              className={({ isActive }) => `
                w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 font-mono text-xs relative group overflow-hidden
                ${isActive 
                  ? 'bg-cyber-cyan/10 text-cyber-cyan font-bold border border-cyber-cyan/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-cyber-cyan rounded-r" 
                    />
                  )}
                  <Icon size={16} className={`${isActive ? 'text-cyber-cyan drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]' : 'group-hover:text-white transition-colors'}`} />
                  <span className="tracking-wide">{item.name}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* SYSTEM STATUS */}
      <div className="mt-auto bg-black/40 border border-cyber-border/20 rounded-xl p-4 relative overflow-hidden group">
        <h3 className="font-mono text-[10px] font-bold text-slate-500 tracking-wider mb-2 uppercase">
          System Core
        </h3>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-cyber-dark border border-cyber-green/20 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-cyber-green" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse-glow" />
              <span className="text-white text-xs font-bold font-orbitron tracking-wider">ONLINE</span>
            </div>
            <p className="text-[9px] font-mono text-slate-500 mt-1">Uplink: 99.9% | Lvl 5</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
