import { MapContainer, TileLayer } from 'react-leaflet'
import type { ReactNode } from 'react'
import 'leaflet/dist/leaflet.css'

interface BaseMapProps {
  center: [number, number]
  zoom?: number
  className?: string
  children?: ReactNode
}

export function BaseMap({ center, zoom = 10, className = 'h-[400px] md:h-[500px] lg:h-[600px]', children }: BaseMapProps) {
  return (
    <div className={`relative rounded-lg overflow-hidden border border-border ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {children}
      </MapContainer>
    </div>
  )
}
