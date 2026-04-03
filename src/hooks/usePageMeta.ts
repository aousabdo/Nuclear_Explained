import { useEffect } from 'react'
import { useAppStore } from './useAppStore'
import { ROUTE_META } from '../config/routeMeta'

export function usePageMeta(routeKey: string) {
  const language = useAppStore((s) => s.language)

  useEffect(() => {
    const meta = ROUTE_META[routeKey]
    if (!meta) return

    document.title = language === 'ar' ? meta.titleAr : meta.titleEn

    const desc = document.querySelector('meta[name="description"]')
    if (desc) {
      desc.setAttribute('content', language === 'ar' ? meta.descriptionAr : meta.descriptionEn)
    }
  }, [routeKey, language])
}
