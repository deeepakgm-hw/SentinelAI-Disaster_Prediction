import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Terminal, AlertTriangle } from 'lucide-react';

const FAKE_LOGS = [
  "[SYS] Calibrating global seismic sensors...",
  "[AI] Scanning Pacific Ring of Fire anomalies...",
  "[WARN] Micro-fracture detected along San Andreas.",
  "[AI] Cross-referencing atmospheric pressure data...",
  "[SYS] Satellite thermal imaging: Nominal.",
  "[AI] Escalation probability model updated."
];

export default function AIPrediction() {
  const [logIndex, setLogIndex] = useState(0);
  const [typingText, setTypingText] = useState("");
  const fullText = "Detected anomalous pressure buildup in coastal fault lines. Probability of magnitude 6.0+ event in next 48h increased by 14.3%. Recommending elevated readiness protocols.";

  // Intelligence Logs Rotation
  useEffect(() => {
    const logInterval = setInterval(() => {
      setLogIndex((prev) => (prev + 1) % FAKE_LOGS.length);
    }, 3000);
    return () => clearInterval(logInterval);
  }, []);

  // Typing Effect for Main Prediction
  useEffect(() => {
    let currentText = "";
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        currentText += fullText.charAt(i);
        setTypingText(currentText);
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 40);
    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="flex-1 h-full glass-card p-5 relative overflow-hidden group border-cyber-cyan/30 hover:border-cyber-cyan/60 transition-all duration-500 shadow-[0_0_15px_rgba(0,240,255,0.05)] flex flex-col justify-between">
      {/* Background ambient glow */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyber-cyan/10 rounded-full blur-3xl group-hover:bg-cyber-cyan/20 transition-all duration-500" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyber-cyan" />
          <h2 className="text-lg font-orbitron font-bold text-white tracking-widest uppercase">AI Prediction Engine</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
          <span className="text-[10px] font-mono text-cyber-cyan tracking-widest">ACTIVE</span>
        </div>
      </div>

      {/* Main Prediction Box */}
      <div className="relative z-10 bg-cyber-dark/80 border border-cyber-cyan/20 rounded-xl p-5 mb-4 font-mono text-sm text-gray-300 leading-relaxed flex-1 flex flex-col overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-cyber-cyan/10 text-cyber-cyan/70 text-xs shrink-0">
          <Terminal className="w-4 h-4" />
          <span>neural_net_v9.4 // LIVE ANALYSIS</span>
        </div>
        
        {/* Typing Text Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-3">
          <p className="opacity-90 min-h-[60px] text-justify leading-relaxed">
            {typingText}
            <span className="animate-pulse text-cyber-cyan inline-block w-1.5 h-3 ml-1 bg-cyber-cyan" />
          </p>
        </div>

        {/* Confidence & Threat Level */}
        <div className="shrink-0 flex flex-wrap gap-3 text-[10px] md:text-xs">
          <div className="bg-cyber-cyan/10 px-3 py-1.5 rounded border border-cyber-cyan/30 text-cyber-cyan font-bold tracking-wider">
            CONFIDENCE: 87.4%
          </div>
          <div className="bg-cyber-red/10 px-3 py-1.5 rounded border border-cyber-red/30 text-cyber-red flex items-center gap-1.5 font-bold tracking-wider">
            <AlertTriangle className="w-3 h-3 animate-pulse" />
            THREAT: ESCALATING
          </div>
        </div>
      </div>

      <div>
        {/* Fake Intelligence Logs */}
        <div className="relative z-10 font-mono text-[10px] text-cyber-cyan/50 h-[20px] overflow-hidden mb-3 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan/50 animate-ping-slow" />
          <motion.div
            key={logIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="truncate"
          >
            {FAKE_LOGS[logIndex]}
          </motion.div>
        </div>

        {/* Action Button */}
        <button className="w-full bg-transparent hover:bg-cyber-cyan/10 border border-cyber-cyan/50 text-cyber-cyan font-orbitron py-2.5 rounded-xl transition-all duration-300 uppercase tracking-widest text-[11px] font-bold relative z-10 overflow-hidden hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <span className="relative z-10 flex items-center justify-center gap-2">
            Initialize Mitigation Protocol
          </span>
        </button>
      </div>
    </div>
  );
}
