import { SECTIONS } from '../../config/sections'
import { CASUAL_SECTIONS } from '../../config/casualSections'
import { CHAPTERS } from '../../config/chapters'
import { useAppStore } from '../../hooks/useAppStore'

function MobileToggle() {
  const { mode, setMode, language, setLanguage } = useAppStore()
  return (
    <div className="flex-shrink-0 flex items-center gap-0.5 px-2 border-l border-white/10">
      <button
        onClick={() => { setMode('casual'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        aria-label="Switch to casual mode"
        className={`px-2 py-1 text-[11px] font-semibold rounded-full transition-all ${mode === 'casual' ? 'bg-white/15 text-white' : 'text-white/40'}`}
      >👁</button>
      <button
        onClick={() => { setMode('expert'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        aria-label="Switch to expert mode"
        className={`px-2 py-1 text-[11px] font-semibold rounded-full transition-all ${mode === 'expert' ? 'bg-white/15 text-white' : 'text-white/40'}`}
      >⚛</button>
      <div className="w-px h-4 bg-white/10 mx-0.5" />
      <button
        onClick={() => { setLanguage('en'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        aria-label="Switch to English"
        className={`px-2 py-1 text-[11px] font-semibold rounded-full transition-all ${language === 'en' ? 'bg-white/15 text-white' : 'text-white/40'}`}
      >EN</button>
      <button
        onClick={() => { setLanguage('ar'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        aria-label="Switch to Arabic"
        className={`px-2 py-1 text-[11px] font-semibold rounded-full transition-all ${language === 'ar' ? 'bg-white/15 text-white' : 'text-white/40'}`}
      >عر</button>
    </div>
  )
}

export function Navigation() {
  const activeSection = useAppStore((s) => s.activeSection)
  const mode = useAppStore((s) => s.mode)
  const language = useAppStore((s) => s.language)
  const activeChapter = useAppStore((s) => s.activeChapter)
  const setActiveChapter = useAppStore((s) => s.setActiveChapter)

  const sections = mode === 'casual' ? CASUAL_SECTIONS : SECTIONS
  const isAr = language === 'ar'

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* ─── Desktop: fixed sidebar dots ─────────────────────────────────── */}
      <nav
        aria-label="Section navigation"
        className={`hidden lg:flex fixed top-1/2 -translate-y-1/2 z-50 flex-col gap-1 ${language === 'ar' ? 'right-4' : 'left-4'}`}
      >
        {mode === 'casual' ? (() => {
          // Casual: show only active chapter's section dots
          const chapter = CHAPTERS.find(c => c.key === activeChapter)
          const chapterSections = CASUAL_SECTIONS.filter(s => chapter?.sectionIds.includes(s.id))
          return (
            <div className="flex flex-col gap-1">
              {/* Chapter label */}
              <div
                className="text-[8px] font-bold tracking-[0.12em] uppercase select-none px-0.5 mb-1"
                style={{ color: chapter?.color ?? '#94a3b8', opacity: 0.7 }}
              >
                {chapter?.label}
              </div>
              <div className="h-px w-4 rounded-full mb-1" style={{ backgroundColor: (chapter?.color ?? '#94a3b8') + '50' }} />
              {chapterSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="group relative flex items-center"
                  title={section.shortTitle}
                  aria-label={section.shortTitle}
                  aria-current={activeSection === section.id ? 'true' : undefined}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full border-2 transition-all duration-300"
                    style={{
                      borderColor: activeSection === section.id ? section.accentColor : '#475569',
                      backgroundColor: activeSection === section.id ? section.accentColor : 'transparent',
                      transform: activeSection === section.id ? 'scale(1.3)' : 'scale(1)',
                    }}
                  />
                  <span className={`absolute whitespace-nowrap text-xs text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity bg-bg-secondary px-2 py-1 rounded pointer-events-none ${language === 'ar' ? 'right-6' : 'left-6'}`}>
                    {section.shortTitle}
                  </span>
                </button>
              ))}
              {/* Chapter switcher arrows */}
              <div className="flex flex-col gap-1 mt-3 pt-2 border-t border-white/5">
                {CHAPTERS.map(ch => (
                  <button
                    key={ch.key}
                    onClick={() => { setActiveChapter(ch.key); document.getElementById('chapter-nav')?.scrollIntoView({ behavior: 'smooth' }) }}
                    aria-label={ch.label}
                    title={ch.label}
                    className="w-5 h-5 rounded-full border transition-all duration-200 flex items-center justify-center text-[9px]"
                    style={{
                      borderColor: ch.key === activeChapter ? ch.color : 'rgba(255,255,255,0.1)',
                      backgroundColor: ch.key === activeChapter ? ch.color + '30' : 'transparent',
                    }}
                  >
                    {ch.icon}
                  </button>
                ))}
              </div>
            </div>
          )
        })() : (
          // Expert: original flat dots
          sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="group relative flex items-center"
              title={section.shortTitle}
              aria-label={section.shortTitle}
              aria-current={activeSection === section.id ? 'true' : undefined}
            >
              <div
                className="w-2.5 h-2.5 rounded-full border-2 transition-all duration-300"
                style={{
                  borderColor: activeSection === section.id ? section.accentColor : '#475569',
                  backgroundColor: activeSection === section.id ? section.accentColor : 'transparent',
                  transform: activeSection === section.id ? 'scale(1.3)' : 'scale(1)',
                }}
              />
              <span
                className={`absolute whitespace-nowrap text-xs text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity bg-bg-secondary px-2 py-1 rounded pointer-events-none ${language === 'ar' ? 'right-6' : 'left-6'}`}
              >
                {section.shortTitle}
              </span>
            </button>
          ))
        )}
      </nav>

      {/* ─── Mobile: top bar ──────────────────────────────────────────────── */}
      <nav aria-label="Section navigation" className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-bg-primary/90 backdrop-blur-sm border-b border-border">
        {mode === 'casual' ? (
          // Casual: chapter chips — flex row, tabs take remaining space, spacer blocks toggle area
          <div className="flex items-center">
            <div className="flex-1 min-w-0 overflow-x-auto scrollbar-hide">
              <div className="flex gap-1 px-3 py-2">
                {CHAPTERS.map((chapter) => {
                  const isActive = chapter.key === activeChapter
                  return (
                    <button
                      key={chapter.key}
                      onClick={() => {
                        setActiveChapter(chapter.key)
                        document.getElementById('chapter-nav')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="flex items-center gap-1 text-xs whitespace-nowrap px-3 py-1 rounded-full transition-all flex-shrink-0 font-semibold"
                      aria-current={isActive ? 'true' : undefined}
                      style={{
                        backgroundColor: isActive ? chapter.color + '22' : 'transparent',
                        color: isActive ? chapter.color : '#94a3b8',
                        border: isActive ? `1px solid ${chapter.color}55` : '1px solid transparent',
                      }}
                    >
                      <span>{chapter.icon}</span>
                      <span>{isAr ? chapter.labelAr : chapter.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <MobileToggle />
          </div>
        ) : (
          // Expert: original flat scrollable pills
          <div className="flex items-center">
            <div className="flex-1 min-w-0 overflow-x-auto scrollbar-hide">
              <div className="flex gap-1 ps-3 py-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="text-xs whitespace-nowrap px-2 py-1 rounded-full transition-all flex-shrink-0"
                    aria-label={section.shortTitle}
                    aria-current={activeSection === section.id ? 'true' : undefined}
                    style={{
                      backgroundColor: activeSection === section.id ? section.accentColor + '20' : 'transparent',
                      color: activeSection === section.id ? section.accentColor : '#94a3b8',
                      border: activeSection === section.id ? `1px solid ${section.accentColor}40` : '1px solid transparent',
                    }}
                  >
                    {section.shortTitle}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-40 flex-shrink-0" />
          </div>
        )}
      </nav>
    </>
  )
}
