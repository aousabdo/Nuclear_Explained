import { useAppStore } from '../../hooks/useAppStore'
import { useTranslation } from '../../hooks/useTranslation'

export function ModeToggle() {
  const { mode, setMode } = useAppStore()
  const t = useTranslation()

  const handleSwitch = (m: 'casual' | 'expert') => {
    setMode(m)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex rounded-full border border-white/10 bg-black/50 backdrop-blur-md overflow-hidden shadow-lg">
      <button
        onClick={() => handleSwitch('casual')}
        className={`px-4 py-2 text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
          mode === 'casual' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'
        }`}
      >
        {t.modeToggle.visual}
      </button>
      <div className="w-px bg-white/10 my-1.5" />
      <button
        onClick={() => handleSwitch('expert')}
        className={`px-4 py-2 text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
          mode === 'expert' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'
        }`}
      >
        {t.modeToggle.deepDive}
      </button>
    </div>
  )
}
