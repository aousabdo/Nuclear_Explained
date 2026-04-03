import { Suspense, lazy } from 'react'
import { ErrorBoundary } from '../components/layout/ErrorBoundary'
import { PageTransition } from '../components/layout/PageTransition'
import { ChapterFooterNav } from '../components/layout/ChapterFooterNav'
import { usePageMeta } from '../hooks/usePageMeta'
import { SectionLoader } from '../components/layout/SectionLoader'

const TestTimeline = lazy(() => import('../sections/SC12_TestTimeline/TestTimeline'))
const CountryProfiles = lazy(() => import('../sections/SC13_CountryProfiles/CountryProfiles'))

export default function HistoryPage() {
  usePageMeta('history')

  return (
    <PageTransition>
      <ErrorBoundary sectionId="c-timeline">
        <Suspense fallback={<SectionLoader />}><TestTimeline /></Suspense>
      </ErrorBoundary>
      <ErrorBoundary sectionId="c-countries">
        <Suspense fallback={<SectionLoader />}><CountryProfiles /></Suspense>
      </ErrorBoundary>
      <ChapterFooterNav currentSlug="history" />
    </PageTransition>
  )
}
