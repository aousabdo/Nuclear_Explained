import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { PageNav } from './PageNav'
import { SiteFooter } from './SiteFooter'
import { ScrollProgress } from './ScrollProgress'
import { BackToTop } from './BackToTop'
import { TopoBackground } from './TopoBackground'
import { ShareButton } from './ShareButton'
import { KeyboardShortcuts } from './KeyboardShortcuts'
import { DoomsdayClock } from './DoomsdayClock'
import { useLanguageFromPath } from '../../hooks/useLanguageFromPath'
import { useHashRedirect } from '../../hooks/useHashRedirect'
import { useGeigerToggle } from '../../hooks/useGeiger'

export function RootLayout() {
  useLanguageFromPath()
  useHashRedirect()
  const { enabled: geigerEnabled, toggle: toggleGeiger } = useGeigerToggle(1.2)
  const location = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="relative overflow-x-hidden">
      <ScrollProgress />
      <TopoBackground />
      <PageNav />
      <BackToTop />
      <ShareButton />
      <KeyboardShortcuts />
      <DoomsdayClock />

      {/* Geiger counter toggle */}
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

      <main className="relative z-10 pt-14">
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>

      <SiteFooter />
    </div>
  )
}
