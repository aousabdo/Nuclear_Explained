import { useAppStore } from '../../hooks/useAppStore'

export function LanguageToggle() {
  const { language, setLanguage } = useAppStore()

  return (
    <div className="fixed top-14 right-4 z-50 flex rounded-full border border-white/10 bg-black/50 backdrop-blur-md overflow-hidden shadow-lg">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 text-sm font-semibold transition-all duration-200 ${
          language === 'en' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'
        }`}
      >
        EN
      </button>
      <div className="w-px bg-white/10 my-1.5" />
      <button
        onClick={() => setLanguage('ar')}
        className={`px-3 py-1.5 text-sm font-semibold transition-all duration-200 ${
          language === 'ar' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white/70'
        }`}
      >
        عربي
      </button>
    </div>
  )
}
