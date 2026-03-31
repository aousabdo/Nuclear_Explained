import { Suspense, lazy } from 'react'
import { Navigation } from './components/layout/Navigation'
import { TopoBackground } from './components/layout/TopoBackground'

const Hero = lazy(() => import('./sections/S01_Hero/Hero'))
const Basics = lazy(() => import('./sections/S02_Basics/Basics'))
const Effects = lazy(() => import('./sections/S03_Effects/Effects'))
const HeightOfBurst = lazy(() => import('./sections/S04_HeightOfBurst/HeightOfBurst'))
const BlastRadius = lazy(() => import('./sections/S05_BlastRadius/BlastRadius'))
const TacticalStrategic = lazy(() => import('./sections/S06_TacticalStrategic/TacticalStrategic'))
const Fallout = lazy(() => import('./sections/S07_Fallout/Fallout'))
const IranDeepDive = lazy(() => import('./sections/S08_Iran/IranDeepDive'))
const CubeRoot = lazy(() => import('./sections/S09_CubeRoot/CubeRoot'))
const History = lazy(() => import('./sections/S10_History/History'))

function SectionLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-text-muted text-sm animate-pulse">Loading section...</div>
    </div>
  )
}

function App() {
  return (
    <div className="relative">
      <TopoBackground />
      <Navigation />

      <main className="relative z-10 lg:pt-0 pt-12 lg:pl-12">
        <Suspense fallback={<SectionLoader />}><Hero /></Suspense>
        <Suspense fallback={<SectionLoader />}><Basics /></Suspense>
        <Suspense fallback={<SectionLoader />}><Effects /></Suspense>
        <Suspense fallback={<SectionLoader />}><HeightOfBurst /></Suspense>
        <Suspense fallback={<SectionLoader />}><BlastRadius /></Suspense>
        <Suspense fallback={<SectionLoader />}><TacticalStrategic /></Suspense>
        <Suspense fallback={<SectionLoader />}><Fallout /></Suspense>
        <Suspense fallback={<SectionLoader />}><IranDeepDive /></Suspense>
        <Suspense fallback={<SectionLoader />}><CubeRoot /></Suspense>
        <Suspense fallback={<SectionLoader />}><History /></Suspense>
      </main>

      <footer id="footer" className="relative z-10 border-t border-border py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <h2 className="text-2xl font-bold text-text-primary">Sources & References</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-left">
            <div className="bg-bg-secondary rounded-lg p-4 border border-border space-y-2">
              <h3 className="font-semibold text-text-primary">Primary Sources</h3>
              <ul className="space-y-1 text-text-secondary text-xs">
                <li>Glasstone & Dolan, "The Effects of Nuclear Weapons" (1977) — US DoD</li>
                <li>FAS Nuclear Notebook — Federation of American Scientists</li>
                <li>NUKEMAP by Alex Wellerstein — Nuclear Secrecy Blog</li>
                <li>National Academy of Sciences — Nuclear Weapons Reports</li>
              </ul>
            </div>
            <div className="bg-bg-secondary rounded-lg p-4 border border-border space-y-2">
              <h3 className="font-semibold text-text-primary">Methodology</h3>
              <ul className="space-y-1 text-text-secondary text-xs">
                <li>Blast scaling: r ∝ Y^(1/3) cube-root scaling law</li>
                <li>Thermal: r ∝ Y^(0.41) with atmospheric absorption</li>
                <li>Fallout: Simplified Gaussian plume dispersion model</li>
                <li>All data from publicly available, unclassified sources</li>
              </ul>
            </div>
          </div>
          <p className="text-text-muted text-sm max-w-xl mx-auto">
            This is an educational resource. All data is from publicly available sources.
            These calculations are simplified models — actual weapon effects depend on
            many additional factors including terrain, weather, and weapon design.
          </p>
          <p className="text-text-muted text-xs">
            Built by Aous Abdo | Analytica Data Science Solutions
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
