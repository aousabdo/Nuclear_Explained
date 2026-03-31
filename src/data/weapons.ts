export interface WeaponPreset {
  name: string
  yieldKt: number
  type: 'fission' | 'thermonuclear' | 'boosted'
  country: string
  description: string
  year?: number
}

export const WEAPON_PRESETS: WeaponPreset[] = [
  { name: 'W54 Davy Crockett', yieldKt: 0.02, type: 'fission', country: 'US', description: 'Smallest US nuclear weapon, man-portable', year: 1961 },
  { name: 'Little Boy (Hiroshima)', yieldKt: 15, type: 'fission', country: 'US', description: 'Gun-type uranium weapon', year: 1945 },
  { name: 'Fat Man (Nagasaki)', yieldKt: 21, type: 'fission', country: 'US', description: 'Implosion-type plutonium weapon', year: 1945 },
  { name: 'B61-12 (min)', yieldKt: 0.3, type: 'fission', country: 'US', description: 'Dial-a-yield tactical bomb, minimum setting' },
  { name: 'B61-12 (max)', yieldKt: 50, type: 'thermonuclear', country: 'US', description: 'Dial-a-yield tactical bomb, maximum setting' },
  { name: 'W76-2', yieldKt: 7, type: 'fission', country: 'US', description: 'Low-yield SLBM warhead for Trident II' },
  { name: 'W76-1', yieldKt: 100, type: 'thermonuclear', country: 'US', description: 'Standard SLBM warhead for Trident II' },
  { name: 'W88', yieldKt: 475, type: 'thermonuclear', country: 'US', description: 'Most powerful US SLBM warhead' },
  { name: 'W87-1', yieldKt: 475, type: 'thermonuclear', country: 'US', description: 'Sentinel ICBM warhead' },
  { name: 'B61-11', yieldKt: 400, type: 'thermonuclear', country: 'US', description: 'Nuclear earth penetrator' },
  { name: 'B83', yieldKt: 1200, type: 'thermonuclear', country: 'US', description: 'Highest yield US weapon (retired)', year: 1983 },
  { name: 'Castle Bravo', yieldKt: 15000, type: 'thermonuclear', country: 'US', description: 'Largest US nuclear test', year: 1954 },
  { name: 'Tsar Bomba', yieldKt: 50000, type: 'thermonuclear', country: 'USSR', description: 'Largest nuclear weapon ever detonated', year: 1961 },
]

export const YIELD_PRESETS = [
  { label: '10 kt', value: 10 },
  { label: '100 kt', value: 100 },
  { label: '500 kt', value: 500 },
  { label: '1 Mt', value: 1000 },
  { label: '50 Mt', value: 50000 },
]
