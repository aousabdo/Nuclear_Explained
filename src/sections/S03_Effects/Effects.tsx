import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { Slider } from '../../components/ui/Slider'
import { DOSE_EFFECTS } from '../../lib/physics/radiation'

interface EffectData {
  name: string
  percentage: number
  color: string
  description: string
  details: string[]
}

const EFFECTS: EffectData[] = [
  {
    name: 'Blast/Shock', percentage: 50, color: '#3b82f6',
    description: 'The primary destructive mechanism. A supersonic pressure wave that crushes structures and generates hurricane-force winds.',
    details: [
      '1 psi: Window breakage, minor structural damage',
      '5 psi: Most residential buildings destroyed',
      '10 psi: Reinforced concrete heavily damaged',
      '20 psi: Near-total destruction of all structures',
    ],
  },
  {
    name: 'Thermal Radiation', percentage: 35, color: '#f59e0b',
    description: 'Intense light and heat radiated from the fireball. Travels at the speed of light, arriving before the blast wave.',
    details: [
      '3 cal/cm²: 1st degree burns on exposed skin',
      '5 cal/cm²: 2nd degree burns, paper ignites',
      '8 cal/cm²: 3rd degree burns, mass fires',
      'Flash blindness at tens of kilometers in clear weather',
    ],
  },
  {
    name: 'Ionizing Radiation', percentage: 5, color: '#22c55e',
    description: 'Prompt gamma rays and neutrons emitted within the first minute. Significant only for lower-yield weapons where the radiation radius exceeds the blast radius.',
    details: [
      'Prompt: gamma rays + neutrons in first second',
      'For yields > ~50 kt, blast kills before radiation',
      'Neutron radiation is most intense in "enhanced radiation" weapons',
      'Measured in rem (roentgen equivalent man) or sieverts',
    ],
  },
  {
    name: 'Residual Radiation (Fallout)', percentage: 10, color: '#ef4444',
    description: 'Radioactive fission products deposited by the debris cloud. Surface bursts produce massive fallout; airbursts produce very little.',
    details: [
      'Primary isotopes: Sr-90 (28 yr), Cs-137 (30 yr), I-131 (8 days)',
      'Follows 7:10 decay rule (7× time → 10× less radiation)',
      'Surface burst: fireball vaporizes soil, creates fallout',
      'Airburst: minimal local fallout (debris stays aloft, disperses globally)',
    ],
  },
  {
    name: 'Electromagnetic Pulse', percentage: 1, color: '#a855f7',
    description: 'A burst of electromagnetic energy that can disable electronics. High-altitude bursts (>30 km) can affect areas thousands of km across.',
    details: [
      'E1: Fast pulse (nanoseconds), damages electronics',
      'E2: Similar to lightning, manageable with existing protections',
      'E3: Slow pulse (seconds-minutes), damages power grid transformers',
      'Starfish Prime (1962): 1.4 Mt at 400 km altitude disabled electronics 1,400 km away in Hawaii',
    ],
  },
]

export default function Effects() {
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null)
  const [doseRem, setDoseRem] = useState(100)

  const selectedData = EFFECTS.find(e => e.name === selectedEffect)
  const doseEffect = DOSE_EFFECTS.find(d => doseRem >= d.minRem && doseRem < d.maxRem) || DOSE_EFFECTS[DOSE_EFFECTS.length - 1]

  return (
    <SectionWrapper id="effects" fullHeight={false}>
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">
            The Five Effects of a Nuclear Detonation
          </h2>
          <p className="text-text-secondary max-w-3xl">
            The energy released partitions into five distinct effects. Click each segment to learn more.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Donut Chart */}
          <div className="flex flex-col items-center gap-4">
            <svg viewBox="0 0 300 300" className="w-full max-w-[350px]">
              {(() => {
                let cumulative = 0
                return EFFECTS.map(effect => {
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
                  const isSelected = selectedEffect === effect.name

                  // Label position
                  const midAngle = (startAngle + endAngle) / 2
                  const labelR = outerR + 25
                  const lx = cx + labelR * Math.cos(midAngle)
                  const ly = cy + labelR * Math.sin(midAngle)

                  return (
                    <g
                      key={effect.name}
                      onClick={() => setSelectedEffect(isSelected ? null : effect.name)}
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
                Energy
              </text>
              <text x={150} y={162} fill="#94a3b8" fontSize={10} textAnchor="middle" fontFamily="Inter">
                Partition
              </text>
            </svg>

            {/* Legend buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              {EFFECTS.map(e => (
                <button
                  key={e.name}
                  onClick={() => setSelectedEffect(selectedEffect === e.name ? null : e.name)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                    selectedEffect === e.name
                      ? 'border-current bg-current/10'
                      : 'border-border bg-bg-card text-text-secondary hover:text-text-primary'
                  }`}
                  style={{ color: selectedEffect === e.name ? e.color : undefined }}
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
                    {selectedData.name} — {selectedData.percentage}% of total energy
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
                  Click a segment in the chart to see details about each effect.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dose effects interactive */}
            <div className="bg-bg-secondary rounded-lg border border-border p-5 space-y-4">
              <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
                Radiation Dose Effects
              </h3>
              <Slider
                min={0}
                max={1000}
                value={doseRem}
                onChange={setDoseRem}
                label="Acute Dose"
                unit="rem"
                accentColor="#22c55e"
              />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Short-term effects:</span>
                  <span className="text-text-primary">{doseEffect.shortTerm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Long-term effects:</span>
                  <span className="text-text-primary">{doseEffect.longTerm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Mortality:</span>
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
