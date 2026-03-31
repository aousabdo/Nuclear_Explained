import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../hooks/useAppStore'

const SHORTCUTS = [
  { key: '?', description: 'Show keyboard shortcuts' },
  { key: 'Esc', description: 'Close this overlay' },
  { key: 'D', description: 'Toggle Deep Dive / Visual mode' },
  { key: 'A', description: 'Toggle Arabic / English language' },
  { key: '↑ / ↓', description: 'Scroll to previous / next section' },
  { key: 'T', description: 'Scroll back to top' },
]

const AR_SHORTCUTS = [
  { key: '?', description: 'عرض اختصارات لوحة المفاتيح' },
  { key: 'Esc', description: 'إغلاق هذه النافذة' },
  { key: 'D', description: 'التبديل بين وضع التحليل العميق / المرئي' },
  { key: 'A', description: 'التبديل بين العربية / الإنجليزية' },
  { key: '↑ / ↓', description: 'الانتقال للقسم السابق / التالي' },
  { key: 'T', description: 'العودة إلى الأعلى' },
]

// Section IDs for keyboard navigation
const EXPERT_SECTIONS = ['hero', 's-basics', 's-effects', 's-hob', 's-blast', 's-tactical', 's-fallout', 's-iran', 's-cuberoot', 's-history']
const CASUAL_SECTIONS = ['hero', 'c-moment', 'c-destruction', 'c-scale', 'c-fallout', 'c-impact']

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false)
  const { mode, language, setMode, setLanguage } = useAppStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      switch (e.key) {
        case '?':
          setOpen(o => !o)
          break
        case 'Escape':
          setOpen(false)
          break
        case 'd':
        case 'D':
          setMode(mode === 'expert' ? 'casual' : 'expert')
          window.scrollTo({ top: 0, behavior: 'smooth' })
          break
        case 'a':
        case 'A':
          setLanguage(language === 'en' ? 'ar' : 'en')
          break
        case 't':
        case 'T':
          window.scrollTo({ top: 0, behavior: 'smooth' })
          break
        case 'ArrowDown': {
          e.preventDefault()
          const sections = mode === 'expert' ? EXPERT_SECTIONS : CASUAL_SECTIONS
          const current = sections.findIndex(id => {
            const el = document.getElementById(id)
            if (!el) return false
            const rect = el.getBoundingClientRect()
            return rect.top >= -50 && rect.top < window.innerHeight / 2
          })
          const next = sections[Math.min(current + 1, sections.length - 1)]
          document.getElementById(next)?.scrollIntoView({ behavior: 'smooth' })
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          const sections = mode === 'expert' ? EXPERT_SECTIONS : CASUAL_SECTIONS
          const current = sections.findIndex(id => {
            const el = document.getElementById(id)
            if (!el) return false
            const rect = el.getBoundingClientRect()
            return rect.top >= -50 && rect.top < window.innerHeight / 2
          })
          const prev = sections[Math.max(current - 1, 0)]
          document.getElementById(prev)?.scrollIntoView({ behavior: 'smooth' })
          break
        }
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [mode, language, setMode, setLanguage])

  const shortcuts = language === 'ar' ? AR_SHORTCUTS : SHORTCUTS

  return (
    <>
      {/* Hint button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 start-6 z-50 w-8 h-8 rounded-full bg-bg-secondary border border-border flex items-center justify-center text-text-muted hover:text-text-primary hover:border-white/20 transition-all text-xs font-mono font-bold"
        title={language === 'ar' ? 'اختصارات لوحة المفاتيح (?)' : 'Keyboard shortcuts (?)'}
        aria-label="Keyboard shortcuts"
      >
        ?
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed z-[81] top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm"
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
              <div className="bg-bg-secondary border border-border rounded-2xl p-6 shadow-2xl mx-4">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-text-primary text-lg">
                    {language === 'ar' ? 'اختصارات لوحة المفاتيح' : 'Keyboard Shortcuts'}
                  </h3>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-text-muted hover:text-text-primary transition-colors text-xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <ul className="space-y-3">
                  {shortcuts.map((s, i) => (
                    <li key={i} className="flex items-center justify-between gap-4">
                      <span className="text-text-secondary text-sm">{s.description}</span>
                      <kbd className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-bg-primary border border-border text-text-muted font-mono text-xs">
                        {s.key}
                      </kbd>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
