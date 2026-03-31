import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { CitySearch } from '../../components/map/CitySearch'
import { useTranslation } from '../../hooks/useTranslation'
import { useAppStore } from '../../hooks/useAppStore'
import type { City } from '../../data/cities'

const STATS_EN = [
  { value: '13,000+', label: 'nuclear warheads exist today' },
  { value: '50 Mt', label: 'Tsar Bomba — largest ever detonated' },
  { value: '0.3 sec', label: 'time to vaporize everything in the fireball' },
]

const STATS_AR = [
  { value: '13,000+', label: 'رأس حربي نووي موجود اليوم' },
  { value: '50 ميغاطن', label: 'القنبلة القيصرية — الأضخم في التاريخ' },
  { value: '0.3 ثانية', label: 'الوقت اللازم لتبخير كل شيء داخل كرة النار' },
]

export default function Hero() {
  const t = useTranslation()
  const { mode, language, setHeroCity } = useAppStore()
  const [citySelected, setCitySelected] = useState<string | null>(null)
  const isAr = language === 'ar'
  const stats = isAr ? STATS_AR : STATS_EN

  const handleCitySelect = useCallback((city: City) => {
    setHeroCity({ lat: city.lat, lng: city.lng, name: city.name })
    setCitySelected(city.name)

    // Scroll to the right map section after a short delay
    setTimeout(() => {
      const targetId = mode === 'casual' ? 'c-destruction' : 's-blast'
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
    }, 400)
  }, [mode, setHeroCity])

  const casualHeadline = isAr
    ? 'لحظة. تُمحى مدينتك.'
    : 'One moment. Your city is gone.'

  const expertHeadline = isAr
    ? '13,000 رأس حربي. واحد يغيّر كل شيء.'
    : '13,000 warheads. One changes everything.'

  const casualSub = isAr
    ? 'في 0.3 ثانية، لا تحذير، لا صوت، لا مبنى. أدخل مدينتك وشاهد ما يحدث.'
    : 'In 0.3 seconds — no warning, no sound, no buildings. Enter your city and see what happens.'

  const expertSub = isAr
    ? 'استكشف فيزياء الأسلحة النووية — من قوانين التحجيم إلى محاكاة التساقط الإشعاعي.'
    : 'Explore the physics of nuclear weapons — from scaling laws to fallout plumes, blast overpressure, and height of burst.'

  const placeholderText = isAr ? 'أدخل مدينتك...' : 'Enter your city...'
  const ctaText = isAr ? 'أو تمرر للأسفل للاستكشاف ↓' : 'or scroll down to explore ↓'
  const purposeText = isAr
    ? 'هذا الموقع موجود لجعل الأسلحة النووية حقيقة — لا مجرد أرقام'
    : 'This site exists to make nuclear weapons real — not abstract'

  return (
    <SectionWrapper id="hero" className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-10 relative w-full max-w-3xl mx-auto px-4">

        {/* Animated blast rings background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-red-500/10"
              style={{ width: `${i * 160}px`, height: `${i * 160}px` }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.04, 0.15] }}
              transition={{ duration: 5, delay: i * 0.9, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>

        {/* Purpose anchor */}
        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-red-500/70 font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          ☢ {purposeText}
        </motion.p>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            <motion.h1
              key={mode + language}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <span className="text-white">
                {mode === 'casual' ? casualHeadline : expertHeadline}
              </span>
            </motion.h1>
          </AnimatePresence>
        </motion.div>

        {/* Subtitle */}
        <AnimatePresence mode="wait">
          <motion.p
            key={mode + language + 'sub'}
            className="text-lg md:text-xl text-text-secondary max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {mode === 'casual' ? casualSub : expertSub}
          </motion.p>
        </AnimatePresence>

        {/* City input — the hook */}
        <motion.div
          className="max-w-md mx-auto space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <CitySearch large hideLabel
            onSelect={handleCitySelect}
            placeholder={placeholderText}
          />
          <AnimatePresence>
            {citySelected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2 text-sm text-red-400 font-semibold"
              >
                <span className="animate-pulse">●</span>
                {isAr
                  ? `جارٍ تحميل ${citySelected}…`
                  : `Loading ${citySelected}…`}
              </motion.div>
            )}
          </AnimatePresence>
          {!citySelected && (
            <p className="text-xs text-text-muted">{ctaText}</p>
          )}
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-3 gap-4 pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="rounded-xl border border-white/5 bg-white/3 p-4 space-y-1"
              whileHover={{ borderColor: 'rgba(239,68,68,0.3)', backgroundColor: 'rgba(239,68,68,0.04)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-2xl md:text-3xl font-black text-red-400 font-mono">{s.value}</div>
              <div className="text-[11px] text-text-muted leading-snug">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-text-muted pt-4"
          >
            <span className="text-xs uppercase tracking-widest">{t.hero.scroll}</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
