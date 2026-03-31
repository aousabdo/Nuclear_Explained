import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionWrapper } from '../../components/layout/SectionWrapper'

interface Step {
  time: string
  title: string
  icon: string
  body: string
  gradient: string
}

const STEPS: Step[] = [
  {
    time: 't = 0',
    title: 'THE FLASH',
    icon: '☀',
    body: 'A blinding light 10,000× brighter than the sun. No warning. No sound. Visible from 50+ miles away. Instant blindness up to 13 miles.',
    gradient: 'radial-gradient(circle at center, rgba(251,191,36,0.4) 0%, transparent 70%)',
  },
  {
    time: 't = 0.001s',
    title: 'THE FIREBALL',
    icon: '🔴',
    body: 'A ball of plasma millions of degrees hot expands outward faster than the eye can follow. Hotter than the sun\'s surface. Everything within its radius is instantly vaporized.',
    gradient: 'radial-gradient(circle at center, rgba(239,68,68,0.4) 0%, transparent 70%)',
  },
  {
    time: 't = 1–30s',
    title: 'THE BLAST WAVE',
    icon: '💥',
    body: 'A wall of compressed air — moving at 1,000+ mph — radiates outward. Buildings collapse. Cars fly. The overpressure can rupture lungs miles away.',
    gradient: 'radial-gradient(circle at center, rgba(59,130,246,0.4) 0%, transparent 70%)',
  },
  {
    time: 't = 1–15 min',
    title: 'THE FIRES',
    icon: '🔥',
    body: 'Thermal radiation traveling at the speed of light ignites every combustible surface for miles. Individual fires merge into a single massive firestorm that consumes all available oxygen.',
    gradient: 'radial-gradient(circle at center, rgba(249,115,22,0.4) 0%, transparent 70%)',
  },
  {
    time: 't = 10 min+',
    title: 'THE CLOUD',
    icon: '☁',
    body: 'A distinctive mushroom cloud rises 40,000–60,000 feet into the stratosphere, carrying millions of tons of vaporized city and radioactive debris. Visible from hundreds of miles.',
    gradient: 'radial-gradient(circle at center, rgba(107,114,128,0.4) 0%, transparent 70%)',
  },
  {
    time: 'Hours–Days',
    title: 'THE FALLOUT',
    icon: '☢',
    body: 'Radioactive particles drift downwind for hundreds of miles. "Black rain" falls in the hours after. A lethal invisible danger that can last for years. There is no antidote.',
    gradient: 'radial-gradient(circle at center, rgba(34,197,94,0.3) 0%, transparent 70%)',
  },
]

export default function Moment() {
  const [activeStep, setActiveStep] = useState(0)
  const step = STEPS[activeStep]

  return (
    <SectionWrapper id="c-moment">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            The First 60 Seconds
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            What happens in the moments after a nuclear detonation.
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
              style={{ background: step.gradient }}
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
                {step.icon}
              </div>
              <h3 className="text-3xl md:text-4xl font-black tracking-widest text-white">
                {step.title}
              </h3>
              <p className="text-text-secondary text-base md:text-lg leading-relaxed">
                {step.body}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Arrows */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none">
            <button
              className={`pointer-events-auto w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all ${activeStep === 0 ? 'opacity-20 cursor-default' : ''}`}
              onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
              disabled={activeStep === 0}
            >
              ‹
            </button>
            <button
              className={`pointer-events-auto w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all ${activeStep === STEPS.length - 1 ? 'opacity-20 cursor-default' : ''}`}
              onClick={() => setActiveStep((s) => Math.min(STEPS.length - 1, s + 1))}
              disabled={activeStep === STEPS.length - 1}
            >
              ›
            </button>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex justify-center gap-3">
          {STEPS.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
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
      </div>
    </SectionWrapper>
  )
}
