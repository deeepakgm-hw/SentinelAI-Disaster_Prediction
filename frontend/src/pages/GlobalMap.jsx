import { motion } from 'framer-motion';
import DisasterMap from '../map/DisasterMap';
import FilterBar from '../components/FilterBar';
import { useFilterStore } from '../store/filterStore';
import { useDisasterStore } from '../store/disasterStore';
import { Map, Activity } from 'lucide-react';
import { useMemo } from 'react';

export default function GlobalMap() {
  const events = useDisasterStore((s) => s.events);
  const disasterType = useFilterStore((s) => s.disasterType);
  const severity = useFilterStore((s) => s.severity);

  const filteredCount = useMemo(() => {
    return events.filter((event) => {
      let typeMatch = true;
      if (disasterType !== 'ALL') {
        const t = String(event.type).toLowerCase();
        if (disasterType === 'Earthquake') typeMatch = t.includes('earth') || t.includes('quake');
        else if (disasterType === 'Flood') typeMatch = t.includes('flood') || t.includes('rain');
        else if (disasterType === 'Cyclone') typeMatch = t.includes('cyclone') || t.includes('storm');
        else if (disasterType === 'Wildfire') typeMatch = t.includes('fire') || t.includes('wild');
      }

      let severityMatch = true;
      if (severity !== 'ALL') {
        const mag = Number(event.magnitude || 0);
        if (severity === 'CRITICAL') severityMatch = mag >= 6.0;
        else if (severity === 'HIGH') severityMatch = mag >= 4.5 && mag < 6.0;
        else if (severity === 'MEDIUM') severityMatch = mag >= 3.0 && mag < 4.5;
        else if (severity === 'LOW') severityMatch = mag < 3.0;
      }

      return typeMatch && severityMatch;
    }).length;
  }, [events, disasterType, severity]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col h-full gap-4 relative"
    >
      {/* Header & Controls */}
      <div className="flex items-center justify-between bg-black/40 border border-cyber-border/20 rounded-xl p-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)] z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-cyber-blue/10 border border-cyber-blue/30 flex items-center justify-center">
            <Map className="w-5 h-5 text-cyber-blue" />
          </div>
          <div>
            <h1 className="text-xl font-orbitron font-bold text-white tracking-widest uppercase">Global Map</h1>
            <p className="text-xs font-mono text-gray-400">Interactive 3D Satellite Feed</p>
          </div>
        </div>

        <div className="flex-1 max-w-3xl px-8 hidden xl:block">
          <FilterBar />
        </div>

        <div className="flex items-center gap-4 border-l border-cyber-border/30 pl-6">
          <div className="text-right">
            <p className="text-[10px] font-mono text-cyber-cyan mb-1 tracking-widest uppercase">Monitored Events</p>
            <div className="text-2xl font-orbitron font-bold text-white flex items-center gap-2 justify-end">
              <Activity className="w-4 h-4 text-cyber-cyan animate-pulse" />
              {filteredCount}
            </div>
          </div>
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative rounded-2xl overflow-hidden border border-cyber-border/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        {/* HUD Elements */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded border border-cyber-border/50 flex items-center gap-2 w-fit">
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-red animate-pulse-glow" />
            <span className="text-[10px] font-mono text-cyber-red tracking-widest font-bold">LIVE RECORDING</span>
          </div>
        </div>
        
        <div className="absolute bottom-4 right-4 z-10 bg-black/60 backdrop-blur-md p-3 rounded border border-cyber-border/30 pointer-events-none">
          <h4 className="text-[10px] font-orbitron text-cyber-cyan mb-2 tracking-widest border-b border-cyber-cyan/30 pb-1">MAP LEGEND</h4>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-mono"><span className="w-2 h-2 rounded-full bg-[#FF003C]"></span> Earthquake</div>
            <div className="flex items-center gap-2 text-[10px] font-mono"><span className="w-2 h-2 rounded-full bg-[#FFEA00]"></span> Wildfire</div>
            <div className="flex items-center gap-2 text-[10px] font-mono"><span className="w-2 h-2 rounded-full bg-[#39FF14]"></span> Flood</div>
            <div className="flex items-center gap-2 text-[10px] font-mono"><span className="w-2 h-2 rounded-full bg-[#00F0FF]"></span> Cyclone</div>
          </div>
        </div>

        {/* Globe Instance */}
        <DisasterMap />
      </div>
    </motion.div>
  );
}
