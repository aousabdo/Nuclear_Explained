// A <Cite> component that wraps a stat number/text and shows a tooltip on hover
// with the source citation
//
// Usage: <Cite source="Glasstone & Dolan, 1977, p.12">15 kt</Cite>
//
// Visual: underline-dotted on the wrapped content
// Hover: small tooltip card appears above with "📚 Source: [source text]"
// The tooltip fades in with framer-motion
// On mobile (touch): toggles on tap

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CiteProps {
  children: React.ReactNode
  source: string
  sourceAr?: string
  lang?: 'en' | 'ar'
}

export function Cite({ children, source, sourceAr, lang = 'en' }: CiteProps) {
  const [open, setOpen] = useState(false)
  const label = lang === 'ar' && sourceAr ? sourceAr : source

  return (
    <span
      className="relative inline-block border-b border-dotted border-text-muted/50 cursor-help"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen(v => !v)}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none"
          >
            <span className="block bg-bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-text-secondary whitespace-nowrap shadow-xl max-w-xs">
              <span className="text-text-muted">📚 </span>{label}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
