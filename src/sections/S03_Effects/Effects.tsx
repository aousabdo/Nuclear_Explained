import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { Slider } from '../../components/ui/Slider'
import { DOSE_EFFECTS } from '../../lib/physics/radiation'
import { useTranslation } from '../../hooks/useTranslation'

const EFFECT_COLORS = ['#3b82f6', '#f59e0b', '#22c55e', '#ef4444', '#a855f7']
const EFFECT_PERCENTAGES = [50, 35, 5, 10, 1]

export default function Effects() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [doseRem, setDoseRem] = useState(100)

  const t = useTranslation()
  const te = t.expert.effects

  const effects = te.effects.map((e, i) => ({
    ...e,
    percentage: EFFECT_PERCENTAGES[i],
    color: EFFECT_COLORS[i],
  }))

  const selectedData = selectedIndex !== null ? effects[selectedIndex] : null
  const doseEffect = DOSE_EFFECTS.find(d => doseRem >= d.minRem && doseRem < d.maxRem) || DOSE_EFFECTS[DOSE_EFFECTS.length - 1]

  return (
    <SectionWrapper id="effects" fullHeight={false}>
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">
            {te.title}
          </h2>
          <p className="text-text-secondary max-w-3xl">
            {te.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Donut Chart */}
          <div className="flex flex-col items-center gap-4">
            <svg viewBox="0 0 300 300" className="w-full max-w-[350px]">
              {(() => {
                let cumulative = 0
                return effects.map((effect, idx) => {
                  const start = cumulative
                  cumulative += effect.percentage
                  const startAngle = (start / 100) * 2 * Math.PI - Math.PI / 2
                  const endAngle = (cumulative / 100) * 2 * Math.PI - Math.PI / 2
                  const outerR = 120
                  const innerR = 70
                  const cx = 150, cy = 150

                  const x1 = cx + outerR * Math.cos(startAngle)
                  const y1 = cy + outerR * Math.sin(startAngle)
                  const x2 = cx + outerR * Math.cos(endAngle)
                  const y2 = cy + outerR * Math.sin(endAngle)
                  const x3 = cx + innerR * Math.cos(endAngle)
                  const y3 = cy + innerR * Math.sin(endAngle)
                  const x4 = cx + innerR * Math.cos(startAngle)
                  const y4 = cy + innerR * Math.sin(startAngle)

                  const largeArc = effect.percentage > 50 ? 1 : 0
                  const isSelected = selectedIndex === idx

                  // Label position
                  const midAngle = (startAngle + endAngle) / 2
                  const labelR = outerR + 25
                  const lx = cx + labelR * Math.cos(midAngle)
                  const ly = cy + labelR * Math.sin(midAngle)

                  return (
                    <g
                      key={effect.name}
                      onClick={() => setSelectedIndex(isSelected ? null : idx)}
                      className="cursor-pointer"
                    >
                      <path
                        d={`M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`}
                        fill={effect.color}
                        opacity={isSelected ? 1 : 0.7}
                        stroke="#0a0e1a"
                        strokeWidth={2}
                        style={{ transition: 'opacity 0.2s', transform: isSelected ? 'scale(1.03)' : 'scale(1)', transformOrigin: '150px 150px' }}
                      />
                      <text x={lx} y={ly} fill={effect.color} fontSize={10} textAnchor="middle" fontFamily="Inter" fontWeight={600}>
                        {effect.percentage}%
                      </text>
                    </g>
                  )
                })
              })()}
              <text x={150} y={145} fill="#f1f5f9" fontSize={12} textAnchor="middle" fontFamily="Inter" fontWeight={600}>
                {te.energyLabel}
              </text>
              <text x={150} y={162} fill="#94a3b8" fontSize={10} textAnchor="middle" fontFamily="Inter">
                {te.energyPartition}
              </text>
            </svg>

            {/* Legend buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              {effects.map((e, idx) => (
                <button
                  key={e.name}
                  onClick={() => setSelectedIndex(selectedIndex === idx ? null : idx)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    selectedIndex === idx
                      ? 'border-current bg-current/10'
                      : 'border-border bg-bg-card text-text-secondary hover:text-text-primary'
                  }`}
                  style={{ color: selectedIndex === idx ? e.color : undefined }}
                >
                  {e.name}
                </button>
              ))}
            </div>
          </div>

          {/* Effect details panel */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {selectedData ? (
                <motion.div
                  key={selectedData.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-bg-secondary rounded-lg border border-border p-5 space-y-3"
                  style={{ borderLeftColor: selectedData.color, borderLeftWidth: 3 }}
                >
                  <h3 className="text-lg font-semibold" style={{ color: selectedData.color }}>
                    {selectedData.name} — {selectedData.percentage}{te.ofTotalEnergy}
                  </h3>
                  <p className="text-text-secondary text-sm">{selectedData.description}</p>
                  <ul className="space-y-1">
                    {selectedData.details.map((d, i) => (
                      <li key={i} className="text-xs text-text-muted flex gap-2">
                        <span style={{ color: selectedData.color }}>•</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-bg-secondary rounded-lg border border-border p-5 text-center text-text-muted text-sm"
                >
                  {te.placeholder}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dose effects interactive */}
            <div className="bg-bg-secondary rounded-lg border border-border p-5 space-y-4">
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                {te.radiationDoseTitle}
              </h3>
              <Slider
                min={0}
                max={1000}
                value={doseRem}
                onChange={setDoseRem}
                label={te.acuteDoseLabel}
                unit="rem"
                accentColor="#22c55e"
              />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">{te.shortTermLabel}</span>
                  <span className="text-text-primary">{doseEffect.shortTerm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">{te.longTermLabel}</span>
                  <span className="text-text-primary">{doseEffect.longTerm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">{te.mortalityLabel}</span>
                  <span className={doseRem > 400 ? 'text-fallout font-medium' : 'text-text-primary'}>{doseEffect.mortality}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
