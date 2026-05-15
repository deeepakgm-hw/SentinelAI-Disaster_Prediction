import { motion } from 'framer-motion';
import { ShieldAlert, Users, Truck, Navigation, AlertTriangle, Send } from 'lucide-react';

export default function Emergency() {


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col h-full gap-6 relative overflow-y-auto custom-scrollbar pr-2"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-[#1a0505]/80 border border-cyber-red/30 rounded-xl p-6 shadow-[0_4px_30px_rgba(255,0,60,0.15)] z-20 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-cyber-red/20 border border-cyber-red/50 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-cyber-red animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-orbitron font-bold text-white tracking-widest uppercase">Emergency Command</h1>
            <p className="text-sm font-mono text-cyber-red/80 mt-1">Tactical Response & Evacuation Coordination</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-cyber-red/20 border border-cyber-red text-cyber-red font-bold py-2 px-4 rounded font-orbitron text-sm uppercase tracking-wider shadow-[0_0_15px_rgba(255,0,60,0.2)]">
            <Send className="w-4 h-4" />
            READY TO TRANSMIT
          </div>
          <div className="hidden lg:flex items-center gap-6 border-l border-cyber-red/30 pl-6">
            <div className="text-right">
              <p className="text-[10px] font-mono text-cyber-red mb-1 tracking-widest uppercase">DEFCON LEVEL</p>
              <div className="text-3xl font-orbitron font-bold text-cyber-red animate-pulse">2</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Resource Cards */}
        {[
          { title: "Active Evacuations", value: "14,205", icon: Navigation, color: "text-orange-500", border: "border-orange-500/30" },
          { title: "Shelter Capacity", value: "84%", icon: Users, color: "text-cyber-green", border: "border-cyber-green/30" },
          { title: "Rescue Units Deployed", value: "342", icon: Truck, color: "text-cyber-blue", border: "border-cyber-blue/30" },
          { title: "Critical SOS Signals", value: "89", icon: AlertTriangle, color: "text-cyber-red", border: "border-cyber-red/30" }
        ].map((stat, i) => (
          <div key={i} className={`bg-black/40 border ${stat.border} rounded-xl p-4 shadow-lg flex items-center justify-between group hover:bg-white/5 transition-colors`}>
            <div>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">{stat.title}</p>
              <h3 className={`text-2xl font-orbitron font-bold ${stat.color}`}>{stat.value}</h3>
            </div>
            <stat.icon className={`w-8 h-8 ${stat.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[400px]">
        {/* Resource Allocation */}
        <div className="bg-black/40 border border-cyber-border/20 rounded-xl p-6 shadow-lg flex flex-col">
          <h3 className="font-orbitron font-bold text-white tracking-widest uppercase mb-4 border-b border-cyber-border/20 pb-2">
            Resource Allocation Matrix
          </h3>
          <div className="flex-1 space-y-4 font-mono text-xs">
            {[
              { region: "Pacific Coast", units: 120, status: "Deployed", bar: "w-[80%]", bg: "bg-orange-500" },
              { region: "South East Asia", units: 85, status: "In Transit", bar: "w-[60%]", bg: "bg-cyber-yellow" },
              { region: "Mediterranean", units: 45, status: "Standby", bar: "w-[30%]", bg: "bg-cyber-blue" },
              { region: "South America", units: 92, status: "Deployed", bar: "w-[75%]", bg: "bg-cyber-red" },
            ].map((res, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-bold">{res.region}</span>
                  <span className={`${res.bg.replace('bg-', 'text-')}`}>{res.status} ({res.units} Units)</span>
                </div>
                <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                  <div className={`h-full ${res.bg} ${res.bar}`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SOS Feed / Escalation */}
        <div className="bg-[#1a0505]/50 border border-cyber-red/20 rounded-xl p-6 shadow-lg flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b border-cyber-red/20 pb-2">
            <h3 className="font-orbitron font-bold text-cyber-red tracking-widest uppercase flex items-center gap-2">
              <div className="w-2 h-2 bg-cyber-red rounded-full animate-pulse-glow" />
              Live SOS Intercepts
            </h3>
            <span className="text-[10px] font-mono bg-cyber-red/10 border border-cyber-red/30 text-cyber-red px-2 py-1 rounded">UNVERIFIED</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
            {[
              { time: "-2 mins", text: "Multiple distress beacons activated in Sector 4 (Tokyo Coast)." },
              { time: "-5 mins", text: "Local emergency frequencies overwhelmed. Comm blackout detected." },
              { time: "-12 mins", text: "Satellite thermal spike confirms secondary ignition in Athens." },
              { time: "-18 mins", text: "Water levels breached primary levee at Station 9." },
              { time: "-22 mins", text: "Automated seismic alert triggered shutdown protocols." },
            ].map((sos, i) => (
              <div key={i} className="flex gap-4 items-start border-l-2 border-cyber-red/50 pl-3 py-1">
                <span className="text-xs font-mono text-cyber-red/60 shrink-0 mt-0.5">{sos.time}</span>
                <p className="text-xs font-mono text-gray-300">{sos.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
