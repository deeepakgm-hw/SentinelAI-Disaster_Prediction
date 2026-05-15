import { useFilterStore } from '../store/filterStore'
import { motion } from 'framer-motion'
import { Filter } from 'lucide-react'

const disasterTypes = [
  'ALL',
  'Earthquake',
  'Flood',
  'Wildfire',
  'Cyclone',
]

const severityLevels = [
  'ALL',
  'CRITICAL',
  'HIGH',
  'MEDIUM',
  'LOW',
]

export default function FilterBar() {
  const disasterType = useFilterStore((s) => s.disasterType)
  const severity = useFilterStore((s) => s.severity)
  const setDisasterType = useFilterStore((s) => s.setDisasterType)
  const setSeverity = useFilterStore((s) => s.setSeverity)

  return (
    <div className="flex items-center justify-between gap-4 glass-panel p-2 rounded-xl relative z-10">
      
      {/* FILTER HEADER */}
      <div className="hidden md:flex items-center gap-2 px-3 border-r border-cyber-border/50 text-cyber-cyan/80">
        <Filter className="w-4 h-4" />
        <span className="text-xs font-mono font-bold tracking-widest uppercase">Params</span>
      </div>

      {/* Disaster Type Filters */}
      <div className="flex items-center gap-2 flex-1 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
        {disasterTypes.map((type) => {
          const isActive = String(disasterType).toLowerCase() === type.toLowerCase();
          return (
            <button
              key={type}
              onClick={() => setDisasterType(type)}
              className={`
                relative px-4 py-1.5 rounded text-xs font-orbitron tracking-wider transition-all duration-300 uppercase shrink-0
                ${isActive 
                  ? 'text-cyber-dark font-bold' 
                  : 'text-slate-400 hover:text-white hover:bg-cyber-panel border border-transparent'
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-cyber-cyan rounded shadow-cyber-cyan"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ zIndex: -1 }}
                />
              )}
              <span className="relative z-10">{type}</span>
            </button>
          )
        })}
      </div>

      {/* Severity Filters */}
      <div className="flex items-center gap-2 border-l border-cyber-border/50 pl-4 shrink-0 hidden lg:flex">
        {severityLevels.map((level) => {
          const isActive = severity === level;
          return (
            <button
              key={level}
              onClick={() => setSeverity(level)}
              className={`
                relative px-3 py-1 rounded text-[10px] font-mono tracking-wider transition-all duration-300
                ${isActive 
                  ? 'text-white border border-cyber-red shadow-[0_0_10px_rgba(255,0,60,0.3)] bg-cyber-red/20 font-bold' 
                  : 'text-slate-500 hover:text-cyber-red border border-transparent'
                }
              `}
            >
              {level}
            </button>
          )
        })}
      </div>
    </div>
  )
}
