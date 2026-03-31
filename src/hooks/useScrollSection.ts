import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useAppStore } from './useAppStore'

export function useScrollSection(sectionId: string) {
  const setActiveSection = useAppStore((s) => s.setActiveSection)

  const { ref, inView } = useInView({
    threshold: 0.3,
    rootMargin: '-10% 0px -10% 0px',
  })

  useEffect(() => {
    if (inView) {
      setActiveSection(sectionId)
    }
  }, [inView, sectionId, setActiveSection])

  return { ref, inView }
}
