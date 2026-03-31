/**
 * Format a distance value with appropriate units.
 */
export function formatDistance(km: number): string {
  if (km < 0.01) return `${Math.round(km * 1000)} m`
  if (km < 1) return `${(km * 1000).toFixed(0)} m`
  if (km < 10) return `${km.toFixed(2)} km`
  if (km < 100) return `${km.toFixed(1)} km`
  return `${Math.round(km)} km`
}

/**
 * Format a yield value with appropriate units.
 */
export function formatYield(kt: number): string {
  if (kt < 0.001) return `${(kt * 1000).toFixed(1)} tons`
  if (kt < 1) return `${kt.toFixed(2)} kt`
  if (kt < 1000) return `${kt.toFixed(kt < 10 ? 1 : 0)} kt`
  return `${(kt / 1000).toFixed(kt < 10000 ? 1 : 0)} Mt`
}

/**
 * Format area in km².
 */
export function formatArea(km2: number): string {
  if (km2 < 0.01) return `${(km2 * 1e6).toFixed(0)} m\u00B2`
  if (km2 < 1) return `${km2.toFixed(2)} km\u00B2`
  if (km2 < 100) return `${km2.toFixed(1)} km\u00B2`
  return `${Math.round(km2).toLocaleString()} km\u00B2`
}

/**
 * Format population number.
 */
export function formatPopulation(pop: number): string {
  if (pop < 1000) return pop.toString()
  if (pop < 1000000) return `${(pop / 1000).toFixed(1)}K`
  return `${(pop / 1000000).toFixed(1)}M`
}
