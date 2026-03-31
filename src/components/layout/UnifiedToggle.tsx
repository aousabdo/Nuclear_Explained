import { useAppStore } from '../../hooks/useAppStore'
import { useTranslation } from '../../hooks/useTranslation'

export function UnifiedToggle() {
  const { mode, setMode, language, setLanguage } = useAppStore()
  const t = useTranslation()

  const handleMode = (m: 'casual' | 'expert') => {
    setMode(m)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLanguage = (lang: 'en' | 'ar') => {
    setLanguage(lang)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const modeButtons = (
    <>
      <button
        onClick={() => handleMode('casual')}
        className={`px-3 py-2 text-sm font-semibold transition-all duration-200 rounded-full flex items-center gap-1 ${
          mode === 'casual' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'
        }`}
      >
        {t.modeToggle.visual}
      </button>
      <button
        onClick={() => handleMode('expert')}
        className={`px-3 py-2 text-sm font-semibold transition-all duration-200 rounded-full flex items-center gap-1 ${
          mode === 'expert' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'
        }`}
      >
        {t.modeToggle.deepDive}
      </button>
    </>
  )

  const langButtons = (
    <>
      <button
        onClick={() => handleLanguage('en')}
        className={`px-3 py-2 text-sm font-semibold transition-all duration-200 rounded-full ${
          language === 'en' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => handleLanguage('ar')}
        className={`px-3 py-2 text-sm font-semibold transition-all duration-200 rounded-full ${
          language === 'ar' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'
        }`}
      >
        عر
      </button>
    </>
  )

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`flex items-center rounded-full border border-white/10 bg-black/50 backdrop-blur-md shadow-lg px-1 py-1 gap-1 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
        {language === 'ar' ? (
          <>
            {langButtons}
            <div className="w-px bg-white/10 my-1.5 self-stretch" />
            {modeButtons}
          </>
        ) : (
          <>
            {modeButtons}
            <div className="w-px bg-white/10 my-1.5 self-stretch" />
            {langButtons}
          </>
        )}
      </div>
    </div>
  )
}
