import { create } from 'zustand'

type Mode = 'casual' | 'expert'
type Language = 'en' | 'ar'

export interface HeroCity {
  lat: number
  lng: number
  name: string
}

interface AppStore {
  activeSection: string
  setActiveSection: (id: string) => void
  mode: Mode
  setMode: (mode: Mode) => void
  language: Language
  setLanguage: (lang: Language) => void
  heroCity: HeroCity | null
  setHeroCity: (city: HeroCity | null) => void
}

export const useAppStore = create<AppStore>((set) => ({
  activeSection: '',
  setActiveSection: (id) => set({ activeSection: id }),
  mode: 'casual',
  setMode: (mode) => set({ mode }),
  language: 'en',
  setLanguage: (language) => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = language
    set({ language })
  },
  heroCity: null,
  setHeroCity: (heroCity) => set({ heroCity }),
}))
