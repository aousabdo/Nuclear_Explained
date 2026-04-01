import { SECTIONS } from '../../config/sections'
import { CASUAL_SECTIONS } from '../../config/casualSections'
import { CHAPTERS } from '../../config/chapters'
import { useAppStore } from '../../hooks/useAppStore'

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
          // Casual: chapter chips — tapping switches chapters
          <div
            className="flex gap-1 px-3 pe-44 py-2 overflow-x-auto scrollbar-hide"
            style={{ maskImage: 'linear-gradient(to right, black calc(100% - 160px), transparent calc(100% - 10px))', WebkitMaskImage: 'linear-gradient(to right, black calc(100% - 160px), transparent calc(100% - 10px))' }}
          >
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
        ) : (
          // Expert: original flat scrollable pills
          <div
            className="flex overflow-x-auto gap-1 ps-3 pe-44 py-2 scrollbar-hide"
            style={{ maskImage: 'linear-gradient(to right, black calc(100% - 160px), transparent calc(100% - 10px))', WebkitMaskImage: 'linear-gradient(to right, black calc(100% - 160px), transparent calc(100% - 10px))' }}
          >
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
        )}
      </nav>
    </>
  )
}
