/**
 * Simplified fallout plume model based on Gaussian dispersion.
 * Models the downwind transport and crosswind spread of radioactive debris.
 *
 * Key simplifications:
 * - Uniform wind speed and direction
 * - Single effective release height
 * - Gaussian crosswind dispersion
 * - 7:10 decay rule for fission products
 */

export interface FalloutContour {
  doseRateRadPerHr: number
  label: string
  color: string
  polygon: [number, number][] // [lat, lng] pairs
}

export interface FalloutParams {
  lat: number
  lng: number
  yieldKt: number
  windSpeedKmh: number
  windDirectionDeg: number // Direction wind is GOING TO (meteorological convention inverted)
  surfaceBurst: boolean
  fissionFraction: number // 0-1, fraction of yield from fission
}

/**
 * Generate fallout contour polygons for display on a map.
 * Airbursts produce minimal fallout - the fireball doesn't touch the ground
 * so no soil/debris is activated and lofted.
 */
export function generateFalloutContours(params: FalloutParams): FalloutContour[] {
  const { lat, lng, yieldKt, windSpeedKmh, windDirectionDeg, surfaceBurst, fissionFraction } = params

  // Airbursts produce negligible local fallout
  if (!surfaceBurst) {
    return [{
      doseRateRadPerHr: 0.1,
      label: 'Minimal fallout (airburst)',
      color: 'rgba(234, 179, 8, 0.1)',
      polygon: generateEllipse(lat, lng, 2, 1, windDirectionDeg),
    }]
  }

  const fissionYieldKt = yieldKt * fissionFraction
  if (fissionYieldKt < 0.1) return []

  // Wind direction in radians (convert from degrees, meteorological to math convention)
  const windRadians = ((windDirectionDeg + 180) % 360) * (Math.PI / 180)

  // Dose rate zones (rad/hr at 1 hour after detonation)
  const zones = [
    { rate: 1000, label: 'Lethal (>1000 rad/hr)', color: 'rgba(127, 29, 29, 0.6)' },
    { rate: 300, label: 'Severe (300-1000 rad/hr)', color: 'rgba(220, 38, 38, 0.45)' },
    { rate: 100, label: 'Dangerous (100-300 rad/hr)', color: 'rgba(249, 115, 22, 0.35)' },
    { rate: 10, label: 'Significant (10-100 rad/hr)', color: 'rgba(234, 179, 8, 0.25)' },
    { rate: 1, label: 'Elevated (1-10 rad/hr)', color: 'rgba(234, 179, 8, 0.12)' },
  ]

  return zones.map(zone => {
    const { downwindExtentKm, crosswindWidthKm } = plumeExtent(
      fissionYieldKt,
      windSpeedKmh,
      zone.rate
    )

    return {
      doseRateRadPerHr: zone.rate,
      label: zone.label,
      color: zone.color,
      polygon: generatePlumePolygon(
        lat, lng,
        downwindExtentKm,
        crosswindWidthKm,
        windRadians
      ),
    }
  })
}

/**
 * Calculate the downwind extent and crosswind width of a fallout contour.
 */
function plumeExtent(
  fissionYieldKt: number,
  windSpeedKmh: number,
  targetDoseRate: number
): { downwindExtentKm: number; crosswindWidthKm: number } {
  // Source strength scales with fission yield
  // More fission = more fission products = more fallout
  const sourceStrength = Math.pow(fissionYieldKt, 0.6)

  // Downwind extent: larger yield and higher wind = longer plume
  // Lower dose rate threshold = further extent
  const doseRatio = 1000 / targetDoseRate
  const downwindExtentKm = sourceStrength * Math.pow(doseRatio, 0.55) *
    Math.max(0.5, Math.pow(windSpeedKmh / 20, 0.3)) * 4

  // Crosswind width: wider at lower dose rates, grows with distance
  // Typical ratio: crosswind is ~1/5 to ~1/3 of downwind extent
  const crosswindWidthKm = downwindExtentKm * (0.12 + 0.08 * Math.log10(doseRatio))

  return {
    downwindExtentKm: Math.max(0.5, downwindExtentKm),
    crosswindWidthKm: Math.max(0.2, crosswindWidthKm),
  }
}

/**
 * Generate a plume-shaped polygon (elongated teardrop) in lat/lng coordinates.
 */
function generatePlumePolygon(
  centerLat: number,
  centerLng: number,
  downwindKm: number,
  crosswindKm: number,
  windRadians: number
): [number, number][] {
  const points: [number, number][] = []
  const numPoints = 40

  // Convert km to approximate degrees
  const kmPerDegLat = 111.32
  const kmPerDegLng = 111.32 * Math.cos(centerLat * Math.PI / 180)

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints
    const angle = t * 2 * Math.PI

    // Teardrop shape: wider at back (upwind), narrow at front (upwind end),
    // long tail downwind
    let r: number
    if (angle <= Math.PI) {
      // Right side
      const downwind = downwindKm * (0.5 + 0.5 * Math.cos(angle)) * (0.5 + 0.5 * Math.sin(angle * 0.5))
      const crosswind = crosswindKm * Math.sin(angle)
      r = Math.sqrt(downwind * downwind + crosswind * crosswind)
      const localAngle = Math.atan2(crosswind, downwind)

      const dx = r * Math.cos(localAngle)
      const dy = r * Math.sin(localAngle)

      // Rotate by wind direction
      const rotX = dx * Math.cos(windRadians) - dy * Math.sin(windRadians)
      const rotY = dx * Math.sin(windRadians) + dy * Math.cos(windRadians)

      points.push([
        centerLat + rotY / kmPerDegLat,
        centerLng + rotX / kmPerDegLng,
      ])
    } else {
      // Left side (mirror)
      const mirrorAngle = 2 * Math.PI - angle
      const downwind = downwindKm * (0.5 + 0.5 * Math.cos(mirrorAngle)) * (0.5 + 0.5 * Math.sin(mirrorAngle * 0.5))
      const crosswind = -crosswindKm * Math.sin(mirrorAngle)
      r = Math.sqrt(downwind * downwind + crosswind * crosswind)
      const localAngle = Math.atan2(crosswind, downwind)

      const dx = r * Math.cos(localAngle)
      const dy = r * Math.sin(localAngle)

      const rotX = dx * Math.cos(windRadians) - dy * Math.sin(windRadians)
      const rotY = dx * Math.sin(windRadians) + dy * Math.cos(windRadians)

      points.push([
        centerLat + rotY / kmPerDegLat,
        centerLng + rotX / kmPerDegLng,
      ])
    }
  }

  // Close the polygon
  if (points.length > 0) {
    points.push(points[0])
  }

  return points
}

function generateEllipse(
  lat: number, lng: number,
  semiMajorKm: number, semiMinorKm: number,
  rotationDeg: number
): [number, number][] {
  const points: [number, number][] = []
  const rotRad = rotationDeg * Math.PI / 180
  const kmPerDegLat = 111.32
  const kmPerDegLng = 111.32 * Math.cos(lat * Math.PI / 180)

  for (let i = 0; i <= 36; i++) {
    const angle = (i / 36) * 2 * Math.PI
    const x = semiMajorKm * Math.cos(angle)
    const y = semiMinorKm * Math.sin(angle)
    const rotX = x * Math.cos(rotRad) - y * Math.sin(rotRad)
    const rotY = x * Math.sin(rotRad) + y * Math.cos(rotRad)
    points.push([
      lat + rotY / kmPerDegLat,
      lng + rotX / kmPerDegLng,
    ])
  }
  return points
}
