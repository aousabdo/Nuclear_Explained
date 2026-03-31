// Overpressure scaling factors from Glasstone & Dolan
// Maps overpressure (psi) to scaled distance (km per kt^(1/3))
// These are empirical fits to the standard nuclear blast tables
export const OVERPRESSURE_SCALED_DISTANCES: Record<number, number> = {
  1: 1.49,    // km per kt^(1/3) - light damage, window breakage
  2: 1.04,    // moderate damage, injuries likely
  5: 0.71,    // most buildings destroyed
  10: 0.51,   // reinforced concrete damaged
  20: 0.37,   // heavy blast damage, near-total destruction
  50: 0.24,   // crater and ejecta zone
}

// Thermal fluence scaling factors
// Maps cal/cm² threshold to scaled distance (km per kt^(1/2))
export const THERMAL_SCALED_DISTANCES: Record<number, number> = {
  3: 0.82,    // 1st degree burns
  5: 0.63,    // 2nd degree burns
  8: 0.50,    // 3rd degree burns
  12: 0.41,   // immediate ignition of many materials
}

// Prompt radiation scaled distances (km per kt^(1/3))
// Only significant for low yields (< ~50 kt)
export const RADIATION_SCALED_DISTANCES: Record<number, number> = {
  500: 1.35,   // lethal dose (500 rem)
  200: 1.55,   // radiation sickness certain
  100: 1.70,   // radiation sickness likely
}

// Standard atmospheric pressure at sea level
export const SEA_LEVEL_PRESSURE_PSI = 14.696

// Energy per kiloton in joules
export const JOULES_PER_KT = 4.184e12
