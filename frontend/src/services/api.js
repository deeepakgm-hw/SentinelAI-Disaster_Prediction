import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 10000,
})

// Request Interceptor to add JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor to handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export async function login(username, password) {
  const response = await api.post('/api/auth/login', { username, password });
  return response.data;
}

export async function signup(username, email, password) {
  const response = await api.post('/api/auth/signup', { username, email, password });
  return response.data;
}

export async function fetchProfile() {
  const response = await api.get('/api/auth/profile');
  return response.data;
}

// Disaster API
export async function getEvents() {
  const response = await api.get('/api/events')
  return response.data
}

export async function getAlerts() {
  const response = await api.get('/api/alerts')
  return response.data
}

export async function getCyclones() {
  const response = await api.get('/api/cyclones/live')
  return response.data?.events || []
}

export async function getFloods() {
  const response = await api.get('/api/floods/live')
  return response.data?.events || []
}

export const sendChatMessage = async (message) => {
  const response = await api.post('/api/chat/send', { message })
  return response.data
}

export const getChatHistory = async () => {
  const response = await api.get('/api/chat/history')
  return response.data
}

export const clearChatHistory = async () => {
  const response = await api.delete('/api/chat/clear')
  return response.data
}

// Notifications API
export const getNotifications = async () => {
  const response = await api.get('/api/notifications')
  return response.data
}

export const markNotificationRead = async (id) => {
  const response = await api.put(`/api/notifications/read/${id}`)
  return response.data
}

export const markAllNotificationsRead = async () => {
  const response = await api.put('/api/notifications/read-all')
  return response.data
}

export const clearNotifications = async () => {
  const response = await api.delete('/api/notifications/clear')
  return response.data
}

export const simulateEmergency = async () => {
  const response = await api.post('/api/notifications/simulate_emergency')
  return response.data
}

// Location & Emergency API
export const updateLiveLocation = async (latitude, longitude) => {
  const response = await api.post('/api/location/update', { latitude, longitude })
  return response.data
}

export const sendEmergencyLocation = async (latitude, longitude) => {
  const response = await api.post('/api/emergency/location', { latitude, longitude })
  return response.data
}

export const getNearbySafezones = async (latitude, longitude) => {
  const response = await api.get('/api/emergency/safezones/nearby', {
    params: { latitude, longitude }
  })
  return response.data
}

export default api
