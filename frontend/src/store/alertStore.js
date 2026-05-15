import { create } from 'zustand'

export const useAlertStore = create((set) => ({
  alerts: [],
  events: [],
  selectedEvent: null,

  setAlerts: (alerts) =>
    set({ alerts }),

  setEvents: (events) =>
    set({ events }),

  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts],
    })),

  selectEvent: (event) =>
    set({ selectedEvent: event }),
}))
