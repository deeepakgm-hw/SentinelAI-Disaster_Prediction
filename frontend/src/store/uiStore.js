import { create } from 'zustand'

export const useUIStore = create((set) => ({
  fullscreen: false,
  isChatOpen: false,
  isNotificationsOpen: false,
  isEmergencyMode: false,
  isEvacuationMode: false,

  toggleFullscreen: () =>
    set((state) => ({
      fullscreen: !state.fullscreen,
    })),
    
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen, isNotificationsOpen: false })),
  closeChat: () => set({ isChatOpen: false }),
  openChat: () => set({ isChatOpen: true, isNotificationsOpen: false }),
  
  toggleNotifications: () => set((state) => ({ isNotificationsOpen: !state.isNotificationsOpen, isChatOpen: false })),
  closeNotifications: () => set({ isNotificationsOpen: false }),
  openNotifications: () => set({ isNotificationsOpen: true, isChatOpen: false }),
  
  setEmergencyMode: (status) => set({ isEmergencyMode: status }),
  setEvacuationMode: (status) => set({ isEvacuationMode: status })
}))
