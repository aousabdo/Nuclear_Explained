import { Suspense, lazy } from 'react'
import { ErrorBoundary } from '../components/layout/ErrorBoundary'
import { PageTransition } from '../components/layout/PageTransition'
import { ChapterFooterNav } from '../components/layout/ChapterFooterNav'
import { usePageMeta } from '../hooks/usePageMeta'
import { SectionLoader } from '../components/layout/SectionLoader'

const RiskCard = lazy(() => import('../sections/SC14_RiskCard/RiskCard'))
const NuclearQuiz = lazy(() => import('../sections/SC15_Quiz/NuclearQuiz'))

export default function YourRiskPage() {
  usePageMeta('your-risk')

  return (
    <PageTransition>
      <ErrorBoundary sectionId="c-risk">
        <Suspense fallback={<SectionLoader />}><RiskCard /></Suspense>
      </ErrorBoundary>
      <ErrorBoundary sectionId="c-quiz">
        <Suspense fallback={<SectionLoader />}><NuclearQuiz /></Suspense>
      </ErrorBoundary>
      <ChapterFooterNav currentSlug="your-risk" />
    </PageTransition>
  )
}
