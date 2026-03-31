/**
 * Calculate prompt radiation radius.
 * Prompt gamma and neutron radiation is only significant for lower yield weapons.
 * For yields > ~50 kt, the blast radius exceeds the lethal radiation radius.
 *
 * Uses an empirical fit: r ≈ k × Y^0.19 for prompt radiation
 * (much weaker yield dependence than blast due to atmospheric absorption)
 *
 * @param yieldKt - Weapon yield in kilotons
 * @param doseRem - Target dose in rem
 * @returns Radius in kilometers
 */
export function promptRadiationRadius(yieldKt: number, doseRem: number): number {
  // Scaling constants derived from Glasstone & Dolan Fig 8.128
  // For 500 rem (lethal): k ≈ 1.15 km at 1 kt
  const k500 = 1.15

  // Adjust for different dose thresholds (log-linear)
  const doseFactor = Math.pow(500 / doseRem, 0.3)
  const k = k500 * doseFactor

  // Radiation radius grows very slowly with yield
  return k * Math.pow(yieldKt, 0.19)
}

/**
 * Physiological effects by radiation dose.
 */
export interface DoseEffect {
  minRem: number
  maxRem: number
  shortTerm: string
  longTerm: string
  mortality: string
}

export const DOSE_EFFECTS: DoseEffect[] = [
  { minRem: 0, maxRem: 25, shortTerm: 'No observable symptoms', longTerm: 'Slight increase in cancer risk', mortality: 'None' },
  { minRem: 25, maxRem: 100, shortTerm: 'Nausea in some individuals', longTerm: 'Moderate increase in cancer risk', mortality: 'None expected' },
  { minRem: 100, maxRem: 200, shortTerm: 'Nausea, fatigue, vomiting within hours', longTerm: 'Increased cancer risk, potential cataracts', mortality: '<5% without treatment' },
  { minRem: 200, maxRem: 400, shortTerm: 'Severe nausea, hair loss, hemorrhaging', longTerm: 'Significant cancer risk, immune compromise', mortality: '5-50% without treatment' },
  { minRem: 400, maxRem: 600, shortTerm: 'Acute radiation syndrome, internal bleeding', longTerm: 'If survived: chronic health effects', mortality: '50-90% without treatment' },
  { minRem: 600, maxRem: 1000, shortTerm: 'Destruction of bone marrow and intestinal lining', longTerm: 'Survival unlikely', mortality: '>90% even with treatment' },
  { minRem: 1000, maxRem: 10000, shortTerm: 'Rapid incapacitation, CNS damage', longTerm: 'N/A', mortality: '100% within days' },
]
