import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { CHAPTERS } from '../../config/chapters'
import { useAppStore } from '../../hooks/useAppStore'

export function PageNav() {
  const language = useAppStore((s) => s.language)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isAr = pathname.startsWith('/ar')
  const prefix = isAr ? '/ar' : ''

  const toggleLanguage = () => {
    if (isAr) {
      // Remove /ar prefix
      const newPath = pathname.replace(/^\/ar/, '') || '/'
      navigate(newPath)
    } else {
      // Add /ar prefix
      navigate(`/ar${pathname === '/' ? '' : pathname}`)
    }
  }

  // Check if current path matches expert
  const isExpert = pathname === '/expert' || pathname === '/ar/expert'

  return (
    <>
      {/* ─── Desktop: top nav bar ────────────────────────────────────────── */}
      <nav className="hidden lg:flex fixed top-0 left-0 right-0 z-50 bg-bg-primary/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto w-full flex items-center h-14 px-6 gap-1">
          {/* Site title */}
          <Link to={`${prefix}/`} className="text-sm font-bold text-text-primary hover:text-white transition-colors me-6 flex-shrink-0">
            ☢️ Nuclear Explained
          </Link>

          {/* Chapter links */}
          <div className="flex items-center gap-1">
            {CHAPTERS.map(ch => (
              <NavLink
                key={ch.key}
                to={`${prefix}/${ch.slug}`}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-sm rounded-full transition-all font-medium flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <span className="text-xs">{ch.icon}</span>
                <span>{language === 'ar' ? ch.labelAr : ch.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="flex-1" />

          {/* Expert link */}
          <NavLink
            to={`${prefix}/expert`}
            className={`px-3 py-1.5 text-sm rounded-full transition-all font-medium flex items-center gap-1.5 ${
              isExpert
                ? 'bg-purple-500/20 text-purple-300'
                : 'text-text-secondary hover:text-purple-300 hover:bg-purple-500/10'
            }`}
          >
            <span className="text-xs">⚛️</span>
            <span>{language === 'ar' ? 'متقدم' : 'Expert'}</span>
          </NavLink>

          {/* Language toggle */}
          <div className="flex items-center gap-0.5 ms-2 border-s border-white/10 ps-3">
            <button
              onClick={() => { if (isAr) toggleLanguage() }}
              className={`px-2 py-1 text-xs font-semibold rounded-full transition-all ${!isAr ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70'}`}
            >EN</button>
            <button
              onClick={() => { if (!isAr) toggleLanguage() }}
              className={`px-2 py-1 text-xs font-semibold rounded-full transition-all ${isAr ? 'bg-white/15 text-white' : 'text-white/40 hover:text-white/70'}`}
            >عر</button>
          </div>
        </div>
      </nav>

      {/* ─── Mobile: top bar ──────────────────────────────────────────────── */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-bg-primary/90 backdrop-blur-sm border-b border-border relative">
        {/* Scrollable chapter links */}
        <div className="overflow-x-auto scrollbar-hide pe-[120px]">
          <div className="flex gap-1 px-3 py-2 items-center">
            <NavLink
              to={`${prefix}/`}
              end
              className={({ isActive }) =>
                `text-xs whitespace-nowrap px-2 py-1 rounded-full transition-all flex-shrink-0 font-semibold ${
                  isActive ? 'bg-white/15 text-white' : 'text-text-secondary'
                }`
              }
            >☢️</NavLink>
            {CHAPTERS.map(ch => (
              <NavLink
                key={ch.key}
                to={`${prefix}/${ch.slug}`}
                className={({ isActive }) =>
                  `flex items-center gap-1 text-xs whitespace-nowrap px-3 py-1 rounded-full transition-all flex-shrink-0 font-semibold ${
                    isActive
                      ? `text-white`
                      : 'text-text-secondary'
                  }`
                }
                style={({ isActive }) => isActive ? { backgroundColor: ch.color + '22', border: `1px solid ${ch.color}55` } : { border: '1px solid transparent' }}
              >
                <span>{ch.icon}</span>
                <span>{language === 'ar' ? ch.labelAr : ch.label}</span>
              </NavLink>
            ))}
            <NavLink
              to={`${prefix}/expert`}
              className={({ isActive }) =>
                `flex items-center gap-1 text-xs whitespace-nowrap px-3 py-1 rounded-full transition-all flex-shrink-0 font-semibold ${
                  isActive ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-text-secondary border border-transparent'
                }`
              }
            >
              <span>⚛️</span>
              <span>{language === 'ar' ? 'متقدم' : 'Expert'}</span>
            </NavLink>
          </div>
        </div>
        {/* Pinned toggle with opaque bg */}
        <div className="absolute right-0 top-0 bottom-0 flex items-center bg-bg-primary/95 backdrop-blur-sm ps-2 pe-1 border-l border-white/10">
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => { if (isAr) toggleLanguage() }}
              aria-label="Switch to English"
              className={`px-2 py-1 text-[11px] font-semibold rounded-full transition-all ${!isAr ? 'bg-white/15 text-white' : 'text-white/40'}`}
            >EN</button>
            <button
              onClick={() => { if (!isAr) toggleLanguage() }}
              aria-label="Switch to Arabic"
              className={`px-2 py-1 text-[11px] font-semibold rounded-full transition-all ${isAr ? 'bg-white/15 text-white' : 'text-white/40'}`}
            >عر</button>
          </div>
        </div>
      </nav>
    </>
  )
}
