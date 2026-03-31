import { Circle, Tooltip } from 'react-leaflet'

export interface EffectRing {
  radiusKm: number
  color: string
  label: string
  dashed?: boolean
}

interface EffectRingsProps {
  center: [number, number]
  rings: EffectRing[]
}

export function EffectRings({ center, rings }: EffectRingsProps) {
  // Sort by radius descending so smaller rings render on top
  const sorted = [...rings].sort((a, b) => b.radiusKm - a.radiusKm)

  return (
    <>
      {sorted.map((ring) => (
        <Circle
          key={ring.label}
          center={center}
          radius={ring.radiusKm * 1000} // Leaflet uses meters
          pathOptions={{
            color: ring.color,
            fillColor: ring.color,
            fillOpacity: 0.08,
            weight: ring.dashed ? 1.5 : 2,
            opacity: 0.7,
            dashArray: ring.dashed ? '8, 6' : undefined,
          }}
        >
          <Tooltip direction="top" permanent={false} sticky={true}>
            <div className="text-xs">
              <strong>{ring.label}</strong>
              <br />
              {ring.radiusKm < 1
                ? `${(ring.radiusKm * 1000).toFixed(0)} m`
                : `${ring.radiusKm.toFixed(2)} km`}
            </div>
          </Tooltip>
        </Circle>
      ))}
    </>
  )
}
