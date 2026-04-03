import { Suspense, lazy } from 'react'
import { ErrorBoundary } from '../components/layout/ErrorBoundary'
import { PageTransition } from '../components/layout/PageTransition'
import { ChapterFooterNav } from '../components/layout/ChapterFooterNav'
import { usePageMeta } from '../hooks/usePageMeta'
import { SectionLoader } from '../components/layout/SectionLoader'

const MissileTrajectory = lazy(() => import('../sections/SC09_MissileTrajectory/MissileTrajectory'))
const ArsenalMap = lazy(() => import('../sections/SC10_ArsenalMap/ArsenalMap'))
const NearMiss = lazy(() => import('../sections/SC11_NearMiss/NearMiss'))

export default function ThreatPage() {
  usePageMeta('threat')

  return (
    <PageTransition>
      <ErrorBoundary sectionId="c-trajectory">
        <Suspense fallback={<SectionLoader />}><MissileTrajectory /></Suspense>
      </ErrorBoundary>
      <ErrorBoundary sectionId="c-arsenal">
        <Suspense fallback={<SectionLoader />}><ArsenalMap /></Suspense>
      </ErrorBoundary>
      <ErrorBoundary sectionId="c-nearmiss">
        <Suspense fallback={<SectionLoader />}><NearMiss /></Suspense>
      </ErrorBoundary>
      <ChapterFooterNav currentSlug="threat" />
    </PageTransition>
  )
}
