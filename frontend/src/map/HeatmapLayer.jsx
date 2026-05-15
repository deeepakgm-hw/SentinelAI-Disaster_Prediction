import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3'

import { useDisasterStore } from '../store/disasterStore'

export default function DisasterHeatmap() {
  const events = useDisasterStore(
    (s) => s.events
  )

  const points = events.map((event) => ({
    lat: event.lat,
    lng: event.lon,

    intensity:
      event.level === 'CRITICAL'
        ? 1.0
        : event.level === 'HIGH'
        ? 0.8
        : event.level === 'MEDIUM'
        ? 0.5
        : 0.3,
  }))

  return (
    <HeatmapLayer
      fitBoundsOnLoad={false}
      fitBoundsOnUpdate={false}

      points={points}

      longitudeExtractor={(p) => p.lng}
      latitudeExtractor={(p) => p.lat}
      intensityExtractor={(p) => p.intensity}

      radius={45}
      blur={35}
      max={1.0}

      gradient={{
        0.2: '#22c55e',
        0.4: '#facc15',
        0.6: '#f97316',
        1.0: '#ef4444',
      }}
    />
  )
}
