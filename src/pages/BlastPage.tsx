import { Suspense, lazy } from 'react'
import { ErrorBoundary } from '../components/layout/ErrorBoundary'
import { PageTransition } from '../components/layout/PageTransition'
import { ChapterFooterNav } from '../components/layout/ChapterFooterNav'
import { usePageMeta } from '../hooks/usePageMeta'
import { SectionLoader } from '../components/layout/SectionLoader'

const Moment = lazy(() => import('../sections/SC02_Moment/Moment'))
const Destruction = lazy(() => import('../sections/SC03_Destruction/Destruction'))
const Scale = lazy(() => import('../sections/SC04_Scale/Scale'))
const CasualFallout = lazy(() => import('../sections/SC05_CasualFallout/CasualFallout'))

export default function BlastPage() {
  usePageMeta('blast')

  return (
    <PageTransition>
      <ErrorBoundary sectionId="c-moment">
        <Suspense fallback={<SectionLoader />}><Moment /></Suspense>
      </ErrorBoundary>
      <ErrorBoundary sectionId="c-destruction">
        <Suspense fallback={<SectionLoader />}><Destruction /></Suspense>
      </ErrorBoundary>
      <ErrorBoundary sectionId="c-scale">
        <Suspense fallback={<SectionLoader />}><Scale /></Suspense>
      </ErrorBoundary>
      <ErrorBoundary sectionId="c-fallout">
        <Suspense fallback={<SectionLoader />}><CasualFallout /></Suspense>
      </ErrorBoundary>
      <ChapterFooterNav currentSlug="blast" />
    </PageTransition>
  )
}
