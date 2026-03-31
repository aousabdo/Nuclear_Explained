import { create } from 'zustand'

type Mode = 'casual' | 'expert'

interface AppStore {
  activeSection: string
  setActiveSection: (id: string) => void
  mode: Mode
  setMode: (mode: Mode) => void
}

export const useAppStore = create<AppStore>((set) => ({
  activeSection: '',
  setActiveSection: (id) => set({ activeSection: id }),
  mode: 'casual',
  setMode: (mode) => set({ mode }),
}))
