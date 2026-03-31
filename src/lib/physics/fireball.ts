/**
 * Calculate fireball radius.
 * For airbursts: r ≈ 66 × Y^0.4 meters (Glasstone & Dolan)
 * For surface bursts: multiply by ~1.3
 *
 * @param yieldKt - Weapon yield in kilotons
 * @param surfaceBurst - Whether this is a surface burst
 * @returns Fireball maximum radius in meters
 */
export function fireballRadius(yieldKt: number, surfaceBurst = false): number {
  const baseRadius = 66 * Math.pow(yieldKt, 0.4)
  return surfaceBurst ? baseRadius * 1.3 : baseRadius
}

/**
 * Duration of the fireball's thermal pulse (seconds).
 * Approximate: t ≈ Y^0.4 seconds for Y in Mt
 */
export function fireballDuration(yieldKt: number): number {
  const yieldMt = yieldKt / 1000
  return Math.pow(yieldMt, 0.4)
}
