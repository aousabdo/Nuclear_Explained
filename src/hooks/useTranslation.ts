import { useAppStore } from './useAppStore'
import { translations } from '../i18n/translations'

export function useTranslation() {
  const language = useAppStore((s) => s.language)
  return translations[language]
}
