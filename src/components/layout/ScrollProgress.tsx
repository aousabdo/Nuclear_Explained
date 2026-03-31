import { useState, useEffect } from 'react'

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const h = document.documentElement
      const pct = h.scrollTop / (h.scrollHeight - h.clientHeight)
      setProgress(Math.min(1, Math.max(0, pct)) * 100)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-blast via-thermal to-radiation transition-none"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
