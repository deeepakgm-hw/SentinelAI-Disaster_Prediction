import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Layout
import MainLayout from './layouts/MainLayout'

// Auth & Public Pages
import WelcomeScreen from './pages/WelcomeScreen'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ProtectedRoute from './components/ProtectedRoute'

// Dashboard Pages
import Dashboard from './pages/Dashboard'
import GlobalMap from './pages/GlobalMap'
import AlertFeeds from './pages/AlertFeeds'
import AIPredictionPage from './pages/AIPredictionPage'
import Emergency from './pages/Emergency'
import Settings from './pages/Settings'

// Hooks & Store
import useWebSocket from './hooks/useWebSocket'
import { useDisasterStore } from './store/disasterStore'
import { useAuthStore } from './store/authStore'
import { getEvents } from './services/api'

import './index.css'

export default function App() {
  const setEvents = useDisasterStore((s) => s.setEvents)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  // Connect Realtime Websocket
  useWebSocket()

  // Initial global data fetch
  useEffect(() => {
    if (!isAuthenticated) return;
    
    async function loadData() {
      try {
        const eventsData = await getEvents()
        setEvents(eventsData)
      } catch (error) {
        console.error('Failed to load global events:', error)
      }
    }
    loadData()
    const interval = setInterval(loadData, 60000)
    return () => clearInterval(interval)
  }, [setEvents, isAuthenticated])

  return (
    <>
      <Toaster position="top-right" toastOptions={{
        className: 'bg-black/80 border border-cyber-cyan/30 text-white font-mono text-xs backdrop-blur-md',
        success: { iconTheme: { primary: '#00F0FF', secondary: '#000' } },
        error: { iconTheme: { primary: '#FF003C', secondary: '#000' } },
      }} />
      <Routes>
        {/* Public Routes */}
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<GlobalMap />} />
            <Route path="/alerts" element={<AlertFeeds />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/ai" element={<AIPredictionPage />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
