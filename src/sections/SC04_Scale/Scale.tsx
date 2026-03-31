import { motion } from 'framer-motion'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { fireballRadius } from '../../lib/physics/fireball'
import { useTranslation } from '../../hooks/useTranslation'

interface Weapon {
  nameKey: string
  yieldKt: number
  color: string
  glowColor: string
  landmarkIndex: number
}

const WEAPONS: Weapon[] = [
  { nameKey: 'Little Boy', yieldKt: 15, color: '#f59e0b', glowColor: 'rgba(245,158,11,0.5)', landmarkIndex: 0 },
  { nameKey: 'Modern Warhead', yieldKt: 100, color: '#3b82f6', glowColor: 'rgba(59,130,246,0.5)', landmarkIndex: 1 },
  { nameKey: 'City Buster (W88)', yieldKt: 475, color: '#ef4444', glowColor: 'rgba(239,68,68,0.5)', landmarkIndex: 2 },
  { nameKey: 'Tsar Bomba', yieldKt: 50000, color: '#a855f7', glowColor: 'rgba(168,85,247,0.5)', landmarkIndex: 3 },
]

const MAX_DISPLAY_PX = 260 // Tsar Bomba circle size in px

export default function Scale() {
  const t = useTranslation()
  const maxRadius = fireballRadius(50000, false)

  return (
    <SectionWrapper id="c-scale" fullHeight={false}>
      <div className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-5xl font-black">{t.scale.title}</h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            {t.scale.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {WEAPONS.map((weapon, i) => {
            const radiusM = fireballRadius(weapon.yieldKt, false)
            const diameterM = radiusM * 2
            const displayDiam = diameterM >= 1000
              ? `${(diameterM / 1000).toFixed(2)} km`
              : `${diameterM.toFixed(0)} m`

            // Scale circle proportionally (px radius)
            const circleRadius = (radiusM / maxRadius) * (MAX_DISPLAY_PX / 2)
            const circleDiameter = Math.max(circleRadius * 2, 24)
            const containerSize = MAX_DISPLAY_PX + 20

            const landmark = t.scale.landmarks[weapon.landmarkIndex]

            return (
              <motion.div
                key={weapon.nameKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl border p-6 flex flex-col items-center gap-4"
                style={{
                  backgroundColor: `${weapon.color}08`,
                  borderColor: `${weapon.color}30`,
                  boxShadow: `0 0 30px ${weapon.glowColor}20`,
                }}
              >
                {/* Glowing circle */}
                <div
                  className="relative flex items-center justify-center flex-shrink-0"
                  style={{ width: containerSize, height: containerSize }}
                >
                  <motion.div
                    initial={{ scale: 0.2, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.2, duration: 0.7, ease: 'easeOut' }}
                    style={{
                      width: circleDiameter,
                      height: circleDiameter,
                      borderRadius: '50%',
                      background: `radial-gradient(circle at center, white 0%, ${weapon.color} 30%, ${weapon.glowColor} 60%, transparent 80%)`,
                      boxShadow: `0 0 ${circleDiameter * 0.4}px ${weapon.glowColor}, 0 0 ${circleDiameter * 0.15}px ${weapon.color}`,
                    }}
                  />
                </div>

                {/* Info */}
                <div className="text-center space-y-1 w-full">
                  <div className="text-lg font-black text-text-primary">{weapon.nameKey}</div>
                  <div
                    className="text-2xl font-black font-mono"
                    style={{ color: weapon.color }}
                  >
                    {displayDiam}
                  </div>
                  <div className="text-xs text-text-muted font-medium">
                    {weapon.yieldKt >= 1000
                      ? `${(weapon.yieldKt / 1000).toFixed(0)} Mt`
                      : `${weapon.yieldKt} kt`} yield · {t.scale.fireballDiameter}
                  </div>
                  <div
                    className="text-xs mt-2 px-3 py-1.5 rounded-full inline-block font-medium"
                    style={{ backgroundColor: `${weapon.color}15`, color: weapon.color }}
                  >
                    {landmark}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Tsar Bomba callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-purple-500/30 bg-purple-950/30 p-6 text-center space-y-2"
        >
          <div className="text-4xl font-black text-purple-300">
            {((fireballRadius(50000, false) * 2) / 1000).toFixed(1)} km
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
