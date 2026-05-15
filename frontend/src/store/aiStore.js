import { create } from 'zustand'

export const useAIStore = create((set) => ({
  open: false,

  messages: [
    {
      role: 'assistant',
      content:
        'DisasterGuard AI online. Ask for emergency guidance, evacuation planning, or disaster analysis.',
    },
  ],

  toggleAI: () =>
    set((state) => ({
      open: !state.open,
    })),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
}))
