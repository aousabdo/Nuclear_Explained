import { OVERPRESSURE_SCALED_DISTANCES } from './constants'

/**
 * Calculate blast radius for a given yield and overpressure threshold.
 * Uses cube-root scaling law: r = Y^(1/3) × k
 * Based on Glasstone & Dolan standard blast tables.
 *
 * @param yieldKt - Weapon yield in kilotons
 * @param overpressurePsi - Target overpressure in psi
 * @returns Radius in kilometers
 */
export function blastRadius(yieldKt: number, overpressurePsi: number): number {
  // Get the scaled distance for the target overpressure
  // Interpolate if not an exact match
  const scaledDist = getScaledDistance(overpressurePsi)
  return scaledDist * Math.pow(yieldKt, 1 / 3)
}

/**
 * Calculate overpressure at a given distance from ground zero.
 * Inverse of blastRadius.
 */
export function overpressureAtDistance(yieldKt: number, distanceKm: number): number {
  const scaledDist = distanceKm / Math.pow(yieldKt, 1 / 3)
  return getOverpressureFromScaled(scaledDist)
}

/**
 * Calculate the area receiving at least the specified overpressure.
 * @returns Area in km²
 */
export function blastArea(yieldKt: number, overpressurePsi: number): number {
  const r = blastRadius(yieldKt, overpressurePsi)
  return Math.PI * r * r
}

function getScaledDistance(psi: number): number {
  const psiValues = Object.keys(OVERPRESSURE_SCALED_DISTANCES)
    .map(Number)
    .sort((a, b) => a - b)
  const distances = psiValues.map(p => OVERPRESSURE_SCALED_DISTANCES[p])

  if (psi <= psiValues[0]) return distances[0]
  if (psi >= psiValues[psiValues.length - 1]) return distances[distances.length - 1]

  // Log-linear interpolation
  for (let i = 0; i < psiValues.length - 1; i++) {
    if (psi >= psiValues[i] && psi <= psiValues[i + 1]) {
      const logPsi = Math.log(psi)
      const logP0 = Math.log(psiValues[i])
      const logP1 = Math.log(psiValues[i + 1])
      const t = (logPsi - logP0) / (logP1 - logP0)
      return distances[i] + t * (distances[i + 1] - distances[i])
    }
  }
  return distances[0]
}

function getOverpressureFromScaled(scaledDist: number): number {
  const entries = Object.entries(OVERPRESSURE_SCALED_DISTANCES)
    .map(([psi, dist]) => ({ psi: Number(psi), dist }))
    .sort((a, b) => a.dist - b.dist) // Sort by distance ascending

  if (scaledDist <= entries[0].dist) return entries[0].psi * 2 // Beyond closest range
  if (scaledDist >= entries[entries.length - 1].dist) return 0.5 // Below min threshold

  for (let i = 0; i < entries.length - 1; i++) {
    if (scaledDist >= entries[i].dist && scaledDist <= entries[i + 1].dist) {
      const t = (scaledDist - entries[i].dist) / (entries[i + 1].dist - entries[i].dist)
      return entries[i].psi + t * (entries[i + 1].psi - entries[i].psi)
    }
  }
  return 1
}
