import { create } from 'zustand'

export const useFilterStore = create((set) => ({
  disasterType: 'ALL',

  severity: 'ALL',

  setDisasterType: (type) =>
    set({
      disasterType: type,
    }),

  setSeverity: (level) =>
    set({
      severity: level,
    }),
}))
