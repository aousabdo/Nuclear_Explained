export interface CasualSectionConfig {
  id: string
  title: string
  shortTitle: string
  accentColor: string
  order: number
}

export const CASUAL_SECTIONS: CasualSectionConfig[] = [
  { id: 'c-moment',      title: 'The Detonation',    shortTitle: 'Detonation',  accentColor: '#ef4444', order: 1 },
  { id: 'c-destruction', title: 'Destruction Zones', shortTitle: 'Destruction', accentColor: '#3b82f6', order: 2 },
  { id: 'c-scale',       title: 'Scale',             shortTitle: 'Scale',       accentColor: '#f59e0b', order: 3 },
  { id: 'c-fallout',     title: 'Fallout Drift',     shortTitle: 'Fallout',     accentColor: '#ef4444', order: 4 },
  { id: 'c-impact',      title: 'The Human Cost',    shortTitle: 'Impact',      accentColor: '#22c55e', order: 5 },
  { id: 'c-winter',     title: 'Nuclear Winter',    shortTitle: 'Winter',      accentColor: '#3b82f6', order: 6 },
  { id: 'c-survival',   title: 'Survival Guide',    shortTitle: 'Survival',    accentColor: '#22c55e', order: 7 },
]
