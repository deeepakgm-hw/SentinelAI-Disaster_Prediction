import { AlertTriangle, ShieldAlert, Activity, Radar } from 'lucide-react'
import { motion } from 'framer-motion'
import { useDisasterStore } from '../store/disasterStore'
import { useFilterStore } from '../store/filterStore'
import { useMemo } from 'react'

export default function StatsCards() {
  const events = useDisasterStore((s) => s.events)
  const disasterType = useFilterStore((s) => s.disasterType)
  const severity = useFilterStore((s) => s.severity)

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // 1. Filter by Type
      let typeMatch = true;
      if (disasterType !== 'ALL') {
        const t = String(event.type).toLowerCase();
        if (disasterType === 'Earthquake') typeMatch = t.includes('earth') || t.includes('quake');
        else if (disasterType === 'Flood') typeMatch = t.includes('flood') || t.includes('rain');
        else if (disasterType === 'Cyclone') typeMatch = t.includes('cyclone') || t.includes('storm');
        else if (disasterType === 'Wildfire') typeMatch = t.includes('fire') || t.includes('wild');
      }

      // 2. Filter by Severity (Dummy mapping)
      let severityMatch = true;
      if (severity !== 'ALL') {
        const mag = Number(event.magnitude || 0);
        if (severity === 'CRITICAL') severityMatch = mag >= 6.0;
        else if (severity === 'HIGH') severityMatch = mag >= 4.5 && mag < 6.0;
        else if (severity === 'MEDIUM') severityMatch = mag >= 3.0 && mag < 4.5;
        else if (severity === 'LOW') severityMatch = mag < 3.0;
      }

      return typeMatch && severityMatch;
    });
  }, [events, disasterType, severity]);

  const activeAlerts = filteredEvents.length;
  const criticalAlerts = filteredEvents.filter((e) => Number(e.magnitude) >= 6.0).length;
  const monitoredZones = [...new Set(filteredEvents.map((e) => e.location))].length;

  const cards = [
    {
      title: 'Active Alerts',
      value: activeAlerts,
      icon: AlertTriangle,
      color: 'text-cyber-yellow',
      bg: 'bg-cyber-yellow/10',
      border: 'border-cyber-yellow/30',
      shadow: 'shadow-[0_0_15px_rgba(255,234,0,0.1)]',
    },
    {
      title: 'Critical Incidents',
      value: criticalAlerts,
      icon: ShieldAlert,
      color: 'text-cyber-red',
      bg: 'bg-cyber-red/10',
      border: 'border-cyber-red/30',
      shadow: 'shadow-[0_0_15px_rgba(255,0,60,0.15)]',
    },
    {
      title: 'Monitored Zones',
      value: monitoredZones,
      icon: Radar,
      color: 'text-cyber-blue',
      bg: 'bg-cyber-blue/10',
      border: 'border-cyber-blue/30',
      shadow: 'shadow-[0_0_15px_rgba(0,102,255,0.1)]',
    },
    {
      title: 'System Status',
      value: 'ONLINE',
      icon: Activity,
      color: 'text-cyber-green',
      bg: 'bg-cyber-green/10',
      border: 'border-cyber-green/30',
      shadow: 'shadow-[0_0_15px_rgba(57,255,20,0.1)]',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon

        return (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            key={index}
            className={`glass-card p-4 relative overflow-hidden group ${card.shadow} hover:scale-[1.02] transition-transform duration-300 cursor-default`}
          >
            {/* Top decorative line */}
            <div className={`absolute top-0 left-0 w-full h-1 ${card.bg} border-b ${card.border}`} />
            
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-xs font-mono tracking-wider uppercase mb-1">
                  {card.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <h2 className={`text-3xl font-orbitron font-bold text-white group-hover:${card.color} transition-colors`}>
                    {card.value}
                  </h2>
                  {card.title === 'System Status' && (
                    <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse-glow" />
                  )}
                </div>
              </div>

              <div className={`w-10 h-10 rounded border ${card.border} ${card.bg} flex items-center justify-center`}>
                <Icon className={card.color} size={20} />
              </div>
            </div>
            
            {/* Background decoration */}
            <Icon className={`absolute -bottom-4 -right-4 w-24 h-24 opacity-5 ${card.color} group-hover:opacity-10 transition-opacity`} />
          </motion.div>
        )
      })}
    </div>
  )
}
