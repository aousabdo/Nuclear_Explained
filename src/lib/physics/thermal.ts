import { THERMAL_SCALED_DISTANCES } from './constants'

/**
 * Calculate thermal radiation radius for a given yield and fluence threshold.
 * Thermal energy scales as Y/r², so r scales as Y^(1/2) for a given fluence.
 * Based on Glasstone & Dolan thermal radiation tables.
 *
 * @param yieldKt - Weapon yield in kilotons
 * @param calPerCm2 - Thermal fluence threshold in cal/cm²
 * @returns Radius in kilometers
 */
export function thermalRadius(yieldKt: number, calPerCm2: number): number {
  const scaledDist = getThermalScaledDistance(calPerCm2)
  return scaledDist * Math.pow(yieldKt, 0.41) // Slightly sub-square-root due to atmospheric absorption
}

function getThermalScaledDistance(cal: number): number {
  const calValues = Object.keys(THERMAL_SCALED_DISTANCES)
    .map(Number)
    .sort((a, b) => a - b)
  const distances = calValues.map(c => THERMAL_SCALED_DISTANCES[c])

  if (cal <= calValues[0]) return distances[0] * 1.2
  if (cal >= calValues[calValues.length - 1]) return distances[distances.length - 1]

  for (let i = 0; i < calValues.length - 1; i++) {
    if (cal >= calValues[i] && cal <= calValues[i + 1]) {
      const t = (cal - calValues[i]) / (calValues[i + 1] - calValues[i])
      return distances[i] + t * (distances[i + 1] - distances[i])
    }
  }
  return distances[0]
}
