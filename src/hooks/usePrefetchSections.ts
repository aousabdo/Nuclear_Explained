import { useEffect } from 'react'

/**
 * When a section becomes visible (30% threshold), fire-and-forget import the
 * NEXT section's chunk so it is already in the browser cache when the user
 * scrolls there.
 *
 * Only used in casual mode — expert sections are few enough to load on demand.
 */
const CASUAL_PREFETCH_MAP: Record<string, () => Promise<unknown>> = {
  'c-moment':      () => import('../sections/SC03_Destruction/Destruction'),
  'c-destruction': () => import('../sections/SC04_Scale/Scale'),
  'c-scale':       () => import('../sections/SC05_CasualFallout/CasualFallout'),
  'c-fallout':     () => import('../sections/SC06_Impact/Impact'),
  'c-impact':      () => import('../sections/SC07_NuclearWinter/NuclearWinter'),
  'c-winter':      () => import('../sections/SC08_Survival/Survival'),
  'c-survival':    () => import('../sections/SC09_MissileTrajectory/MissileTrajectory'),
  'c-trajectory':  () => import('../sections/SC10_ArsenalMap/ArsenalMap'),
  'c-arsenal':     () => import('../sections/SC11_NearMiss/NearMiss'),
  'c-nearmiss':    () => import('../sections/SC12_TestTimeline/TestTimeline'),
  'c-timeline':    () => import('../sections/SC13_CountryProfiles/CountryProfiles'),
  'c-countries':   () => import('../sections/SC14_RiskCard/RiskCard'),
  'c-risk':        () => import('../sections/SC15_Quiz/NuclearQuiz'),
}

export function usePrefetchSections() {
  useEffect(() => {
    const prefetched = new Set<string>()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id
            const prefetchFn = CASUAL_PREFETCH_MAP[id]
            if (prefetchFn && !prefetched.has(id)) {
              prefetched.add(id)
              prefetchFn().catch(() => {}) // fire and forget
            }
          }
        })
      },
      { threshold: 0.3 }
    )

    // Observe all section roots we want to trigger prefetch from
    Object.keys(CASUAL_PREFETCH_MAP).forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])
}
