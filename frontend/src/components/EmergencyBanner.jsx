import { useEffect } from 'react'

import { Siren } from 'lucide-react'

import { useEmergencyStore } from '../store/emergencyStore'

export default function EmergencyBanner() {
  const emergency = useEmergencyStore(
    (s) => s.emergency
  )

  const clearEmergency = useEmergencyStore(
    (s) => s.clearEmergency
  )

  useEffect(() => {
    if (!emergency) return

    const timer = setTimeout(() => {
      clearEmergency()
    }, 6000)

    return () => clearTimeout(timer)
  }, [emergency, clearEmergency])

  if (!emergency) return null

  return (
    <div
      className="
        fixed
        top-0
        left-0
        right-0
        z-[999999]
        bg-gradient-to-r
        from-red-700
        via-red-600
        to-red-700
        border-b
        border-red-400
        shadow-2xl
        shadow-red-500/30
        animate-pulse
      "
    >
      <div
        className="
          px-8
          py-4
          flex
          items-center
          justify-between
        "
      >
        <div className="flex items-center gap-4">
          <div
            className="
              p-3
              rounded-full
              bg-white/10
            "
          >
            <Siren
              size={28}
              className="text-white"
            />
          </div>

          <div>
            <h2 className="text-white font-bold text-lg">
              CRITICAL EMERGENCY ALERT
            </h2>

            <p className="text-red-100 text-sm mt-1">
              {emergency.title} detected near{' '}
              {emergency.location}
            </p>
          </div>
        </div>

        <div
          className="
            px-4
            py-2
            rounded-full
            bg-white/10
            text-white
            text-sm
            font-semibold
          "
        >
          EVACUATION ADVISED
        </div>
      </div>
    </div>
  )
}
