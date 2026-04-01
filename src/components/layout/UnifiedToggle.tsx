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
        title={t.modeToggle.visual}
        aria-label="Switch to casual mode"
        className={`px-2 md:px-3 py-1.5 text-xs md:text-sm font-semibold transition-all duration-200 rounded-full flex items-center gap-1 ${
          mode === 'casual' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'
        }`}
      >
        {/* Icon always visible, text hidden on mobile */}
        <span>{t.modeToggle.visual.split(' ')[0]}</span>
        <span className="hidden md:inline">{t.modeToggle.visual.split(' ').slice(1).join(' ')}</span>
      </button>
      <button
        onClick={() => handleMode('expert')}
        title={t.modeToggle.deepDive}
        aria-label="Switch to expert mode"
        className={`px-2 md:px-3 py-1.5 text-xs md:text-sm font-semibold transition-all duration-200 rounded-full flex items-center gap-1 ${
          mode === 'expert' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'
        }`}
      >
        <span>{t.modeToggle.deepDive.split(' ')[0]}</span>
        <span className="hidden md:inline">{t.modeToggle.deepDive.split(' ').slice(1).join(' ')}</span>
      </button>
    </>
  )

  const langButtons = (
    <>
      <button
        onClick={() => handleLanguage('en')}
        aria-label="Switch to English"
        className={`px-2 py-1.5 text-xs font-semibold transition-all duration-200 rounded-full ${
          language === 'en' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => handleLanguage('ar')}
        aria-label="Switch to Arabic"
        className={`px-2 py-1.5 text-xs font-semibold transition-all duration-200 rounded-full ${
          language === 'ar' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'
        }`}
      >
        عر
      </button>
    </>
  )

  return (
    <div className="hidden lg:block fixed top-4 right-4 z-50">
      <div className={`flex items-center rounded-full border border-white/10 bg-black/60 backdrop-blur-md shadow-lg px-1 py-1 gap-0.5 md:gap-1 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
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
