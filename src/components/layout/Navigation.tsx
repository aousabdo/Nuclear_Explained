import { useState } from 'react'
import { SECTIONS } from '../../config/sections'
import { CASUAL_SECTIONS } from '../../config/casualSections'
import { useAppStore } from '../../hooks/useAppStore'

// ─── Category groups for casual mode ─────────────────────────────────────────
const CASUAL_GROUPS = [
  {
    key: 'blast',
    label: 'BLAST',
    sectionIds: ['c-moment', 'c-destruction', 'c-scale', 'c-fallout'],
    color: '#ef4444',
  },
  {
    key: 'consequences',
    label: 'CONSEQUENCES',
    sectionIds: ['c-impact', 'c-winter', 'c-survival'],
    color: '#22c55e',
  },
  {
    key: 'threat',
    label: 'THREAT',
    sectionIds: ['c-trajectory', 'c-arsenal', 'c-nearmiss'],
    color: '#f97316',
  },
  {
    key: 'history',
    label: 'HISTORY',
    sectionIds: ['c-timeline', 'c-countries'],
    color: '#a855f7',
  },
  {
    key: 'you',
    label: 'YOU',
    sectionIds: ['c-risk', 'c-quiz'],
    color: '#3b82f6',
  },
]

function getGroupForSection(sectionId: string) {
  return CASUAL_GROUPS.find(g => g.sectionIds.includes(sectionId)) ?? null
}

export function Navigation() {
  const activeSection = useAppStore((s) => s.activeSection)
  const mode = useAppStore((s) => s.mode)
  const language = useAppStore((s) => s.language)

  const sections = mode === 'casual' ? CASUAL_SECTIONS : SECTIONS

  // Mobile: which category chip is open (shows sub-section dropdown)
  const [openGroup, setOpenGroup] = useState<string | null>(null)

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleGroupChipClick = (groupKey: string, firstSectionId: string) => {
    if (openGroup === groupKey) {
      setOpenGroup(null)
    } else {
      setOpenGroup(groupKey)
      scrollToSection(firstSectionId)
    }
  }

  // Active group for casual mode
  const activeGroup = mode === 'casual' ? getGroupForSection(activeSection) : null

  return (
    <>
      {/* ─── Desktop: fixed sidebar dots ─────────────────────────────────── */}
      <nav
        aria-label="Section navigation"
        className={`hidden lg:flex fixed top-1/2 -translate-y-1/2 z-50 flex-col gap-1 ${language === 'ar' ? 'right-4' : 'left-4'}`}
      >
        {mode === 'casual' ? (
          // Casual: dots grouped with tiny label dividers
          CASUAL_GROUPS.map((group) => {
            const groupSections = CASUAL_SECTIONS.filter(s => group.sectionIds.includes(s.id))
            return (
              <div key={group.key} className="flex flex-col gap-1">
                {/* Group label */}
                <div
                  className="text-[8px] font-bold tracking-[0.15em] uppercase opacity-40 select-none px-0.5 mt-2 first:mt-0"
                  style={{ color: group.color, writingMode: 'horizontal-tb' }}
                >
                  {group.label}
                </div>
                {/* Thin divider */}
                <div className="h-px w-4 rounded-full mb-1" style={{ backgroundColor: group.color + '40' }} />
                {/* Dots */}
                {groupSections.map((section) => (
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
                ))}
              </div>
            )
          })
        ) : (
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
          // Casual: grouped category chips
          <div>
            {/* Category chip row */}
            <div className="flex gap-1 px-3 pe-36 py-2 overflow-x-auto scrollbar-hide">
              {CASUAL_GROUPS.map((group) => {
                const isActive = activeGroup?.key === group.key
                const isOpen = openGroup === group.key
                return (
                  <button
                    key={group.key}
                    onClick={() => handleGroupChipClick(group.key, group.sectionIds[0])}
                    className="text-xs whitespace-nowrap px-3 py-1 rounded-full transition-all flex-shrink-0 font-semibold tracking-wide"
                    style={{
                      backgroundColor: isActive || isOpen ? group.color + '22' : 'transparent',
                      color: isActive || isOpen ? group.color : '#94a3b8',
                      border: isActive || isOpen ? `1px solid ${group.color}55` : '1px solid transparent',
                    }}
                  >
                    {group.label}
                  </button>
                )
              })}
            </div>

            {/* Sub-section dropdown row (only shown for open group) */}
            {openGroup && (() => {
              const group = CASUAL_GROUPS.find(g => g.key === openGroup)!
              const groupSections = CASUAL_SECTIONS.filter(s => group.sectionIds.includes(s.id))
              return (
                <div
                  className="flex gap-1 px-3 py-1.5 overflow-x-auto scrollbar-hide border-t"
                  style={{ borderColor: group.color + '25', backgroundColor: group.color + '08' }}
                >
                  {groupSections.map((section) => (
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
              )
            })()}
          </div>
        ) : (
          // Expert: original flat scrollable pills
          <div className="flex overflow-x-auto gap-1 ps-3 pe-36 py-2 scrollbar-hide">
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
