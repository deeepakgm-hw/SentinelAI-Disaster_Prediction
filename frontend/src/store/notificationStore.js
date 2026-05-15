import { create } from 'zustand'

export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  
  setNotifications: (notifs) => set({
    notifications: notifs,
    unreadCount: notifs.filter(n => !n.is_read).length
  }),
  
  addNotification: (notif) => set((state) => {
    // Check for duplicates
    if (state.notifications.some(n => n.id === notif.id)) return state;
    
    const updated = [notif, ...state.notifications];
    return {
      notifications: updated,
      unreadCount: updated.filter(n => !n.is_read).length
    }
  }),
  
  markAsRead: (id) => set((state) => {
    const updated = state.notifications.map(n => 
      n.id === id ? { ...n, is_read: true } : n
    );
    return {
      notifications: updated,
      unreadCount: updated.filter(n => !n.is_read).length
    }
  }),
  
  markAllAsRead: () => set((state) => {
    const updated = state.notifications.map(n => ({ ...n, is_read: true }));
    return {
      notifications: updated,
      unreadCount: 0
    }
  }),
  
  clearNotifications: () => set({
    notifications: [],
    unreadCount: 0
  })
}))
