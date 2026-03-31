import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { blastRadius } from '../../lib/physics/blast'
import { promptRadiationRadius } from '../../lib/physics/radiation'
import { formatDistance } from '../../lib/format'

interface WeaponSystem {
  name: string
  yieldRange: string
  yieldKt: number
  delivery: string
  range: string
  targets: string
  fallout: string
  category: 'tactical' | 'strategic'
  details: string
}

const WEAPONS: WeaponSystem[] = [
  { name: 'W54 Davy Crockett', yieldRange: '10-20 tons', yieldKt: 0.02, delivery: 'Recoilless rifle', range: '2-4 km', targets: 'Troop concentrations', fallout: 'Minimal (very low yield)', category: 'tactical', details: 'Smallest US nuclear weapon. Man-portable. Its lethal radiation radius exceeded both its blast radius and its delivery range — meaning the crew firing it could receive a lethal dose.' },
  { name: 'B61-12', yieldRange: '0.3-50 kt', yieldKt: 50, delivery: 'Gravity bomb (F-35, F-15E)', range: 'Aircraft range', targets: 'Military facilities, bunkers', fallout: 'Low to moderate', category: 'tactical', details: 'Modern dial-a-yield weapon with GPS guidance. The primary US tactical nuclear weapon deployed in Europe. Can be set from 0.3 kt to 50 kt depending on target.' },
  { name: 'W76-2', yieldRange: '~5-7 kt', yieldKt: 7, delivery: 'Trident II SLBM', range: '12,000 km', targets: 'Limited strategic', fallout: 'Low (airburst)', category: 'tactical', details: 'Controversial low-yield SLBM warhead. Critics argue that an adversary cannot distinguish a low-yield SLBM launch from a strategic one, risking escalation.' },
  { name: 'B61-11', yieldRange: '~400 kt', yieldKt: 400, delivery: 'Gravity bomb (B-2, B-21)', range: 'Bomber range', targets: 'Hardened/buried targets', fallout: 'Very high (earth penetrator)', category: 'strategic', details: 'Nuclear earth-penetrating weapon. Burrows ~6m before detonation, coupling much more energy into the ground. Produces massive fallout due to ground burst.' },
  { name: 'W88', yieldRange: '~475 kt', yieldKt: 475, delivery: 'Trident II SLBM', range: '12,000 km', targets: 'Strategic counterforce/value', fallout: 'Low if airburst', category: 'strategic', details: 'Most powerful US SLBM warhead. Carried on Trident II missiles in Ohio-class submarines. Up to 8 warheads per missile (MIRVed).' },
  { name: 'B83', yieldRange: '~1.2 Mt', yieldKt: 1200, delivery: 'Gravity bomb (B-2)', range: 'Bomber range', targets: 'Strategic, hardened', fallout: 'Variable', category: 'strategic', details: 'Highest yield weapon in the US arsenal until retirement. 1.2 Mt — roughly 80× Hiroshima. Could destroy any above-ground target.' },
  { name: 'Tsar Bomba', yieldRange: '50 Mt', yieldKt: 50000, delivery: 'Tu-95V bomber', range: 'Bomber range', targets: 'Demonstration', fallout: 'Low (50% fission version was 97% fusion)', category: 'strategic', details: 'Largest nuclear weapon ever detonated (1961). The shockwave circled the Earth three times. Window panes broken 900 km away. Designed as a 100 Mt weapon but tested at half yield.' },
]

export default function TacticalStrategic() {
  const [expandedWeapon, setExpandedWeapon] = useState<string | null>(null)

  // Davy Crockett insight data
  const davyCrockettBlast = blastRadius(0.02, 5) * 1000 // meters
  const davyCrockettRad = promptRadiationRadius(0.02, 500) * 1000 // meters
  const davyCrockettRange = 3000 // meters (weapon range)

  return (
    <SectionWrapper id="tactical-strategic" fullHeight={false}>
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">
            Tactical vs. Strategic Nuclear Weapons
          </h2>
          <p className="text-text-secondary max-w-3xl">
            Nuclear weapons span six orders of magnitude in yield — from sub-kiloton "tactical"
            weapons designed for battlefield use to multi-megaton "strategic" weapons targeting cities and hardened facilities.
          </p>
        </div>

        {/* Weapon comparison table */}
        <div className="space-y-2">
          {WEAPONS.map(weapon => (
            <motion.div
              key={weapon.name}
              className="bg-bg-secondary rounded-lg border border-border overflow-hidden"
              layout
            >
              <button
                onClick={() => setExpandedWeapon(expandedWeapon === weapon.name ? null : weapon.name)}
                className="w-full px-4 py-3 flex items-center gap-4 text-left hover:bg-bg-card/50 transition-colors"
              >
                <span className={`text-xs px-2 py-0.5 rounded ${
                  weapon.category === 'tactical'
                    ? 'bg-thermal/20 text-thermal'
                    : 'bg-fallout/20 text-fallout'
                }`}>
                  {weapon.category}
                </span>
                <span className="text-sm font-medium text-text-primary flex-1">{weapon.name}</span>
                <span className="text-xs text-text-muted hidden md:block">{weapon.delivery}</span>
                <span className="text-sm font-mono text-text-secondary">{weapon.yieldRange}</span>
                <svg
                  className={`w-4 h-4 text-text-muted transition-transform ${expandedWeapon === weapon.name ? 'rotate-180' : ''}`}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <AnimatePresence>
                {expandedWeapon === weapon.name && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                      <p className="text-sm text-text-secondary">{weapon.details}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-text-muted block">Delivery</span>
                          <span className="text-text-primary">{weapon.delivery}</span>
                        </div>
                        <div>
                          <span className="text-text-muted block">Range</span>
                          <span className="text-text-primary">{weapon.range}</span>
                        </div>
                        <div>
                          <span className="text-text-muted block">Primary Targets</span>
                          <span className="text-text-primary">{weapon.targets}</span>
                        </div>
                        <div>
                          <span className="text-text-muted block">Fallout Profile</span>
                          <span className="text-text-primary">{weapon.fallout}</span>
                        </div>
                      </div>
                      <div className="flex gap-4 text-xs text-text-muted">
                        <span>5 psi radius: <span className="text-blast">{formatDistance(blastRadius(weapon.yieldKt, 5))}</span></span>
                        <span>1 psi radius: <span className="text-thermal">{formatDistance(blastRadius(weapon.yieldKt, 1))}</span></span>
                        {weapon.yieldKt < 50 && (
                          <span>Lethal radiation: <span className="text-radiation">{formatDistance(promptRadiationRadius(weapon.yieldKt, 500))}</span></span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Davy Crockett insight */}
        <div className="bg-bg-secondary rounded-lg border border-border p-6 space-y-4">
          <h3 className="text-lg font-semibold text-thermal">
            The Davy Crockett Problem — When Radiation Exceeds Range
          </h3>
          <p className="text-sm text-text-secondary">
            The W54 Davy Crockett illustrates a fundamental problem with very small nuclear weapons:
            the lethal radiation radius can exceed both the blast radius and the weapon's own delivery range.
          </p>

          <div className="flex justify-center">
            <svg viewBox="0 0 500 200" className="w-full max-w-lg">
              {/* Scale reference */}
              <line x1={50} y1={170} x2={450} y2={170} stroke="#475569" strokeWidth={1} />

              {/* Weapon position */}
              <circle cx={100} cy={100} r={4} fill="#f59e0b" />
              <text x={100} y={88} fill="#f59e0b" fontSize={9} textAnchor="middle" fontFamily="Inter">Firing position</text>

              {/* Blast radius (smallest) */}
              <circle cx={100} cy={100} r={davyCrockettBlast / 30} fill="rgba(59, 130, 246, 0.15)" stroke="#3b82f6" strokeWidth={1.5} />

              {/* Weapon range */}
              <circle cx={100} cy={100} r={davyCrockettRange / 30} fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="6,4" />

              {/* Lethal radiation radius (largest) */}
              <circle cx={100} cy={100} r={davyCrockettRad / 30} fill="rgba(34, 197, 94, 0.08)" stroke="#22c55e" strokeWidth={1.5} strokeDasharray="4,4" />

              {/* Labels */}
              <text x={300} y={40} fill="#3b82f6" fontSize={10} fontFamily="Inter">
                Blast radius (5 psi): {Math.round(davyCrockettBlast)} m
              </text>
              <text x={300} y={58} fill="#f59e0b" fontSize={10} fontFamily="Inter">
                Weapon range: ~{(davyCrockettRange / 1000).toFixed(0)} km
              </text>
              <text x={300} y={76} fill="#22c55e" fontSize={10} fontFamily="Inter">
                Lethal radiation: {Math.round(davyCrockettRad)} m
              </text>
              <text x={300} y={110} fill="#ef4444" fontSize={11} fontFamily="Inter" fontWeight={600}>
                Radiation radius ≈ weapon range
              </text>
              <text x={300} y={128} fill="#94a3b8" fontSize={9} fontFamily="Inter">
                The crew would likely receive a lethal dose
              </text>
            </svg>
          </div>
        </div>

        {/* Escalation ladder */}
        <div className="bg-bg-secondary rounded-lg border border-border p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">
            The Escalation Ladder
          </h3>
          <p className="text-sm text-text-secondary">
            Nuclear strategists describe escalation as a ladder — each rung represents a more
            dangerous level of conflict. The key concern is that crossing any nuclear threshold
            may make higher rungs inevitable.
          </p>

          <div className="flex flex-col gap-1 max-w-md mx-auto">
            {[
              { label: 'Strategic Countervalue', desc: 'Targeting cities and population centers', color: '#dc2626' },
              { label: 'Strategic Counterforce', desc: 'Targeting enemy nuclear forces and C2', color: '#ef4444' },
              { label: 'Theater Nuclear', desc: 'Nuclear strikes on military targets in-theater', color: '#f97316' },
              { label: 'Tactical Nuclear', desc: 'Battlefield nuclear weapons use', color: '#f59e0b' },
              { label: 'Conventional Conflict', desc: 'Non-nuclear military operations', color: '#3b82f6' },
              { label: 'Crisis/Tension', desc: 'Diplomatic crisis, military posturing', color: '#22c55e' },
            ].reverse().map((rung, i) => (
              <div
                key={rung.label}
                className="flex items-center gap-3 px-4 py-2 rounded bg-bg-card border border-border"
                style={{ borderLeftColor: rung.color, borderLeftWidth: 3 }}
              >
                <span className="text-text-muted text-xs w-4">{6 - i}</span>
                <div>
                  <span className="text-sm font-medium" style={{ color: rung.color }}>{rung.label}</span>
                  <span className="text-xs text-text-muted block">{rung.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
