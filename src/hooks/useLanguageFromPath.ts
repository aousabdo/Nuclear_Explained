import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppStore } from './useAppStore'

export function useLanguageFromPath() {
  const { pathname } = useLocation()
  const setLanguage = useAppStore((s) => s.setLanguage)

  useEffect(() => {
    const isAr = pathname.startsWith('/ar')
    setLanguage(isAr ? 'ar' : 'en')
  }, [pathname, setLanguage])
}
