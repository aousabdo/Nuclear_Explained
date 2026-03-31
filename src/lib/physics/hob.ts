/**
 * Height of Burst calculations.
 * The optimal burst height maximizes the ground area receiving
 * at least a specified overpressure, due to Mach stem formation.
 */

/**
 * Calculate optimal height of burst for maximum area at target overpressure.
 * Based on Glasstone & Dolan Figure 3.73a relationships.
 *
 * @param yieldKt - Weapon yield in kilotons
 * @param targetPsi - Target overpressure in psi
 * @returns Optimal burst height in meters
 */
export function optimalHOB(yieldKt: number, targetPsi: number): number {
  // Scaled optimal HOB (meters per kt^(1/3)) varies with target overpressure
  // These are empirical fits from Glasstone & Dolan
  const scaledHOB = getScaledOptimalHOB(targetPsi)
  return scaledHOB * Math.pow(yieldKt, 1 / 3)
}

function getScaledOptimalHOB(psi: number): number {
  // Empirical scaled optimal HOB values (m per kt^(1/3))
  // Higher overpressure targets → lower optimal HOB
  const data: [number, number][] = [
    [1, 420],
    [2, 340],
    [5, 220],
    [10, 160],
    [20, 110],
    [50, 60],
  ]

  if (psi <= data[0][0]) return data[0][1]
  if (psi >= data[data.length - 1][0]) return data[data.length - 1][1]

  for (let i = 0; i < data.length - 1; i++) {
    if (psi >= data[i][0] && psi <= data[i + 1][0]) {
      const logPsi = Math.log(psi)
      const logP0 = Math.log(data[i][0])
      const logP1 = Math.log(data[i + 1][0])
      const t = (logPsi - logP0) / (logP1 - logP0)
      return data[i][1] + t * (data[i + 1][1] - data[i][1])
    }
  }
  return data[0][1]
}

/**
 * Calculate the effective ground-level blast radius for a given HOB.
 * The Mach stem enhances overpressure beyond what a simple geometric
 * calculation would predict.
 *
 * @param yieldKt - Weapon yield in kilotons
 * @param hobMeters - Height of burst in meters
 * @param targetPsi - Target overpressure in psi
 * @returns Effective ground-level radius in km where overpressure >= targetPsi
 */
export function effectiveGroundRadius(
  yieldKt: number,
  hobMeters: number,
  targetPsi: number
): number {
  const optHOB = optimalHOB(yieldKt, targetPsi)
  const hobRatio = hobMeters / Math.max(optHOB, 1)

  // At optimal HOB, radius is maximized (enhancement factor ~1.15 over surface)
  // The curve is roughly parabolic around the optimum
  // Surface burst: factor ~ 0.85
  // Optimal HOB: factor ~ 1.15
  // Too high: factor decreases toward 0

  const surfaceRadius = getSurfaceBlastRadius(yieldKt, targetPsi)

  if (hobMeters === 0) return surfaceRadius

  // Parabolic approximation of the enhancement curve
  let enhancementFactor: number
  if (hobRatio <= 1) {
    // Below optimal: enhancement increases from ~0.85 to ~1.15
    enhancementFactor = 0.85 + 0.30 * (1 - Math.pow(1 - hobRatio, 2))
  } else {
    // Above optimal: enhancement decreases back toward 0
    const excess = hobRatio - 1
    enhancementFactor = Math.max(0, 1.15 * Math.exp(-1.5 * excess * excess))
  }

  return surfaceRadius * enhancementFactor / 0.85
}

function getSurfaceBlastRadius(yieldKt: number, psi: number): number {
  // Use the same scaling as blast.ts but for surface burst geometry
  const scaledDistances: Record<number, number> = {
    1: 1.49, 2: 1.04, 5: 0.71, 10: 0.51, 20: 0.37, 50: 0.24,
  }

  const psiValues = Object.keys(scaledDistances).map(Number).sort((a, b) => a - b)
  let scaledDist = scaledDistances[1]

  for (let i = 0; i < psiValues.length - 1; i++) {
    if (psi >= psiValues[i] && psi <= psiValues[i + 1]) {
      const t = (Math.log(psi) - Math.log(psiValues[i])) /
                (Math.log(psiValues[i + 1]) - Math.log(psiValues[i]))
      scaledDist = scaledDistances[psiValues[i]] +
                   t * (scaledDistances[psiValues[i + 1]] - scaledDistances[psiValues[i]])
      break
    }
  }

  return scaledDist * Math.pow(yieldKt, 1 / 3) * 0.85 // Surface burst penalty
}

/**
 * Calculate the Mach stem triple point path.
 * Returns points tracing where the incident wave, reflected wave,
 * and Mach stem meet as the blast propagates outward.
 *
 * @param yieldKt - Weapon yield in kilotons
 * @param hobMeters - Height of burst in meters
 * @returns Array of {groundDistance, triplePointHeight} in meters
 */
export function machStemPath(
  _yieldKt: number,
  hobMeters: number
): Array<{ groundDistance: number; triplePointHeight: number }> {
  if (hobMeters <= 0) return []

  const points: Array<{ groundDistance: number; triplePointHeight: number }> = []
  // Mach stem begins forming at a ground distance roughly equal to the HOB
  const machFormationDist = hobMeters * 0.9
  const maxDist = hobMeters * 8 // Mach stem extends to many times the HOB

  for (let d = machFormationDist; d <= maxDist; d += maxDist / 50) {
    // Triple point rises from ground as distance increases
    // Empirical: h_tp ≈ HOB × (1 - HOB/d) × correction
    const ratio = hobMeters / d
    const triplePointHeight = hobMeters * (1 - ratio) * (1 - Math.exp(-d / (hobMeters * 2)))

    // The triple point height should be less than the HOB
    if (triplePointHeight >= 0 && triplePointHeight < hobMeters) {
      points.push({
        groundDistance: d / 1000, // Convert to km
        triplePointHeight: triplePointHeight,
      })
    }
  }

  return points
}
