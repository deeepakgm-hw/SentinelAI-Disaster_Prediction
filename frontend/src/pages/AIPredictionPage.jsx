import { motion } from 'framer-motion';
import { Cpu, Activity, TrendingUp, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useState, useEffect } from 'react';

// Dummy data for AI charts
const timelineData = [
  { time: '00:00', risk: 30, probability: 45 },
  { time: '04:00', risk: 35, probability: 48 },
  { time: '08:00', risk: 45, probability: 52 },
  { time: '12:00', risk: 65, probability: 70 },
  { time: '16:00', risk: 85, probability: 88 },
  { time: '20:00', risk: 90, probability: 92 },
  { time: '24:00', risk: 75, probability: 80 },
];

const threatData = [
  { name: 'Seismic', level: 85, fill: '#FF003C' },
  { name: 'Atmospheric', level: 60, fill: '#00F0FF' },
  { name: 'Thermal', level: 45, fill: '#FFEA00' },
  { name: 'Hydrological', level: 30, fill: '#39FF14' },
];

const FAKE_LOGS = [
  "[SYS] Initializing global sensor grid...",
  "[AI] Calibrating neural pathways for seismic analysis.",
  "[WARN] Micro-fracture detected in Pacific Ring of Fire.",
  "[AI] Cross-referencing atmospheric pressure anomalies.",
  "[AI] Calculating magnitude escalation probability...",
  "[SYS] Satellite thermal imaging: Nominal.",
  "[AI] Threat vectors updated. Confidence: 87.4%",
];

export default function AIPredictionPage() {
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    const logInterval = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % FAKE_LOGS.length);
    }, 4000);
    return () => clearInterval(logInterval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col h-full gap-6 relative overflow-y-auto custom-scrollbar pr-2"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-black/40 border border-cyber-border/20 rounded-xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center">
            <Cpu className="w-6 h-6 text-cyber-cyan" />
          </div>
          <div>
            <h1 className="text-2xl font-orbitron font-bold text-white tracking-widest uppercase">AI Prediction Engine</h1>
            <p className="text-sm font-mono text-gray-400 mt-1">Neural Network Analysis & Threat Forecasting</p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6 border-l border-cyber-border/30 pl-8">
          <div>
            <p className="text-[10px] font-mono text-gray-500 mb-1 tracking-widest uppercase">System Confidence</p>
            <div className="text-xl font-orbitron font-bold text-cyber-cyan">87.4%</div>
          </div>
          <div>
            <p className="text-[10px] font-mono text-gray-500 mb-1 tracking-widest uppercase">Active Nodes</p>
            <div className="text-xl font-orbitron font-bold text-white">1,402</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Risk Timeline Chart */}
        <div className="lg:col-span-2 bg-black/40 border border-cyber-border/20 rounded-xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-orbitron font-bold text-white tracking-widest uppercase flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyber-blue" />
              Global Risk Escalation Timeline
            </h3>
            <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-400">NEXT 24 HOURS</span>
          </div>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF003C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF003C" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="time" stroke="#ffffff50" tick={{fontSize: 10, fontFamily: 'monospace'}} />
                <YAxis stroke="#ffffff50" tick={{fontSize: 10, fontFamily: 'monospace'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000000e0', borderColor: '#00F0FF50', fontFamily: 'monospace', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="risk" stroke="#FF003C" fillOpacity={1} fill="url(#colorRisk)" name="Risk Index" />
                <Area type="monotone" dataKey="probability" stroke="#00F0FF" fillOpacity={1} fill="url(#colorProb)" name="Probability %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Distribution */}
        <div className="bg-black/40 border border-cyber-border/20 rounded-xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex flex-col">
          <h3 className="font-orbitron font-bold text-white tracking-widest uppercase mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyber-yellow" />
            Threat Vector Analysis
          </h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={threatData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#ffffff50" tick={{fontSize: 10, fontFamily: 'monospace'}} width={80} />
                <Tooltip 
                  cursor={{fill: '#ffffff10'}}
                  contentStyle={{ backgroundColor: '#000000e0', borderColor: '#39FF1450', fontFamily: 'monospace', fontSize: '12px' }}
                />
                <Bar dataKey="level" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Anomaly Logs */}
        <div className="lg:col-span-3 bg-black/40 border border-cyber-border/20 rounded-xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-orbitron font-bold text-white tracking-widest uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyber-green" />
              Neural Network Subsystem Logs
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse-glow" />
              <span className="text-[10px] font-mono text-cyber-green">LIVE STREAM</span>
            </div>
          </div>
          
          <div className="bg-black/60 border border-cyber-border/10 rounded-lg p-4 font-mono text-sm text-cyber-cyan/70 h-[150px] overflow-hidden relative">
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none" />
            
            <div className="space-y-2 relative z-10 flex flex-col justify-end h-full">
              {FAKE_LOGS.map((log, i) => (
                <motion.div 
                  key={`${log}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: i > logIndex ? 0 : i === logIndex ? 1 : 0.4,
                    display: i > logIndex ? 'none' : 'block'
                  }}
                  className={`truncate ${log.includes('[WARN]') ? 'text-cyber-red font-bold' : ''}`}
                >
                  <span className="text-gray-500 mr-4">[{new Date().toISOString().split('T')[1].slice(0,8)}]</span>
                  {log}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
