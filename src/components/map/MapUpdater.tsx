import { useMap } from 'react-leaflet'
import { useEffect } from 'react'

interface MapUpdaterProps {
  center: [number, number]
  zoom?: number
}

export function MapUpdater({ center, zoom }: MapUpdaterProps) {
  const map = useMap()

  useEffect(() => {
    if (zoom) {
      map.flyTo(center, zoom, { duration: 1 })
    } else {
      map.flyTo(center, map.getZoom(), { duration: 1 })
    }
  }, [center, zoom, map])

  return null
}
