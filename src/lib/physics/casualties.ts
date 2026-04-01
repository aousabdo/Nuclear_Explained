/**
 * Simplified casualty estimation based on FEMA / Glasstone & Dolan methodology.
 * Uses uniform population density assumption within estimated urban footprint.
 * Educational model only — actual casualties depend on time of day, shelter, etc.
 */

export interface CasualtyEstimate {
  killed: number
  injured: number
}

/** Rough urban footprint in km² based on population size */
function estimateCityAreaKm2(population: number): number {
  if (population < 100_000) return 30
  if (population < 300_000) return 80
  if (population < 700_000) return 180
  if (population < 1_500_000) return 400
  if (population < 5_000_000) return 900
  if (population < 12_000_000) return 1_800
  return 3_000
}

function annularArea(outerKm: number, innerKm: number): number {
  return Math.PI * (outerKm * outerKm - innerKm * innerKm)
}

/**
 * Estimates killed and injured for a surface or air burst over a city.
 * Casualty fractions by overpressure zone (simplified from DoD/FEMA models):
 *   fireball  (>20 psi): ~98% killed
 *   20 psi zone:         ~50% killed, 45% injured
 *   5 psi zone:          ~10% killed, 55% injured
 *   1 psi zone:          ~2%  killed, 25% injured
 */
export function estimateCasualties(
  population: number,
  fireballKm: number,
  psi20Km: number,
  psi5Km: number,
  psi1Km: number,
): CasualtyEstimate {
  if (!population || population <= 0) return { killed: 0, injured: 0 }

  const cityAreaKm2 = estimateCityAreaKm2(population)
  const density = population / cityAreaKm2 // people / km²

  // Population in each zone — capped so zones can't exceed city extent
  const popIn = (area: number) => Math.round(density * Math.min(area, cityAreaKm2))

  const fireballPop = popIn(Math.PI * fireballKm * fireballKm)
  const psi20Pop    = popIn(annularArea(psi20Km, fireballKm))
  const psi5Pop     = popIn(annularArea(psi5Km,  psi20Km))
  const psi1Pop     = popIn(annularArea(psi1Km,  psi5Km))

  const killed = Math.round(
    fireballPop * 0.98 +
    psi20Pop    * 0.50 +
    psi5Pop     * 0.10 +
    psi1Pop     * 0.02
  )

  const injured = Math.round(
    psi20Pop * 0.45 +
    psi5Pop  * 0.55 +
    psi1Pop  * 0.25
  )

  return {
    killed:  Math.min(killed,  population),
    injured: Math.min(injured, Math.max(0, population - killed)),
  }
}

export function formatCasualties(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`
  return n.toString()
}
