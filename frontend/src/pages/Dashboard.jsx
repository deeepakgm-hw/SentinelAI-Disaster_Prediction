import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'

import StatsCards from '../components/StatsCards'
import FilterBar from '../components/FilterBar'
import DisasterMap from '../map/DisasterMap'
import AIPrediction from '../components/AIPrediction'

import { getEvents, getAlerts, getCyclones, getFloods } from '../services/api'
import { useDisasterStore } from '../store/disasterStore'
import { useFilterStore } from '../store/filterStore'
import { useMemo } from 'react'

export default function Dashboard() {
  const [rawAlerts, setRawAlerts] = useState([])
  const setEvents = useDisasterStore((s) => s.setEvents)
  const disasterType = useFilterStore((s) => s.disasterType)
  const severity = useFilterStore((s) => s.severity)

  const alerts = useMemo(() => {
    return rawAlerts.filter((alert) => {
      let typeMatch = true;
      if (disasterType !== 'ALL') {
        const t = String(alert.title).toLowerCase();
        if (disasterType === 'Earthquake') typeMatch = t.includes('earth') || t.includes('quake') || t.includes('m ');
        else if (disasterType === 'Flood') typeMatch = t.includes('flood') || t.includes('rain');
        else if (disasterType === 'Cyclone') typeMatch = t.includes('cyclone') || t.includes('storm');
        else if (disasterType === 'Wildfire') typeMatch = t.includes('fire') || t.includes('wild');
      }

      let severityMatch = true;
      if (severity !== 'ALL') {
        const level = String(alert.level).toUpperCase();
        if (severity === 'CRITICAL') severityMatch = level === 'CRITICAL';
        else if (severity === 'HIGH') severityMatch = level === 'HIGH';
        else if (severity === 'MEDIUM') severityMatch = level === 'MEDIUM';
        else if (severity === 'LOW') severityMatch = level === 'LOW';
      }

      return typeMatch && severityMatch;
    });
  }, [rawAlerts, disasterType, severity]);

  useEffect(() => {
    async function loadData() {
      let combinedEvents = []
      let combinedAlerts = []
      
      try {
        const eventsData = await getEvents()
        combinedEvents = [...eventsData]
      } catch (error) {
        console.error('Failed to load events:', error)
      }

      try {
        const alertsData = await getAlerts()
        combinedAlerts = [...alertsData]
      } catch (error) {
        console.error('Failed to load alerts:', error)
      }
      
      try {
        const cyclones = await getCyclones()
        combinedEvents = [...combinedEvents, ...cyclones]
        combinedAlerts = [...combinedAlerts, ...cyclones]
      } catch (error) {
        console.error('Failed to load cyclones:', error)
      }
      
      try {
        const floods = await getFloods()
        combinedEvents = [...combinedEvents, ...floods]
        combinedAlerts = [...combinedAlerts, ...floods]
      } catch (error) {
        console.error('Failed to load floods:', error)
      }

      setEvents(combinedEvents)
      setRawAlerts(combinedAlerts)
    }

    loadData()
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [setEvents])

  return (
    <div className="flex-1 flex gap-6 overflow-hidden h-full pb-4">
      
      {/* CENTER PANEL: 3D MAP */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-[2.5] flex flex-col gap-6 relative h-full"
      >
        {/* TOP STATS & FILTERS */}
        <div className="flex flex-col gap-4">
          <StatsCards />
          <FilterBar />
        </div>

        {/* MAP CONTAINER */}
        <div className="flex-1 glass-card overflow-hidden relative shadow-[0_4px_30px_rgba(0,0,0,0.3)] bg-black/40 group border border-cyber-border/20 rounded-2xl">
          {/* Header Overlay */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
            <div className="bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-cyber-border/50 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse-glow" />
              <span className="text-xs font-orbitron text-cyber-cyan tracking-widest font-bold">LIVE GLOBAL SATELLITE</span>
            </div>
          </div>

          <DisasterMap />
        </div>
      </motion.div>

      {/* RIGHT PANEL: ALERTS & AI */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="flex-1 w-full max-w-[400px] flex flex-col gap-6 h-full overflow-hidden"
      >
        {/* LIVE ALERTS SECTION */}
        <div className="flex-1 bg-black/40 border border-cyber-border/20 rounded-2xl p-4 flex flex-col overflow-hidden relative shadow-[0_4px_30px_rgba(0,0,0,0.3)] min-h-0">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-cyber-border/20 shrink-0">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyber-red animate-pulse" />
              <h2 className="text-sm font-orbitron font-bold text-white tracking-widest uppercase">EMERGENCY FEED</h2>
            </div>
            <div className="text-[9px] font-mono font-bold text-cyber-red border border-cyber-red/30 px-1.5 py-0.5 rounded bg-cyber-red/10 animate-pulse-glow">
              CRITICAL
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {alerts.length === 0 ? (
              <div className="text-cyber-border text-center py-10 font-mono text-xs animate-pulse">Scanning frequencies...</div>
            ) : (
              alerts.map((alert, idx) => (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={alert.id}
                  className="bg-white/5 border-l-2 border-cyber-red p-3 rounded hover:bg-white/10 transition-colors group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-white text-xs group-hover:text-cyber-cyan transition-colors line-clamp-1">{alert.title}</h3>
                    <span className="text-[9px] font-mono font-bold text-cyber-red/90 bg-cyber-red/10 px-1.5 py-0.5 rounded">
                      {alert.level}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-mono truncate">{alert.location}</p>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* AI PREDICTION SECTION */}
        <div className="shrink-0 h-[45%] min-h-[320px] flex flex-col">
          <AIPrediction />
        </div>
      </motion.div>

    </div>
  )
}
