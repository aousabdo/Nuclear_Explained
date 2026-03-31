import { create } from 'zustand'

interface AppState {
  activeSection: string
  setActiveSection: (id: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  activeSection: 'hero',
  setActiveSection: (id) => set({ activeSection: id }),
}))
