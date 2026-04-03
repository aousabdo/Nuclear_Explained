import { Suspense, lazy } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ErrorBoundary } from '../components/layout/ErrorBoundary'
import { PageTransition } from '../components/layout/PageTransition'
import { usePageMeta } from '../hooks/usePageMeta'
import { useAppStore } from '../hooks/useAppStore'
import { CHAPTERS } from '../config/chapters'

const Hero = lazy(() => import('../sections/S01_Hero/Hero'))

function SectionLoader() {
  return (
    <div className="relative w-full py-24 px-4">
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-white/5 rounded-lg" />
        <div className="h-4 w-96 bg-white/3 rounded" />
      </div>
    </div>
  )
}

export default function HomePage() {
  usePageMeta('home')
  const language = useAppStore((s) => s.language)
  const { pathname } = useLocation()
  const isAr = pathname.startsWith('/ar')
  const prefix = isAr ? '/ar' : ''

  return (
    <PageTransition>
      <ErrorBoundary sectionId="hero">
        <Suspense fallback={<SectionLoader />}><Hero variant="casual" /></Suspense>
      </ErrorBoundary>

      {/* Chapter cards grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-text-primary text-center mb-3">
          {language === 'ar' ? 'استكشف' : 'Explore'}
        </h2>
        <p className="text-text-secondary text-center mb-10 max-w-lg mx-auto">
          {language === 'ar'
            ? 'اختر موضوعاً للبدء — كل قسم تجربة تفاعلية مستقلة'
            : 'Choose a topic to begin — each chapter is a standalone interactive experience'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHAPTERS.map((chapter) => (
            <Link
              key={chapter.key}
              to={`${prefix}/${chapter.slug}`}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all p-6 hover:border-white/20"
              style={{ borderLeftColor: chapter.color, borderLeftWidth: 3 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{chapter.icon}</span>
                <h3 className="text-lg font-bold text-text-primary group-hover:text-white transition-colors">
                  {language === 'ar' ? chapter.labelAr : chapter.label}
                </h3>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">
                {language === 'ar' ? chapter.descriptionAr : chapter.description}
              </p>
              <div className="mt-4 text-xs text-text-muted">
                {chapter.sectionIds.length} {language === 'ar' ? 'أقسام' : 'sections'} &rarr;
              </div>
            </Link>
          ))}

          {/* Expert deep dive card */}
          <Link
            to={`${prefix}/expert`}
            className="group rounded-2xl border border-purple-500/20 bg-purple-500/[0.03] hover:bg-purple-500/[0.07] transition-all p-6 hover:border-purple-500/40"
            style={{ borderLeftColor: '#a855f7', borderLeftWidth: 3 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">⚛️</span>
              <h3 className="text-lg font-bold text-text-primary group-hover:text-white transition-colors">
                {language === 'ar' ? 'الغوص المعمّق' : 'Expert Deep Dive'}
              </h3>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              {language === 'ar'
                ? 'الفيزياء الكاملة — حاسبات الانفجار ومحاكاة التساقط وارتفاع الانفجار'
                : 'The complete physics — blast calculators, fallout simulation, height of burst, and scaling laws'}
            </p>
            <div className="mt-4 text-xs text-purple-400/60">
              10 {language === 'ar' ? 'أقسام' : 'sections'} &rarr;
            </div>
          </Link>
        </div>
      </section>
    </PageTransition>
  )
}
