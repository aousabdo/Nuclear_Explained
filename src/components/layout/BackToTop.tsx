import { useState, useEffect } from 'react'
import { useAppStore } from '../../hooks/useAppStore'

export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const language = useAppStore(s => s.language)

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-white/70 hover:text-white hover:bg-black/80 transition-all flex items-center justify-center shadow-lg"
      title={language === 'ar' ? 'العودة للأعلى' : 'Back to top'}
      aria-label={language === 'ar' ? 'العودة للأعلى' : 'Back to top'}
    >
      ↑
    </button>
  )
}
