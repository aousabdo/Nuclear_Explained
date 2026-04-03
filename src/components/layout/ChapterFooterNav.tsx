import { Link, useLocation } from 'react-router-dom'
import { CHAPTERS } from '../../config/chapters'
import { useAppStore } from '../../hooks/useAppStore'

export function ChapterFooterNav({ currentSlug }: { currentSlug: string }) {
  const language = useAppStore((s) => s.language)
  const { pathname } = useLocation()
  const isAr = pathname.startsWith('/ar')
  const prefix = isAr ? '/ar' : ''

  const idx = CHAPTERS.findIndex(c => c.slug === currentSlug)
  const prev = idx > 0 ? CHAPTERS[idx - 1] : null
  const next = idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1] : null

  return (
    <nav className="max-w-6xl mx-auto px-4 py-12 flex flex-col sm:flex-row items-stretch gap-4">
      {prev ? (
        <Link
          to={`${prefix}/${prev.slug}`}
          className="flex-1 group rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all p-6 flex items-center gap-4"
        >
          <span className="text-2xl opacity-40 group-hover:opacity-70 transition-opacity">&larr;</span>
          <div>
            <div className="text-xs text-text-muted uppercase tracking-wider mb-1">
              {language === 'ar' ? 'السابق' : 'Previous'}
            </div>
            <div className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <span>{prev.icon}</span>
              <span>{language === 'ar' ? prev.labelAr : prev.label}</span>
            </div>
          </div>
        </Link>
      ) : <div className="flex-1" />}

      {next ? (
        <Link
          to={`${prefix}/${next.slug}`}
          className="flex-1 group rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all p-6 flex items-center gap-4 justify-end text-end"
        >
          <div>
            <div className="text-xs text-text-muted uppercase tracking-wider mb-1">
              {language === 'ar' ? 'التالي' : 'Next'}
            </div>
            <div className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <span>{next.icon}</span>
              <span>{language === 'ar' ? next.labelAr : next.label}</span>
            </div>
          </div>
          <span className="text-2xl opacity-40 group-hover:opacity-70 transition-opacity">&rarr;</span>
        </Link>
      ) : (
        <Link
          to={`${prefix}/expert`}
          className="flex-1 group rounded-2xl border border-purple-500/20 bg-purple-500/[0.04] hover:bg-purple-500/[0.08] transition-all p-6 flex items-center gap-4 justify-end text-end"
        >
          <div>
            <div className="text-xs text-purple-400/70 uppercase tracking-wider mb-1">
              {language === 'ar' ? 'الغوص المعمّق' : 'Go Deeper'}
            </div>
            <div className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <span>⚛️</span>
              <span>{language === 'ar' ? 'الوضع المتقدم' : 'Expert Deep Dive'}</span>
            </div>
          </div>
          <span className="text-2xl opacity-40 group-hover:opacity-70 transition-opacity">&rarr;</span>
        </Link>
      )}
    </nav>
  )
}
