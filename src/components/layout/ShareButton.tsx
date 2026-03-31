import { useState } from 'react'
import { useAppStore } from '../../hooks/useAppStore'

export function ShareButton() {
  const [copied, setCopied] = useState(false)
  const { language } = useAppStore()

  const handleShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({
          title: language === 'ar' ? 'النووي ببساطة' : 'Nuclear Explained',
          text: language === 'ar'
            ? 'تفاعل مع محاكاة الأسلحة النووية — احسب نطاق الانفجار والتساقط الإشعاعي'
            : 'Interactive nuclear weapons physics — blast radius calculator, fallout simulator',
          url,
        })
      } else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      // user cancelled or clipboard failed
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch {
        // silently fail
      }
    }
  }

  return (
    <button
      onClick={handleShare}
      aria-label={language === 'ar' ? 'مشاركة الرابط' : 'Share link'}
      title={language === 'ar' ? 'مشاركة' : 'Share'}
      className="fixed bottom-20 end-6 z-50 w-10 h-10 rounded-full bg-bg-secondary border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-blast/50 transition-all duration-300 shadow-lg"
      style={{ opacity: 1 }}
    >
      {copied ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8l3.5 3.5L13 4" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
        </svg>
      )}

      {/* Toast */}
      {copied && (
        <div
          className="absolute bottom-12 end-0 bg-green-900/90 text-green-300 text-xs px-3 py-1.5 rounded-lg border border-green-700/50 whitespace-nowrap pointer-events-none"
        >
          {language === 'ar' ? '✓ تم نسخ الرابط' : '✓ Link copied!'}
        </div>
      )}
    </button>
  )
}
