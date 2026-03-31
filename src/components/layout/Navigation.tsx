import { SECTIONS } from '../../config/sections'
import { CASUAL_SECTIONS } from '../../config/casualSections'
import { useAppStore } from '../../hooks/useAppStore'

export function Navigation() {
  const activeSection = useAppStore((s) => s.activeSection)
  const mode = useAppStore((s) => s.mode)

  const sections = mode === 'casual' ? CASUAL_SECTIONS : SECTIONS

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Desktop: fixed left sidebar dots */}
      <nav className="hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 z-50 flex-col gap-3">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="group relative flex items-center"
            title={section.shortTitle}
          >
            <div
              className="w-2.5 h-2.5 rounded-full border-2 transition-all duration-300"
              style={{
                borderColor: activeSection === section.id ? section.accentColor : '#475569',
                backgroundColor: activeSection === section.id ? section.accentColor : 'transparent',
                transform: activeSection === section.id ? 'scale(1.3)' : 'scale(1)',
              }}
            />
            <span className="absolute left-6 whitespace-nowrap text-xs text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity bg-bg-secondary px-2 py-1 rounded pointer-events-none">
              {section.shortTitle}
            </span>
          </button>
        ))}
      </nav>

      {/* Mobile: top bar */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-bg-primary/90 backdrop-blur-sm border-b border-border">
        <div className="flex overflow-x-auto gap-1 px-3 py-2 scrollbar-hide">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="text-xs whitespace-nowrap px-2.5 py-1 rounded-full transition-all flex-shrink-0"
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
      </nav>
    </>
  )
}
