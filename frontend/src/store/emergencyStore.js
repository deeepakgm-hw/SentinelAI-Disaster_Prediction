import { create } from 'zustand'

export const useEmergencyStore = create((set) => ({
  liveLocation: null,
  isTrackingGPS: false,
  activeDangerEvent: null,
  safeZones: [],
  countdownTimer: 300, // 5 minutes

  setEmergency: (data) =>
    set({
      emergency: data,
    }),

  clearEmergency: () =>
    set({
      emergency: null,
    }),
    
  setLiveLocation: (lat, lng) => set({ liveLocation: { lat, lng } }),
  setIsTrackingGPS: (status) => set({ isTrackingGPS: status }),
  setActiveDangerEvent: (event) => set({ activeDangerEvent: event }),
  setSafeZones: (zones) => set({ safeZones: zones }),
  decrementTimer: () => set((state) => ({ countdownTimer: Math.max(0, state.countdownTimer - 1) })),
  resetEmergencyMode: () => set({ liveLocation: null, safeZones: [], countdownTimer: 300, activeDangerEvent: null })
}))
