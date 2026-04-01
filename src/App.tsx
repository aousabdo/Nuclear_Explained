import { Suspense, lazy, useEffect } from 'react'
import { Navigation } from './components/layout/Navigation'
import { UnifiedToggle } from './components/layout/UnifiedToggle'
import { ScrollProgress } from './components/layout/ScrollProgress'
import { BackToTop } from './components/layout/BackToTop'
import { TopoBackground } from './components/layout/TopoBackground'
import { ShareButton } from './components/layout/ShareButton'
import { KeyboardShortcuts } from './components/layout/KeyboardShortcuts'
import { DoomsdayClock } from './components/layout/DoomsdayClock'
import { useAppStore } from './hooks/useAppStore'
import { useGeigerToggle } from './hooks/useGeiger'

// Expert mode sections
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

// Casual mode sections
const Moment = lazy(() => import('./sections/SC02_Moment/Moment'))
const Destruction = lazy(() => import('./sections/SC03_Destruction/Destruction'))
const Scale = lazy(() => import('./sections/SC04_Scale/Scale'))
const CasualFallout = lazy(() => import('./sections/SC05_CasualFallout/CasualFallout'))
const Impact = lazy(() => import('./sections/SC06_Impact/Impact'))
const NuclearWinter = lazy(() => import('./sections/SC07_NuclearWinter/NuclearWinter'))
const Survival = lazy(() => import('./sections/SC08_Survival/Survival'))

function SectionLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-text-muted text-sm animate-pulse">Loading section...</div>
    </div>
  )
}

function App() {
  const { mode, setMode, language, setLanguage } = useAppStore()
  const { enabled: geigerEnabled, toggle: toggleGeiger } = useGeigerToggle(1.2)

  // Read hash on mount
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash) {
      const parts = hash.split('-')
      const hashMode = parts[0]
      const hashLang = parts[1]
      if (hashMode === 'casual' || hashMode === 'expert') {
        setMode(hashMode)
      }
      if (hashLang === 'en' || hashLang === 'ar') {
        setLanguage(hashLang)
        document.documentElement.dir = hashLang === 'ar' ? 'rtl' : 'ltr'
        document.documentElement.lang = hashLang
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Write hash on mode/language change
  useEffect(() => {
    window.location.hash = `${mode}-${language}`
  }, [mode, language])

  // Dynamic title + meta description on language change
  useEffect(() => {
    document.title = language === 'ar'
      ? 'النووي ببساطة — دليل تفاعلي للأسلحة النووية'
      : 'Nuclear Explained — Interactive Nuclear Weapons Physics'

    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', language === 'ar'
      ? 'محاكي تفاعلي للأسلحة النووية — احسب نطاق الانفجار والإشعاع والتساقط بناءً على قوانين جلاستون ودولان الفيزيائية'
      : 'Interactive nuclear weapons physics simulator. Explore blast radii, fallout plumes, height of burst, and scaling laws based on Glasstone & Dolan.'
    )
  }, [language])

  return (
    <div className="relative overflow-x-hidden">
      <ScrollProgress />
      <TopoBackground />
      <Navigation />
      <UnifiedToggle />
      <BackToTop />
      <ShareButton />
      <KeyboardShortcuts />
      <DoomsdayClock />

      {/* Geiger counter toggle — floating bottom-right */}
      <button
        onClick={toggleGeiger}
        title={geigerEnabled ? 'Mute Geiger counter' : 'Enable Geiger counter sound'}
        className="fixed bottom-6 end-6 z-40 rounded-full w-11 h-11 flex items-center justify-center border transition-all shadow-lg"
        style={{
          backgroundColor: geigerEnabled ? 'rgba(239,68,68,0.15)' : 'rgba(10,14,26,0.85)',
          borderColor: geigerEnabled ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <span className="text-lg" style={{ filter: geigerEnabled ? 'none' : 'grayscale(1) opacity(0.5)' }}>
          ☢️
        </span>
      </button>

      <main className="relative z-10 lg:pt-0 pt-12 lg:pl-12">
        {/* Hero is shared in both modes */}
        <Suspense fallback={<SectionLoader />}><Hero /></Suspense>

        {mode === 'casual' ? (
          <>
            <Suspense fallback={<SectionLoader />}><Moment /></Suspense>
            <Suspense fallback={<SectionLoader />}><Destruction /></Suspense>
            <Suspense fallback={<SectionLoader />}><Scale /></Suspense>
            <Suspense fallback={<SectionLoader />}><CasualFallout /></Suspense>
            <Suspense fallback={<SectionLoader />}><Impact /></Suspense>
            <Suspense fallback={<SectionLoader />}><NuclearWinter /></Suspense>
            <Suspense fallback={<SectionLoader />}><Survival /></Suspense>
          </>
        ) : (
          <>
            <Suspense fallback={<SectionLoader />}><Basics /></Suspense>
            <Suspense fallback={<SectionLoader />}><Effects /></Suspense>
            <Suspense fallback={<SectionLoader />}><HeightOfBurst /></Suspense>
            <Suspense fallback={<SectionLoader />}><BlastRadius /></Suspense>
            <Suspense fallback={<SectionLoader />}><TacticalStrategic /></Suspense>
            <Suspense fallback={<SectionLoader />}><Fallout /></Suspense>
            <Suspense fallback={<SectionLoader />}><IranDeepDive /></Suspense>
            <Suspense fallback={<SectionLoader />}><CubeRoot /></Suspense>
            <Suspense fallback={<SectionLoader />}><History /></Suspense>
          </>
        )}
      </main>

      <footer id="footer" className="relative z-10 border-t border-border py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-6 text-center" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <h2 className="text-2xl font-bold text-text-primary">
            {language === 'ar' ? 'المصادر والمراجع' : 'Sources & References'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-start">
            <div className="bg-bg-secondary rounded-lg p-4 border border-border space-y-2">
              <h3 className="font-semibold text-text-primary">
                {language === 'ar' ? 'المصادر الرئيسية' : 'Primary Sources'}
              </h3>
              <ul className="space-y-1 text-text-secondary text-xs">
                {language === 'ar' ? <>
                  <li>غلاستون ودولان، "تأثيرات الأسلحة النووية" (1977) — وزارة الدفاع الأمريكية</li>
                  <li>الكتاب النووي لـ FAS — اتحاد علماء أمريكا</li>
                  <li>NUKEMAP بقلم أليكس ويلرشتاين — مدونة Nuclear Secrecy</li>
                  <li>الأكاديمية الوطنية للعلوم — تقارير الأسلحة النووية</li>
                </> : <>
                  <li>Glasstone & Dolan, "The Effects of Nuclear Weapons" (1977) — US DoD</li>
                  <li>FAS Nuclear Notebook — Federation of American Scientists</li>
                  <li>NUKEMAP by Alex Wellerstein — Nuclear Secrecy Blog</li>
                  <li>National Academy of Sciences — Nuclear Weapons Reports</li>
                </>}
              </ul>
            </div>
            <div className="bg-bg-secondary rounded-lg p-4 border border-border space-y-2">
              <h3 className="font-semibold text-text-primary">
                {language === 'ar' ? 'المنهجية العلمية' : 'Methodology'}
              </h3>
              <ul className="space-y-1 text-text-secondary text-xs">
                {language === 'ar' ? <>
                  <li>قياس الانفجار: r ∝ Y^(1/3) — قانون الجذر التكعيبي</li>
                  <li>الحرارة: r ∝ Y^(0.41) مع الامتصاص الجوي</li>
                  <li>التساقط: نموذج انتشار غاوسي مبسّط</li>
                  <li>جميع البيانات من مصادر غير سرية ومتاحة للعموم</li>
                </> : <>
                  <li>Blast scaling: r ∝ Y^(1/3) cube-root scaling law</li>
                  <li>Thermal: r ∝ Y^(0.41) with atmospheric absorption</li>
                  <li>Fallout: Simplified Gaussian plume dispersion model</li>
                  <li>All data from publicly available, unclassified sources</li>
                </>}
              </ul>
            </div>
          </div>
          <p className="text-text-muted text-sm max-w-xl mx-auto">
            {language === 'ar'
              ? 'هذا مورد تعليمي. جميع البيانات من مصادر متاحة للعموم. هذه الحسابات نماذج مبسّطة — تعتمد التأثيرات الفعلية على عوامل عديدة منها التضاريس والطقس وتصميم السلاح.'
              : 'This is an educational resource. All data is from publicly available sources. These calculations are simplified models — actual weapon effects depend on many additional factors including terrain, weather, and weapon design.'
            }
          </p>
          <div className="space-y-2">
            <p className="text-text-muted text-xs">
              {language === 'ar' ? 'بناء بواسطة' : 'Built by'}{' '}
              <span className="text-text-secondary font-semibold">Dr. Aous Abdo</span>
              {' '}·{' '}
              <a
                href="https://analyticadss.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-blast transition-colors underline underline-offset-2"
              >
                Analytica Data Science Solutions
              </a>
            </p>
            <p className="text-text-muted text-xs">
              {language === 'ar'
                ? 'دكتوراه في الفيزياء · ماجستير في الفيزياء النووية · عالم سابق، مختبر لوس ألاموس الوطني · ناسا · وزارة الدفاع الأمريكية'
                : 'Ph.D. Physics · M.S. Nuclear Physics · Former Scientist, Los Alamos National Laboratory · NASA · U.S. DoD'
              }
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
