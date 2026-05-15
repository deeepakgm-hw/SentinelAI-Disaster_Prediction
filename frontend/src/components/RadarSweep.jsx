export default function RadarSweep() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[500]">
      {/* Radar Center Glow */}
      <div
        className="
          absolute
          top-1/2
          left-1/2
          w-[14px]
          h-[14px]
          bg-cyan-400
          rounded-full
          -translate-x-1/2
          -translate-y-1/2
          shadow-[0_0_30px_#22d3ee]
        "
      />

      {/* Radar Sweep Beam */}
      <div
        className="
          absolute
          top-1/2
          left-1/2
          w-[700px]
          h-[700px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          animate-radar
        "
        style={{
          background:
            'conic-gradient(from 0deg, rgba(34,211,238,0.35), transparent 70deg)',
        }}
      />

      {/* Outer Radar Ring */}
      <div
        className="
          absolute
          top-1/2
          left-1/2
          w-[700px]
          h-[700px]
          border
          border-cyan-500/10
          rounded-full
          -translate-x-1/2
          -translate-y-1/2
        "
      />

      {/* Middle Radar Ring */}
      <div
        className="
          absolute
          top-1/2
          left-1/2
          w-[450px]
          h-[450px]
          border
          border-cyan-500/10
          rounded-full
          -translate-x-1/2
          -translate-y-1/2
        "
      />

      {/* Inner Radar Ring */}
      <div
        className="
          absolute
          top-1/2
          left-1/2
          w-[220px]
          h-[220px]
          border
          border-cyan-500/10
          rounded-full
          -translate-x-1/2
          -translate-y-1/2
        "
      />
    </div>
  )
}
