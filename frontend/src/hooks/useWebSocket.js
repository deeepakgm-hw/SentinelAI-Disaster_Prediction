import { useEffect } from 'react'

import { useDisasterStore } from '../store/disasterStore'
import { useNotificationStore } from '../store/notificationStore'
import { useUIStore } from '../store/uiStore'

export default function useWebSocket() {
  const setEvents = useDisasterStore(
    (s) => s.setEvents
  )

  const addActivity =
    useDisasterStore(
      (s) => s.addActivity
    )

  useEffect(() => {
    let socket

    function connect() {
      socket = new WebSocket(
        'ws://127.0.0.1:8000/ws/live'
      )

      socket.onopen = () => {
        console.log(
          '✅ WebSocket Connected'
        )
      }

      socket.onmessage = (event) => {
        const message = JSON.parse(
          event.data
        )

        console.log(
          '📡 WebSocket Message:',
          message
        )

        // NEW EVENT
        if (message.type === 'NEW_EVENT') {
          setEvents((prev) => [...prev, message.data])
        }

        // NEW ACTIVITY
        if (message.type === 'NEW_ACTIVITY') {
          addActivity(message.data)
        }

        // NEW NOTIFICATION
        if (message.type === 'NEW_NOTIFICATION') {
          useNotificationStore.getState().addNotification(message.data)
          
          // Play subtle notification sound
          try {
            new Audio('https://actions.google.com/sounds/v1/water/water_drop.ogg').play().catch(() => console.log('Audio blocked'))
          } catch (error) {
            console.error('Audio failed', error)
          }
        }
        
        // EMERGENCY BROADCAST
        if (message.type === 'EMERGENCY_BROADCAST') {
          useUIStore.getState().setEmergencyMode(true)
          
          // Play loud siren
          try {
            new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg').play().catch(() => console.log('Audio blocked'))
          } catch (error) {
            console.error('Audio failed', error)
          }
        }
      }

      socket.onclose = () => {
        console.log(
          '❌ WebSocket Disconnected'
        )

        setTimeout(connect, 3000)
      }

      socket.onerror = (error) => {
        console.error(
          'WebSocket Error:',
          error
        )
      }
    }

    connect()

    return () => {
      if (socket) {
        socket.close()
      }
    }
  }, [setEvents, addActivity])
}
