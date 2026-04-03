import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function useHashRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (!hash) return

    const map: Record<string, string> = {
      'casual-en': '/blast',
      'casual-ar': '/ar/blast',
      'expert-en': '/expert',
      'expert-ar': '/ar/expert',
    }

    const target = map[hash]
    if (target) {
      navigate(target, { replace: true })
    }
  }, [navigate])
}
