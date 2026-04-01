import { useRef } from 'react'
import { motion } from 'framer-motion'
import { CHAPTERS } from '../../config/chapters'
import { useAppStore } from '../../hooks/useAppStore'

export function ChapterNav() {
  const { activeChapter, setActiveChapter, language } = useAppStore()
  const isAr = language === 'ar'
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleChapterClick = (key: string) => {
    setActiveChapter(key)
    // Scroll to just below hero — find ChapterNav and scroll to it
    const el = document.getElementById('chapter-nav')
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 60
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const activeIndex = CHAPTERS.findIndex(c => c.key === activeChapter)
  const active = CHAPTERS[activeIndex]

  return (
    <div id="chapter-nav" className="relative z-30 border-y border-border bg-bg-primary/95 backdrop-blur-sm">
      {/* Tab row */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {CHAPTERS.map((chapter) => {
          const isActive = chapter.key === activeChapter
          return (
            <button
              key={chapter.key}
              onClick={() => handleChapterClick(chapter.key)}
              className="relative flex-shrink-0 flex flex-col items-center gap-1 px-4 md:px-6 py-3 md:py-4 transition-all group"
              style={{
                minWidth: '80px',
                color: isActive ? chapter.color : '#64748b',
              }}
            >
              {/* Active underline */}
              {isActive && (
                <motion.div
                  layoutId="chapter-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ backgroundColor: chapter.color }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <span className="text-lg md:text-xl" role="img" aria-label={chapter.label}>
                {chapter.icon}
              </span>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                {isAr ? chapter.labelAr : chapter.label}
              </span>
              <span
                className="text-[9px] font-mono opacity-60"
                style={{ color: isActive ? chapter.color : '#475569' }}
              >
                {chapter.sectionIds.length} {isAr ? 'أقسام' : 'sections'}
              </span>

              {/* Hover glow */}
              {!isActive && (
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `radial-gradient(ellipse at center bottom, ${chapter.color}10 0%, transparent 70%)` }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Active chapter subtitle bar */}
      <div
        className="px-4 py-2 text-[11px] text-text-muted border-t border-border/50 flex items-center justify-between"
        style={{ borderColor: `${active?.color}20` }}
      >
        <span style={{ color: active?.color }}>
          {active ? (isAr ? active.descriptionAr : active.description) : ''}
        </span>
        <span className="text-text-muted/50 font-mono">
          {activeIndex + 1} / {CHAPTERS.length}
        </span>
      </div>
    </div>
  )
}
