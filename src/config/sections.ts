export interface SectionConfig {
  id: string
  title: string
  shortTitle: string
  accentColor: string
  order: number
}

export const SECTIONS: SectionConfig[] = [
  { id: 'hero', title: 'Nuclear Explained', shortTitle: 'Intro', accentColor: '#f59e0b', order: 0 },
  { id: 'basics', title: 'Fission vs. Fusion', shortTitle: 'Basics', accentColor: '#3b82f6', order: 1 },
  { id: 'effects', title: 'The Five Effects', shortTitle: 'Effects', accentColor: '#f97316', order: 2 },
  { id: 'height-of-burst', title: 'Height of Burst', shortTitle: 'HOB', accentColor: '#3b82f6', order: 3 },
  { id: 'blast-radius', title: 'Blast Radius Calculator', shortTitle: 'Blast', accentColor: '#ef4444', order: 4 },
  { id: 'tactical-strategic', title: 'Tactical vs. Strategic', shortTitle: 'Weapons', accentColor: '#a855f7', order: 5 },
  { id: 'fallout', title: 'Fallout Simulator', shortTitle: 'Fallout', accentColor: '#ef4444', order: 6 },
  { id: 'iran', title: 'The Bunker Buster Problem', shortTitle: 'Iran', accentColor: '#f59e0b', order: 7 },
  { id: 'cube-root', title: 'The Cube Root Law', shortTitle: 'Scaling', accentColor: '#3b82f6', order: 8 },
  { id: 'history', title: 'Nuclear Testing History', shortTitle: 'History', accentColor: '#22c55e', order: 9 },
  { id: 'footer', title: 'Resources', shortTitle: 'Resources', accentColor: '#94a3b8', order: 10 },
]
