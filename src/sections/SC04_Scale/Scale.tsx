import { motion } from 'framer-motion'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { fireballRadius } from '../../lib/physics/fireball'
import { useTranslation } from '../../hooks/useTranslation'

interface Weapon {
  name: string
  subtitle: string
  yieldKt: number
  color: string
  glowColor: string
}

const WEAPONS: Weapon[] = [
  { name: 'Little Boy', subtitle: 'Hiroshima, 1945 — 15 kt', yieldKt: 15, color: '#f59e0b', glowColor: 'rgba(245,158,11,0.4)' },
  { name: 'Modern Warhead', subtitle: 'Standard SLBM — 100 kt', yieldKt: 100, color: '#3b82f6', glowColor: 'rgba(59,130,246,0.4)' },
  { name: 'W88 Warhead', subtitle: 'Most powerful US warhead — 475 kt', yieldKt: 475, color: '#ef4444', glowColor: 'rgba(239,68,68,0.4)' },
  { name: 'Tsar Bomba', subtitle: 'Largest ever detonated — 50,000 kt', yieldKt: 50000, color: '#a855f7', glowColor: 'rgba(168,85,247,0.4)' },
]

const LANDMARKS = [
  { name: 'Eiffel Tower height', meters: 330 },
  { name: 'Empire State Building', meters: 443 },
  { name: 'Golden Gate Bridge length', meters: 2737 },
  { name: 'Manhattan width', meters: 3700 },
  { name: 'Washington DC width', meters: 16000 },
]

function getLandmarkComparison(diameterM: number): string {
  if (diameterM < 330) return `smaller than the Eiffel Tower`
  if (diameterM < 443) return `taller than the Eiffel Tower (${(diameterM / 330).toFixed(1)}×)`
  if (diameterM < 2737) return `taller than the Empire State Building (${(diameterM / 443).toFixed(1)}×)`
  if (diameterM < 3700) return `wider than the Golden Gate Bridge (${(diameterM / 2737).toFixed(1)}×)`
  if (diameterM < 16000) return `wider than Manhattan (${(diameterM / 3700).toFixed(1)}×)`
  return `wider than Washington DC (${(diameterM / 16000).toFixed(1)}×)`
}

export default function Scale() {
  const t = useTranslation()
  const maxRadius = fireballRadius(50000) // Tsar Bomba max
  const maxDiameter = maxRadius * 2

  return (
    <SectionWrapper id="c-scale" fullHeight={false}>
      <div className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-5xl font-black">{t.scale.title}</h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            {t.scale.subtitle}
          </p>
        </div>

        {/* Landmark reference bar */}
        <div className="bg-bg-secondary rounded-xl border border-border p-4">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Landmark Reference</h3>
          <div className="relative h-8 flex items-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-white/10" />
            </div>
            {LANDMARKS.map((lm) => {
              const pct = (lm.meters / maxDiameter) * 100
              return (
                <div
                  key={lm.name}
                  className="absolute flex flex-col items-center"
                  style={{ left: `${Math.min(pct, 98)}%` }}
                >
                  <div className="w-px h-4 bg-white/30" />
                  <span className="text-[10px] text-white/40 whitespace-nowrap mt-1 rotate-45 origin-left">
                    {lm.name}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Weapons */}
        <div className="space-y-8">
          {WEAPONS.map((weapon, i) => {
            const radiusM = fireballRadius(weapon.yieldKt)
            const diameterM = radiusM * 2
            const barPct = (diameterM / maxDiameter) * 100
            const displayDiam = diameterM >= 1000
              ? `${(diameterM / 1000).toFixed(1)} km`
              : `${diameterM.toFixed(0)} m`
            const comparison = getLandmarkComparison(diameterM)

            return (
              <motion.div
                key={weapon.name}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="space-y-3"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-lg font-bold text-text-primary">{weapon.name}</span>
                  <span className="text-sm text-text-muted">{weapon.subtitle}</span>
                </div>

                {/* Bar */}
                <div className="relative h-12 flex items-center">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${barPct}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 + 0.2, duration: 0.8, ease: 'easeOut' }}
                    className="absolute left-0 h-full rounded-r-lg flex items-center overflow-visible"
                    style={{
                      background: `radial-gradient(ellipse at left, ${weapon.glowColor} 0%, ${weapon.color}80 40%, ${weapon.color}20 100%)`,
                      boxShadow: `0 0 20px ${weapon.glowColor}`,
                      minWidth: 8,
                    }}
                  >
                    <div
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-8"
                      style={{ backgroundColor: weapon.color }}
                    />
                  </motion.div>
                  <span
                    className="relative z-10 ml-auto pl-4 text-sm font-mono font-bold"
                    style={{ color: weapon.color }}
                  >
                    {displayDiam} diameter
                  </span>
                </div>

                {/* Comparison */}
                <p className="text-xs text-text-muted pl-1">
                  Fireball {comparison}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-purple-500/30 bg-purple-950/30 p-6 text-center space-y-2"
        >
          <div className="text-4xl font-black text-purple-300">
            {((fireballRadius(50000) * 2) / 1000).toFixed(1)} km
          </div>
          <p className="text-purple-200 font-semibold">Tsar Bomba fireball diameter</p>
          <p className="text-text-muted text-sm">
            The fireball was wider than Manhattan — before the blast wave had even arrived.
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
