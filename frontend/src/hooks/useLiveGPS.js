import { useEffect, useRef } from 'react'
import { useEmergencyStore } from '../store/emergencyStore'
import { useDisasterStore } from '../store/disasterStore'
import { useUIStore } from '../store/uiStore'
import { useNotificationStore } from '../store/notificationStore'
import { updateLiveLocation, getNearbySafezones } from '../services/api'
import toast from 'react-hot-toast'

// Haversine formula to calculate distance between two coordinates in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function useLiveGPS() {
  const isTrackingGPS = useEmergencyStore((s) => s.isTrackingGPS)
  const setLiveLocation = useEmergencyStore((s) => s.setLiveLocation)
  const setIsTrackingGPS = useEmergencyStore((s) => s.setIsTrackingGPS)
  const setActiveDangerEvent = useEmergencyStore((s) => s.setActiveDangerEvent)
  const setSafeZones = useEmergencyStore((s) => s.setSafeZones)
  
  const setEvacuationMode = useUIStore((s) => s.setEvacuationMode)
  const isEvacuationMode = useUIStore((s) => s.isEvacuationMode)
  
  const addNotification = useNotificationStore((s) => s.addNotification)
  const storeEvents = useDisasterStore((s) => s.events)
  
  const watchIdRef = useRef(null)
  const alertedEventsRef = useRef(new Set())

  // Toggle GPS Tracking
  const toggleTracking = () => {
    if (!isTrackingGPS) {
      if ('geolocation' in navigator) {
        setIsTrackingGPS(true)
        toast.success("GPS Shield Activated. Tracking...", { icon: '📡' })
      } else {
        toast.error("Geolocation is not supported by your browser")
      }
    } else {
      setIsTrackingGPS(false)
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
      toast("GPS Shield Deactivated", { icon: '🛑' })
    }
  }

  // Effect to watch location and calculate proximity
  useEffect(() => {
    if (isTrackingGPS && 'geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setLiveLocation(latitude, longitude)
          
          // Background sync to API (fire & forget to avoid blocking)
          updateLiveLocation(latitude, longitude).catch(e => console.error(e))

          // Proximity Detection
          if (!isEvacuationMode) {
            for (const event of storeEvents) {
              const eventLat = Number(event.lat || event.latitude || event.coordinates?.[0])
              const eventLng = Number(event.lon || event.longitude || event.coordinates?.[1])
              
              if (isNaN(eventLat) || isNaN(eventLng)) continue

              const distance = calculateDistance(latitude, longitude, eventLat, eventLng)
              
              // 10km Danger Radius
              if (distance <= 10 && !alertedEventsRef.current.has(event.id)) {
                alertedEventsRef.current.add(event.id)
                
                // Set the danger event
                setActiveDangerEvent({
                  ...event,
                  distance_km: distance.toFixed(2)
                })

                // Fetch safe zones
                try {
                  const zones = await getNearbySafezones(latitude, longitude)
                  setSafeZones(zones)
                } catch (e) {
                  console.error("Failed to fetch safe zones", e)
                }

                // Add Notification
                addNotification({
                  title: `PROXIMITY ALERT: ${event.title || event.type}`,
                  message: `You are within ${distance.toFixed(2)}km of a high-risk zone. Evacuation protocols recommended.`,
                  severity: 'CRITICAL',
                  type: event.type
                })

                // Trigger Twilio SMS (using the existing endpoint)
                fetch('http://localhost:8000/api/send-alert', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    phone: '+919380362266',
                    message: `SENTINEL AI: Danger detected! You are ${distance.toFixed(1)}km from ${event.title || event.type}. Evacuate to nearest safe zone.`
                  })
                }).catch(e => console.error("SMS failed", e))

                // Activate Fullscreen Mode
                setEvacuationMode(true)
                toast.error(`DANGER: ${event.type} detected nearby!`, { icon: '🚨' })
                break // Only trigger one evacuation at a time
              }
            }
          }
        },
        (error) => {
          console.error("GPS Watch Error:", error)
          // Fallback logic for testing: Simulate moving into a danger zone if permission denied
          if (error.code === error.PERMISSION_DENIED) {
            toast.error("Location denied. Simulating GPS for demo.")
            const fakeLat = 34.05 // LA Earthquake coordinates
            const fakeLng = -118.24
            setLiveLocation(fakeLat, fakeLng)
            // ... (for a real app we'd just stop tracking)
          }
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      )
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [isTrackingGPS, storeEvents, isEvacuationMode, setLiveLocation, setEvacuationMode, setActiveDangerEvent, setSafeZones, addNotification])

  // Helper for simulating proximity danger
  const simulateDanger = async () => {
    toast("Simulating Danger Zone Entry...", { icon: '🧪' })
    
    const triggerSim = async (userLat, userLng) => {
      setLiveLocation(userLat, userLng)
      
      const dangerEvent = {
        id: "simulated_01",
        title: "M 7.2 - Local Fault Shift",
        type: "Earthquake",
        magnitude: 7.2,
        distance_km: "2.3",
        lat: userLat + 0.02,
        lon: userLng + 0.02
      }
      
      setActiveDangerEvent(dangerEvent)
      
      try {
        const zones = await getNearbySafezones(userLat, userLng)
        setSafeZones(zones)
      } catch(e){}

      setEvacuationMode(true)
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => triggerSim(pos.coords.latitude, pos.coords.longitude),
        () => triggerSim(34.05, -118.24) // Fallback to LA
      )
    } else {
      triggerSim(34.05, -118.24)
    }
  }

  return { toggleTracking, simulateDanger }
}
