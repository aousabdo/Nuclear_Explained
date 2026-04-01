import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../../hooks/useAppStore'

// Bulletin of Atomic Scientists — current setting as of Jan 2023
const MINUTES_TO_MIDNIGHT = 1.5  // 90 seconds = 1.5 minutes
void MINUTES_TO_MIDNIGHT

export function DoomsdayClock() {
  const { language } = useAppStore()
  const isAr = language === 'ar'
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed bottom-6 start-6 z-40"
    >
      <motion.div
        layout
        className="bg-bg-secondary/95 backdrop-blur-sm border border-red-900/40 rounded-2xl shadow-2xl overflow-hidden cursor-pointer"
        onClick={() => setExpanded(e => !e)}
        whileHover={{ borderColor: 'rgba(239,68,68,0.5)' }}
      >
        {/* Compact view */}
        <div className="flex items-center gap-3 px-3 py-2.5">
          {/* Analog clock face */}
          <div className="relative w-8 h-8 flex-shrink-0">
            <svg viewBox="0 0 32 32" className="w-full h-full">
              {/* Clock face */}
              <circle cx="16" cy="16" r="14" fill="#0a0e1a" stroke="#991b1b" strokeWidth="1.5"/>
              {/* 12 o'clock marker */}
              <line x1="16" y1="3" x2="16" y2="7" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
              {/* Minute hand — pointing just before midnight (90 sec = 1.5 min) */}
              <motion.line
                x1="16" y1="16" x2="16" y2="5"
                stroke="#ef4444" strokeWidth="2" strokeLinecap="round"
                style={{ transformOrigin: '16px 16px' }}
                animate={{ rotate: [0, -9, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Hour hand */}
              <line
                x1="16" y1="16" x2="16" y2="8"
                stroke="white" strokeWidth="1.5" strokeLinecap="round"
                style={{ transformOrigin: '16px 16px', transform: 'rotate(-3deg)' }}
              />
              {/* Center dot */}
              <circle cx="16" cy="16" r="2" fill="#ef4444"/>
            </svg>
          </div>

          <div>
            <div className="text-red-400 font-black text-sm leading-none">
              {isAr ? '٩٠ ثانية' : '90 sec'}
            </div>
            <div className="text-text-muted text-[10px] leading-tight">
              {isAr ? 'لمنتصف الليل' : 'to midnight'}
            </div>
          </div>

          <motion.span
            className="text-text-muted text-xs ms-1"
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >▾</motion.span>
        </div>

        {/* Expanded panel */}
        <AnimatedExpand show={expanded}>
          <div className="px-4 pb-4 space-y-3 border-t border-red-900/30 pt-3">
            <p className="text-xs text-text-secondary leading-relaxed max-w-[220px]">
              {isAr
                ? 'ساعة القيامة هي رمز يمثّل مدى قرب البشرية من الفناء الذاتي. أقرب نقطة: 90 ثانية — الآن.'
                : 'The Doomsday Clock symbolizes how close humanity is to self-annihilation. Closest ever: 90 seconds — right now.'
              }
            </p>
            <div className="space-y-1.5 text-xs">
              {[
                { year: '2023–now', time: isAr ? '90 ثانية' : '90 sec', color: '#ef4444' },
                { year: '1991',     time: isAr ? '17 دقيقة' : '17 min',  color: '#22c55e' },
                { year: '1953',     time: isAr ? '2 دقيقة' : '2 min',    color: '#f97316' },
              ].map(r => (
                <div key={r.year} className="flex justify-between items-center">
                  <span className="text-text-muted">{r.year}</span>
                  <span className="font-mono font-bold" style={{ color: r.color }}>{r.time}</span>
                </div>
              ))}
            </div>
            <a
              href="https://thebulletin.org/doomsday-clock/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[10px] text-red-400/60 hover:text-red-400 transition-colors"
              onClick={e => e.stopPropagation()}
            >
              {isAr ? '← Bulletin of Atomic Scientists' : 'Bulletin of Atomic Scientists →'}
            </a>
          </div>
        </AnimatedExpand>
      </motion.div>
    </motion.div>
  )
}

function AnimatedExpand({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      initial={false}
      animate={{ height: show ? 'auto' : 0, opacity: show ? 1 : 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      style={{ overflow: 'hidden' }}
    >
      {children}
    </motion.div>
  )
}
