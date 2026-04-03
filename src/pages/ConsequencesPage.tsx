import { Suspense, lazy } from 'react'
import { ErrorBoundary } from '../components/layout/ErrorBoundary'
import { PageTransition } from '../components/layout/PageTransition'
import { ChapterFooterNav } from '../components/layout/ChapterFooterNav'
import { usePageMeta } from '../hooks/usePageMeta'
import { SectionLoader } from '../components/layout/SectionLoader'

const Impact = lazy(() => import('../sections/SC06_Impact/Impact'))
const NuclearWinter = lazy(() => import('../sections/SC07_NuclearWinter/NuclearWinter'))
const Survival = lazy(() => import('../sections/SC08_Survival/Survival'))

export default function ConsequencesPage() {
  usePageMeta('consequences')

  return (
    <PageTransition>
      <ErrorBoundary sectionId="c-impact">
        <Suspense fallback={<SectionLoader />}><Impact /></Suspense>
      </ErrorBoundary>
      <ErrorBoundary sectionId="c-winter">
        <Suspense fallback={<SectionLoader />}><NuclearWinter /></Suspense>
      </ErrorBoundary>
      <ErrorBoundary sectionId="c-survival">
        <Suspense fallback={<SectionLoader />}><Survival /></Suspense>
      </ErrorBoundary>
      <ChapterFooterNav currentSlug="consequences" />
    </PageTransition>
  )
}
