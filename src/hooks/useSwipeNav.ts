import { useEffect, useRef } from 'react'
import { useAppStore } from './useAppStore'
import { CASUAL_SECTIONS } from '../config/casualSections'
import { SECTIONS } from '../config/sections'

const THRESHOLD = 60 // px vertical swipe threshold

/**
 * Detects vertical swipe gestures on touch devices and scrolls to the
 * next or previous section accordingly.
 *
 * Swipe-up  → next section
 * Swipe-down → previous section
 */
export function useSwipeNav() {
  const touchStartY = useRef<number | null>(null)
  const activeSection = useAppStore((s) => s.activeSection)
  const mode = useAppStore((s) => s.mode)

  // Keep a ref so the event handlers always see fresh values without re-registering
  const stateRef = useRef({ activeSection, mode })
  useEffect(() => {
    stateRef.current = { activeSection, mode }
  }, [activeSection, mode])

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null) return
      const deltaY = touchStartY.current - e.changedTouches[0].clientY
      touchStartY.current = null

      if (Math.abs(deltaY) < THRESHOLD) return

      const { activeSection: current, mode } = stateRef.current
      const sections = mode === 'casual' ? CASUAL_SECTIONS : SECTIONS
      const ids = sections.map(s => s.id)
      const idx = ids.indexOf(current)

      if (deltaY > 0) {
        // Swipe up → next section
        const nextId = idx < ids.length - 1 ? ids[idx + 1] : null
        if (nextId) {
          document.getElementById(nextId)?.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        // Swipe down → previous section
        const prevId = idx > 0 ? ids[idx - 1] : null
        if (prevId) {
          document.getElementById(prevId)?.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, []) // registers once; stateRef keeps values fresh
}
