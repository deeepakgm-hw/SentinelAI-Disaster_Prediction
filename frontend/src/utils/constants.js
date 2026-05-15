export const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const WS_URL =
  import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/live'

export const RISK_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
}

export const DISASTER_TYPES = {
  earthquake: {
    label: 'Earthquake',
    icon: '⚡',
  },

  flood: {
    label: 'Flood',
    icon: '🌊',
  },

  wildfire: {
    label: 'Wildfire',
    icon: '🔥',
  },

  storm: {
    label: 'Storm',
    icon: '🌀',
  },
}

export const POLL_INTERVAL = 30000
