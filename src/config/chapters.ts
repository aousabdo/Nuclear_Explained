export interface Chapter {
  key: string
  slug: string
  label: string
  labelAr: string
  icon: string
  color: string
  sectionIds: string[]
  description: string
  descriptionAr: string
}

export const CHAPTERS: Chapter[] = [
  {
    key: 'blast',
    slug: 'blast',
    label: 'Blast',
    labelAr: 'الانفجار',
    icon: '💥',
    color: '#ef4444',
    sectionIds: ['c-moment', 'c-destruction', 'c-scale', 'c-fallout'],
    description: 'What happens in the first seconds',
    descriptionAr: 'ماذا يحدث في الثواني الأولى',
  },
  {
    key: 'consequences',
    slug: 'consequences',
    label: 'Consequences',
    labelAr: 'التداعيات',
    icon: '☢️',
    color: '#f97316',
    sectionIds: ['c-impact', 'c-winter', 'c-survival'],
    description: 'The human and environmental toll',
    descriptionAr: 'الثمن البشري والبيئي',
  },
  {
    key: 'threat',
    slug: 'threat',
    label: 'Threat',
    labelAr: 'التهديد',
    icon: '🚀',
    color: '#a855f7',
    sectionIds: ['c-trajectory', 'c-arsenal', 'c-nearmiss'],
    description: 'The global nuclear threat today',
    descriptionAr: 'التهديد النووي العالمي اليوم',
  },
  {
    key: 'history',
    slug: 'history',
    label: 'History',
    labelAr: 'التاريخ',
    icon: '📅',
    color: '#f59e0b',
    sectionIds: ['c-timeline', 'c-countries'],
    description: '2,056 tests · 9 nuclear states',
    descriptionAr: '٢٠٥٦ اختباراً · ٩ دول نووية',
  },
  {
    key: 'you',
    slug: 'your-risk',
    label: 'Your Risk',
    labelAr: 'مخاطرك',
    icon: '🎯',
    color: '#22c55e',
    sectionIds: ['c-risk', 'c-quiz'],
    description: 'How close are you? How much do you know?',
    descriptionAr: 'كم أنت قريب؟ كم تعرف؟',
  },
]

export function getChapterByKey(key: string): Chapter | undefined {
  return CHAPTERS.find(c => c.key === key)
}

export function getChapterBySlug(slug: string): Chapter | undefined {
  return CHAPTERS.find(c => c.slug === slug)
}

export function getChapterForSection(sectionId: string): Chapter | undefined {
  return CHAPTERS.find(c => c.sectionIds.includes(sectionId))
}
