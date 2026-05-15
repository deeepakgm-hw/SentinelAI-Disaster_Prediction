import { create } from 'zustand'

export const useToastStore = create((set) => ({
  toasts: [],

  addToast: (toast) =>
    set((state) => ({
      toasts: [toast, ...state.toasts],
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter(
        (toast) => toast.id !== id
      ),
    })),
}))
