import { useEffect, useState } from 'react'
import { fetchAlerts } from '../services/api'
import { useAlertStore } from '../store/alertStore'
import { POLL_INTERVAL } from '../utils/constants'

export default function useAlerts() {
  const [loading, setLoading] = useState(true)

  const alerts = useAlertStore((s) => s.alerts)
  const setAlerts = useAlertStore((s) => s.setAlerts)

  useEffect(() => {
    async function loadAlerts() {
      try {
        const res = await fetchAlerts()
        setAlerts(res.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadAlerts()

    const interval = setInterval(loadAlerts, POLL_INTERVAL)

    return () => clearInterval(interval)
  }, [setAlerts])

  return {
    alerts,
    loading,
  }
}
