import { Polygon, Tooltip } from 'react-leaflet'
import type { FalloutContour } from '../../lib/physics/fallout'

interface FalloutPlumeProps {
  contours: FalloutContour[]
}

export function FalloutPlume({ contours }: FalloutPlumeProps) {
  // Sort by dose rate ascending so highest dose renders on top
  const sorted = [...contours].sort((a, b) => a.doseRateRadPerHr - b.doseRateRadPerHr)

  return (
    <>
      {sorted.map((contour, i) => (
        <Polygon
          key={`${contour.label}-${i}`}
          positions={contour.polygon}
          pathOptions={{
            color: contour.color,
            fillColor: contour.color,
            fillOpacity: 0.5,
            weight: 1,
            opacity: 0.8,
          }}
        >
          <Tooltip direction="center" permanent={false} sticky={true}>
            <div className="text-xs font-medium">{contour.label}</div>
          </Tooltip>
        </Polygon>
      ))}
    </>
  )
}
