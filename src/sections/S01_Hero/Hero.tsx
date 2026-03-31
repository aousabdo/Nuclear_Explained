import { motion, AnimatePresence } from 'framer-motion'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { useTranslation } from '../../hooks/useTranslation'
import { useAppStore } from '../../hooks/useAppStore'

export default function Hero() {
  const t = useTranslation()
  const mode = useAppStore(s => s.mode)
  const subtitle = mode === 'casual' ? t.hero.casualSubtitle : t.hero.expertSubtitle

  return (
    <SectionWrapper id="hero" className="flex items-center justify-center">
      <div className="text-center space-y-8 relative">
        {/* Animated concentric rings background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
          {[1, 2, 3, 4, 5].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-thermal/10"
              style={{
                width: `${i * 150}px`,
                height: `${i * 150}px`,
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.05, 0.1],
              }}
              transition={{
                duration: 4,
                delay: i * 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-thermal to-fallout bg-clip-text text-transparent">
              {t.hero.title}
            </span>
          </h1>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.p
            key={mode}
            className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {subtitle}
          </motion.p>
        </AnimatePresence>

        <motion.p
          className="text-sm text-text-muted max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          {t.hero.description}
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          className="pt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-text-muted"
          >
            <span className="text-xs uppercase tracking-widest">{t.hero.scroll}</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
