import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { useTranslation } from '../../hooks/useTranslation'

const STEP_ICONS = ['☀', '🔴', '💥', '🔥', '☁', '☢']
const STEP_GRADIENTS = [
  'radial-gradient(circle at center, rgba(251,191,36,0.4) 0%, transparent 70%)',
  'radial-gradient(circle at center, rgba(239,68,68,0.4) 0%, transparent 70%)',
  'radial-gradient(circle at center, rgba(59,130,246,0.4) 0%, transparent 70%)',
  'radial-gradient(circle at center, rgba(249,115,22,0.4) 0%, transparent 70%)',
  'radial-gradient(circle at center, rgba(107,114,128,0.4) 0%, transparent 70%)',
  'radial-gradient(circle at center, rgba(34,197,94,0.3) 0%, transparent 70%)',
]

export default function Moment() {
  const [activeStep, setActiveStep] = useState(0)
  const [paused, setPaused] = useState(false)
  const t = useTranslation()
  const steps = t.moment.steps
  const step = steps[activeStep]

  // Auto-advance every 4 seconds unless paused
  useEffect(() => {
    if (paused) return
    const timer = setTimeout(() => {
      setActiveStep(s => (s + 1) % steps.length)
    }, 4000)
    return () => clearTimeout(timer)
  }, [activeStep, paused, steps.length])

  const handleArrow = (next: number) => {
    setPaused(true)
    setActiveStep(next)
  }

  const handleDot = (i: number) => {
    setPaused(true)
    setActiveStep(i)
  }

  return (
    <SectionWrapper id="c-moment">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            {t.moment.title}
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            {t.moment.subtitle}
          </p>
        </div>

        <div
          className="relative rounded-2xl overflow-hidden min-h-[420px] flex flex-col items-center justify-center border border-border"
          style={{ background: '#0a0a0f' }}
        >
          {/* Animated background glow */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep + '-bg'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 pointer-events-none"
              style={{ background: STEP_GRADIENTS[activeStep] }}
            />
          </AnimatePresence>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
              className="relative z-10 text-center px-6 md:px-16 py-10 space-y-5 max-w-2xl"
            >
              <div className="text-sm font-mono font-bold tracking-widest text-text-muted uppercase">
                {step.time}
              </div>
              <div className="text-7xl md:text-8xl select-none" role="img">
                {STEP_ICONS[activeStep]}
              </div>
              <h3 className="text-3xl md:text-4xl font-black tracking-widest text-white">
                {step.label}
              </h3>
              <p className="text-text-secondary text-base md:text-lg leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Arrows */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none">
            <button
              className={`pointer-events-auto w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all ${activeStep === 0 ? 'opacity-20 cursor-default' : ''}`}
              onClick={() => handleArrow(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
            >
              ‹
            </button>
            <button
              className={`pointer-events-auto w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all ${activeStep === steps.length - 1 ? 'opacity-20 cursor-default' : ''}`}
              onClick={() => handleArrow(Math.min(steps.length - 1, activeStep + 1))}
              disabled={activeStep === steps.length - 1}
            >
              ›
            </button>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-2 md:gap-3 overflow-x-auto px-2">
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => handleDot(i)}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div
                className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                  activeStep === i ? 'scale-125' : 'border-white/20 bg-transparent hover:border-white/40'
                }`}
                style={
                  activeStep === i
                    ? { borderColor: '#ef4444', backgroundColor: '#ef4444' }
                    : {}
                }
              />
              <span className={`text-xs hidden sm:block transition-colors ${activeStep === i ? 'text-white' : 'text-white/30 group-hover:text-white/50'}`}>
                {s.time}
              </span>
            </button>
          ))}
        </div>

        {/* Auto-advance toggle */}
        <div className="flex justify-center">
          <button
            onClick={() => setPaused(p => !p)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 text-xs transition-all"
          >
            {paused ? '▶ Auto' : '⏸ Auto'}
          </button>
        </div>
      </div>
    </SectionWrapper>
  )
}
