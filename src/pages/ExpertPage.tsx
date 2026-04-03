import { Suspense, lazy } from 'react'
import { ErrorBoundary } from '../components/layout/ErrorBoundary'
import { PageTransition } from '../components/layout/PageTransition'
import { usePageMeta } from '../hooks/usePageMeta'
import { SectionLoader } from '../components/layout/SectionLoader'

const Hero = lazy(() => import('../sections/S01_Hero/Hero'))
const Basics = lazy(() => import('../sections/S02_Basics/Basics'))
const Effects = lazy(() => import('../sections/S03_Effects/Effects'))
const HeightOfBurst = lazy(() => import('../sections/S04_HeightOfBurst/HeightOfBurst'))
const BlastRadius = lazy(() => import('../sections/S05_BlastRadius/BlastRadius'))
const TacticalStrategic = lazy(() => import('../sections/S06_TacticalStrategic/TacticalStrategic'))
const Fallout = lazy(() => import('../sections/S07_Fallout/Fallout'))
const IranDeepDive = lazy(() => import('../sections/S08_Iran/IranDeepDive'))
const CubeRoot = lazy(() => import('../sections/S09_CubeRoot/CubeRoot'))
const History = lazy(() => import('../sections/S10_History/History'))
const EMPCalculator = lazy(() => import('../sections/SC16_EMP/EMPCalculator'))

export default function ExpertPage() {
  usePageMeta('expert')

  return (
    <PageTransition>
      <ErrorBoundary sectionId="hero">
        <Suspense fallback={<SectionLoader />}><Hero variant="expert" /></Suspense>
      </ErrorBoundary>
      <ErrorBoundary sectionId="basics">
        <Suspense fallback={<SectionLoader />}><Basics /></Suspense>
      </ErrorBoundary>
      <ErrorBoundary sectionId="effects">
        <Suspense fallback={<SectionLoader />}><Effects /></Suspense>
      </ErrorBoundary>
      <ErrorBoundary sectionId="height-of-burst">
        <Suspense fallback={<SectionLoader />}><HeightOfBurst /></Suspense>
      </ErrorBoundary>
      <ErrorBoundary sectionId="blast-radius">
        <Suspense fallback={<SectionLoader />}><BlastRadius /></Suspense>
      </ErrorBoundary>
      <ErrorBoundary sectionId="tactical-strategic">
        <Suspense fallback={<SectionLoader />}><TacticalStrategic /></Suspense>
      </ErrorBoundary>
      <ErrorBoundary sectionId="fallout">
        <Suspense fallback={<SectionLoader />}><Fallout /></Suspense>
      </ErrorBoundary>
      <ErrorBoundary sectionId="iran">
        <Suspense fallback={<SectionLoader />}><IranDeepDive /></Suspense>
      </ErrorBoundary>
      <ErrorBoundary sectionId="cube-root">
        <Suspense fallback={<SectionLoader />}><CubeRoot /></Suspense>
      </ErrorBoundary>
      <ErrorBoundary sectionId="history">
        <Suspense fallback={<SectionLoader />}><History /></Suspense>
      </ErrorBoundary>
      <ErrorBoundary sectionId="emp">
        <Suspense fallback={<SectionLoader />}><EMPCalculator /></Suspense>
      </ErrorBoundary>
    </PageTransition>
  )
}
