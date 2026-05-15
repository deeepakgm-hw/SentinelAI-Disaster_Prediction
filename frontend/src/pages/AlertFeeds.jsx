import { motion } from 'framer-motion';
import { Bell, Search, ShieldAlert, Activity } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useDisasterStore } from '../store/disasterStore';
import { useFilterStore } from '../store/filterStore';

export default function AlertFeeds() {
  const events = useDisasterStore((s) => s.events);
  const globalDisasterType = useFilterStore((s) => s.disasterType);
  const globalSeverity = useFilterStore((s) => s.severity);
  
  const [searchTerm, setSearchTerm] = useState('');

  // Map events to alert format and filter
  const alerts = useMemo(() => {
    return events
      .map((e, idx) => {
        const mag = Number(e.magnitude || 0);
        let level = 'LOW';
        if (mag >= 6.0) level = 'CRITICAL';
        else if (mag >= 4.5) level = 'HIGH';
        else if (mag >= 3.0) level = 'MEDIUM';
        
        // Deterministic pseudo-random values based on index and magnitude
        const pseudoRand1 = Math.floor((idx * 17 + mag * 13) % 100);
        const pseudoRand2 = Math.floor((idx * 23 + mag * 19) % 20);
        
        // Format a time string like HH:MM:SS deterministically
        const hours = String((14 + (pseudoRand1 % 10)) % 24).padStart(2, '0');
        const minutes = String(pseudoRand1 % 60).padStart(2, '0');
        const seconds = String(pseudoRand2 % 60).padStart(2, '0');

        return {
          id: e.id || idx,
          title: e.title || `Anomaly Detected`,
          type: String(e.type).toUpperCase(),
          location: e.location || 'Unknown Coordinates',
          magnitude: mag,
          level: level,
          time: `${hours}:${minutes}:${seconds} UTC`,
          confidence: (80 + pseudoRand2) + '%'
        };
      })
      .filter((alert) => {
        // Global Filters
        let typeMatch = true;
        if (globalDisasterType !== 'ALL') {
          typeMatch = alert.type.includes(globalDisasterType.toUpperCase()) || 
                     (globalDisasterType === 'Earthquake' && alert.title.toLowerCase().includes('m '));
        }
        
        let severityMatch = true;
        if (globalSeverity !== 'ALL') {
          severityMatch = alert.level === globalSeverity;
        }

        // Local Search Filter
        const searchMatch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           alert.location.toLowerCase().includes(searchTerm.toLowerCase());

        return typeMatch && severityMatch && searchMatch;
      });
  }, [events, globalDisasterType, globalSeverity, searchTerm]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col h-full gap-4 relative"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-black/40 border border-cyber-border/20 rounded-xl p-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)] z-20 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-cyber-red/10 border border-cyber-red/30 flex items-center justify-center">
            <Bell className="w-5 h-5 text-cyber-red animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-orbitron font-bold text-white tracking-widest uppercase">Live Alert Feeds</h1>
            <p className="text-xs font-mono text-gray-400">Realtime Global Incident Reports</p>
          </div>
        </div>

        {/* Local Search */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-cyber-cyan/50" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-cyber-border/30 rounded-lg leading-5 bg-black/50 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan sm:text-sm font-mono transition-all"
            placeholder="Search incident, location, or coordinates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Alerts Table/Grid */}
      <div className="flex-1 bg-black/40 border border-cyber-border/20 rounded-2xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex flex-col">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-cyber-border/20 bg-white/5 text-xs font-mono text-gray-400 font-bold uppercase tracking-widest hidden md:grid">
          <div className="col-span-1">Status</div>
          <div className="col-span-3">Incident</div>
          <div className="col-span-3">Location</div>
          <div className="col-span-2">Classification</div>
          <div className="col-span-2">Time (UTC)</div>
          <div className="col-span-1 text-right">AI Conf</div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-cyber-border font-mono">
              <ShieldAlert className="w-12 h-12 mb-4 opacity-50" />
              <p>NO ACTIVE ALERTS MATCHING CRITERIA</p>
            </div>
          ) : (
            alerts.map((alert, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={alert.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-cyber-border/10 rounded-xl bg-black/40 hover:bg-white/5 transition-colors items-center group cursor-pointer"
              >
                {/* Status */}
                <div className="col-span-1 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    alert.level === 'CRITICAL' ? 'bg-cyber-red animate-pulse-glow' : 
                    alert.level === 'HIGH' ? 'bg-orange-500 animate-pulse' : 
                    alert.level === 'MEDIUM' ? 'bg-cyber-yellow' : 'bg-cyber-cyan'
                  }`} />
                  <span className={`text-[10px] font-bold tracking-wider ${
                    alert.level === 'CRITICAL' ? 'text-cyber-red' : 
                    alert.level === 'HIGH' ? 'text-orange-500' : 
                    alert.level === 'MEDIUM' ? 'text-cyber-yellow' : 'text-cyber-cyan'
                  }`}>{alert.level}</span>
                </div>

                {/* Incident */}
                <div className="col-span-3">
                  <h3 className="font-bold text-white text-sm group-hover:text-cyber-cyan transition-colors">{alert.title}</h3>
                </div>

                {/* Location */}
                <div className="col-span-3">
                  <p className="text-xs text-gray-400 font-mono truncate flex items-center gap-2">
                    {alert.location}
                  </p>
                </div>

                {/* Classification */}
                <div className="col-span-2">
                  <span className="inline-block px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-white font-mono tracking-wider">
                    {alert.type}
                  </span>
                </div>

                {/* Time */}
                <div className="col-span-2 text-xs font-mono text-gray-500">
                  {alert.time}
                </div>

                {/* AI Confidence */}
                <div className="col-span-1 text-right text-xs font-mono text-cyber-green flex justify-end items-center gap-1">
                  <Activity className="w-3 h-3" />
                  {alert.confidence}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
