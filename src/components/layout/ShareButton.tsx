import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '../../hooks/useAppStore'

export function ShareButton() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const { language } = useAppStore()
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const url = typeof window !== 'undefined' ? window.location.href : ''
  const tweetText = language === 'ar'
    ? 'النووي ببساطة — محاكي تفاعلي للأسلحة النووية. احسب نطاق الانفجار والتساقط الإشعاعي.'
    : 'Nuclear Explained — interactive blast radius calculator, fallout simulator & nuclear physics explainer.'
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(url)}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => { setCopied(false); setOpen(false) }, 2000)
    } catch { /* silently fail */ }
  }

  const handleTwitter = () => {
    window.open(twitterUrl, '_blank', 'noopener,noreferrer')
    setOpen(false)
  }

  return (
    <div ref={menuRef} className="fixed bottom-20 end-6 z-50">
      {/* Share menu */}
      {open && (
        <div className="absolute bottom-12 end-0 bg-bg-secondary border border-border rounded-xl shadow-2xl overflow-hidden w-44">
          <button
            onClick={handleTwitter}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            {language === 'ar' ? 'مشاركة عبر X' : 'Share on X'}
          </button>
          <div className="border-t border-border" />
          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
          >
            {copied ? (
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3.5 3.5L13 4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
            )}
            {copied
              ? (language === 'ar' ? '✓ تم النسخ' : '✓ Copied!')
              : (language === 'ar' ? 'نسخ الرابط' : 'Copy link')
            }
          </button>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={language === 'ar' ? 'مشاركة' : 'Share'}
        className="w-10 h-10 rounded-full bg-bg-secondary border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-blast/50 transition-all duration-300 shadow-lg"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      </button>
    </div>
  )
}
