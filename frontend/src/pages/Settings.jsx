import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Sliders, Database, Shield, Terminal } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const [sensitivity, setSensitivity] = useState(85);
  const [interval, setInterval] = useState(30);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col h-full gap-6 relative overflow-y-auto custom-scrollbar pr-2"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-black/40 border border-cyber-border/20 rounded-xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] z-20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-cyber-border/10 border border-cyber-border/30 flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-gray-300" />
          </div>
          <div>
            <h1 className="text-2xl font-orbitron font-bold text-white tracking-widest uppercase">System Configurations</h1>
            <p className="text-sm font-mono text-gray-400 mt-1">Terminal Preferences & API Integrations</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 border border-cyber-green/30 bg-cyber-green/10 px-4 py-2 rounded">
          <Shield className="w-4 h-4 text-cyber-green" />
          <span className="text-xs font-mono text-cyber-green tracking-widest font-bold">ENCRYPTED CONNECTION</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        
        {/* API & Data Sources */}
        <div className="bg-black/40 border border-cyber-border/20 rounded-xl p-6 shadow-lg flex flex-col gap-6">
          <h3 className="font-orbitron font-bold text-white tracking-widest uppercase flex items-center gap-2 border-b border-cyber-border/20 pb-3">
            <Database className="w-5 h-5 text-cyber-blue" />
            Data Source Integrations
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-white/10 rounded bg-white/5">
              <div>
                <p className="text-white font-bold text-sm">USGS Seismic Feed</p>
                <p className="text-[10px] font-mono text-gray-400">api.usgs.gov/earthquakes/feed</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-cyber-green bg-cyber-green/10 px-2 py-1 rounded">CONNECTED</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border border-white/10 rounded bg-white/5">
              <div>
                <p className="text-white font-bold text-sm">Open-Meteo Weather</p>
                <p className="text-[10px] font-mono text-gray-400">api.open-meteo.com/v1/forecast</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-cyber-green bg-cyber-green/10 px-2 py-1 rounded">CONNECTED</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border border-white/10 rounded bg-white/5">
              <div>
                <p className="text-white font-bold text-sm">Global Forest Watch</p>
                <p className="text-[10px] font-mono text-gray-400">Wildfire Thermal Anomalies</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-cyber-yellow bg-cyber-yellow/10 px-2 py-1 rounded">SYNCING...</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI & System Behavior */}
        <div className="bg-black/40 border border-cyber-border/20 rounded-xl p-6 shadow-lg flex flex-col gap-6">
          <h3 className="font-orbitron font-bold text-white tracking-widest uppercase flex items-center gap-2 border-b border-cyber-border/20 pb-3">
            <Sliders className="w-5 h-5 text-cyber-cyan" />
            AI & System Parameters
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-white">AI Anomaly Sensitivity</label>
                <span className="text-xs font-mono text-cyber-cyan">{sensitivity}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={sensitivity}
                onChange={(e) => setSensitivity(e.target.value)}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
              />
              <p className="text-[10px] font-mono text-gray-500 mt-1">Higher sensitivity may result in more false-positive warnings.</p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-white">Data Refresh Interval (Seconds)</label>
                <span className="text-xs font-mono text-cyber-cyan">{interval}s</span>
              </div>
              <input 
                type="range" 
                min="5" max="120" step="5"
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
              />
            </div>
          </div>
        </div>

        {/* Diagnostics Terminal */}
        <div className="lg:col-span-2 bg-black/40 border border-cyber-border/20 rounded-xl p-6 shadow-lg flex flex-col">
          <h3 className="font-orbitron font-bold text-white tracking-widest uppercase flex items-center gap-2 border-b border-cyber-border/20 pb-3 mb-4">
            <Terminal className="w-5 h-5 text-gray-400" />
            System Diagnostics
          </h3>
          <div className="bg-[#0a0a0a] rounded border border-gray-800 p-4 font-mono text-[11px] text-gray-400 h-32 overflow-y-auto">
            <p>root@disaster-guard:~# systemctl status engine</p>
            <p className="text-cyber-green">● engine.service - AI Prediction Engine</p>
            <p>   Loaded: loaded (/etc/systemd/system/engine.service; enabled; vendor preset: enabled)</p>
            <p>   Active: active (running) since Thu 2026-05-14 12:45:00 UTC; 4h 32min ago</p>
            <p> Main PID: 1402 (node)</p>
            <p>    Tasks: 23 (limit: 4915)</p>
            <p>   Memory: 412.5M</p>
            <p>   CGroup: /system.slice/engine.service</p>
            <p className="mt-2 text-cyber-yellow">WARN: High latency detected on Node 4 (Pacific Rim)</p>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
