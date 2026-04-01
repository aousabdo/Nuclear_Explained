import { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { BaseMap } from '../../components/map/BaseMap'
import { EffectRings } from '../../components/map/EffectRings'
import type { EffectRing } from '../../components/map/EffectRings'
import { MapUpdater } from '../../components/map/MapUpdater'
import { CitySearch } from '../../components/map/CitySearch'
import { blastRadius, blastArea } from '../../lib/physics/blast'
import { fireballRadius } from '../../lib/physics/fireball'
import { estimateCasualties, formatCasualties } from '../../lib/physics/casualties'
import type { City } from '../../data/cities'
import { useTranslation } from '../../hooks/useTranslation'
import { useAppStore } from '../../hooks/useAppStore'
import { CITIES } from '../../data/cities'

const DEFAULT_CENTER: [number, number] = [34.884, 51.263] // Fordow, Iran

interface WeaponPreset {
  name: string
  subtitle: string
  yieldKt: number
  color: string
  icon: string
}

const WEAPON_YIELDS = [15, 100, 475, 50000]
const WEAPON_COLORS = ['#f59e0b', '#3b82f6', '#ef4444', '#a855f7']
const WEAPON_ICONS = ['💣', '🚀', '☢', '💀']

const CENTRAL_PARK_KM2 = 3.4
const DC_KM2 = 159

function formatAreaComparison(areaKm2: number): string {
  if (areaKm2 < 3.4) return `${(areaKm2 / CENTRAL_PARK_KM2 * 100).toFixed(0)}% of Central Park`
  if (areaKm2 < 159) return `≈ ${(areaKm2 / CENTRAL_PARK_KM2).toFixed(1)}× Central Park`
  return `≈ ${(areaKm2 / DC_KM2).toFixed(1)}× Washington DC`
}

type DetonatePhase = 'idle' | 'flash' | 'fireball' | 'shockwave' | 'done'

export default function Destruction() {
  const t = useTranslation()
  const { language } = useAppStore()
  const isAr = language === 'ar'

  const CASUAL_WEAPONS: WeaponPreset[] = t.destruction.weapons.map((w, i) => ({
    name: w.name, subtitle: w.subtitle, yieldKt: WEAPON_YIELDS[i],
    color: WEAPON_COLORS[i], icon: WEAPON_ICONS[i],
  }))

  const [selected, setSelected] = useState<WeaponPreset>(() => ({
    name: t.destruction.weapons[1].name, subtitle: t.destruction.weapons[1].subtitle,
    yieldKt: WEAPON_YIELDS[1], color: WEAPON_COLORS[1], icon: WEAPON_ICONS[1],
  }))
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [cityName, setCityName] = useState('Fordow, Iran')
  const [zoom] = useState(10)
  const [detonatePhase, setDetonatePhase] = useState<DetonatePhase>('idle')
  const [showRings, setShowRings] = useState(true)
  const heroCity = useAppStore(s => s.heroCity)

  useEffect(() => {
    if (heroCity) { setCenter([heroCity.lat, heroCity.lng]); setCityName(heroCity.name) }
  }, [heroCity])

  const selectedWeapon = CASUAL_WEAPONS.find((w) => w.yieldKt === selected.yieldKt) ?? CASUAL_WEAPONS[1]

  const handleCitySelect = useCallback((city: City) => {
    setCenter([city.lat, city.lng]); setCityName(city.name)
  }, [])

  const effects = useMemo(() => {
    const y = selectedWeapon.yieldKt
    return {
      fireballKm: fireballRadius(y) / 1000,
      psi20: blastRadius(y, 20),
      psi5: blastRadius(y, 5),
      psi1: blastRadius(y, 1),
      areaPsi5: blastArea(y, 5),
    }
  }, [selectedWeapon])

  // Casualty estimate — uses city population if we can find it
  const cityPopulation = useMemo(() => {
    const found = CITIES.find(c => c.name === cityName)
    return found?.population ?? 0
  }, [cityName])

  const casualties = useMemo(() => estimateCasualties(
    cityPopulation, effects.fireballKm, effects.psi20, effects.psi5, effects.psi1
  ), [cityPopulation, effects])

  const rings: EffectRing[] = useMemo(() => [
    { radiusKm: effects.fireballKm, color: '#dc2626', label: `${t.destruction.zones.fireball} — ${t.destruction.zones.vaporized}` },
    { radiusKm: effects.psi20, color: '#f97316', label: t.destruction.zones.totalDestruction },
    { radiusKm: effects.psi5, color: '#eab308', label: t.destruction.zones.severeDamage },
    { radiusKm: effects.psi1, color: '#3b82f6', label: t.destruction.zones.windowsShatter },
  ].filter(r => r.radiusKm > 0.001), [effects, t])

  // Detonation animation sequence
  const handleDetonate = useCallback(() => {
    if (detonatePhase !== 'idle' && detonatePhase !== 'done') return
    setShowRings(false)
    setDetonatePhase('flash')
    setTimeout(() => setDetonatePhase('fireball'), 300)
    setTimeout(() => setDetonatePhase('shockwave'), 900)
    setTimeout(() => { setDetonatePhase('done'); setShowRings(true) }, 2200)
    setTimeout(() => setDetonatePhase('idle'), 3000)
  }, [detonatePhase])

  return (
    <SectionWrapper id="c-destruction" fullHeight={false}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-black">{t.destruction.title}</h2>
          <p className="text-text-secondary max-w-2xl">{t.destruction.subtitle}</p>
        </div>

        {/* Weapon selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CASUAL_WEAPONS.map((w) => (
            <button key={w.yieldKt} onClick={() => setSelected(w)}
              className="relative rounded-xl p-4 border-2 text-left transition-all duration-200 space-y-1"
              style={{
                borderColor: selectedWeapon.yieldKt === w.yieldKt ? w.color : 'rgba(255,255,255,0.08)',
                backgroundColor: selectedWeapon.yieldKt === w.yieldKt ? w.color + '18' : 'rgba(255,255,255,0.03)',
              }}
            >
              <div className="text-2xl">{w.icon}</div>
              <div className="font-bold text-sm text-text-primary">{w.name}</div>
              <div className="text-xs text-text-muted">{w.subtitle}</div>
              <div className="text-xs font-mono mt-1" style={{ color: w.color }}>
                {w.yieldKt >= 1000 ? `${(w.yieldKt / 1000).toFixed(0)} Mt` : `${w.yieldKt} kt`}
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            <CitySearch onSelect={handleCitySelect} value={cityName} />

            {/* Casualty estimate */}
            {cityPopulation > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-red-900/40 bg-red-950/20 p-4 space-y-3"
              >
                <h3 className="text-xs font-semibold text-red-400/80 uppercase tracking-wider">
                  {isAr ? 'تقدير الضحايا' : 'Estimated Casualties'}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-0.5">
                    <div className="text-2xl font-black text-red-400 font-mono">
                      {formatCasualties(casualties.killed)}
                    </div>
                    <div className="text-xs text-text-muted">
                      {isAr ? 'قتلى' : 'killed'}
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-2xl font-black text-orange-400 font-mono">
                      {formatCasualties(casualties.injured)}
                    </div>
                    <div className="text-xs text-text-muted">
                      {isAr ? 'مصابون' : 'injured'}
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-text-muted leading-relaxed">
                  {isAr
                    ? 'تقدير مبسّط بناءً على الكثافة السكانية وبيانات Glasstone & Dolan.'
                    : 'Simplified estimate based on population density & Glasstone & Dolan data.'
                  }
                </p>
              </motion.div>
            )}

            <div className="bg-bg-secondary rounded-xl border border-border p-4 space-y-3">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t.destruction.zones.title}</h3>
              {[
                { color: '#dc2626', label: t.destruction.zones.fireball, desc: t.destruction.zones.vaporized },
                { color: '#f97316', label: '20 psi', desc: t.destruction.zones.totalDestruction },
                { color: '#eab308', label: '5 psi', desc: t.destruction.zones.severeDamage },
                { color: '#3b82f6', label: '1 psi', desc: t.destruction.zones.windowsShatter },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <div>
                    <span className="text-xs font-semibold text-text-primary">{item.desc}</span>
                    <span className="text-xs text-text-muted ml-1">({item.label})</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-bg-secondary rounded-xl border border-border p-4 space-y-3">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t.destruction.stats.title}</h3>
              <div className="space-y-2 text-sm">
                {[
                  { label: t.destruction.stats.fireballDiameter, value: effects.fireballKm * 2 >= 1 ? `${(effects.fireballKm * 2).toFixed(1)} km` : `${(effects.fireballKm * 2 * 1000).toFixed(0)} m`, color: 'text-red-400' },
                  { label: t.destruction.stats.totalDestruction, value: `${effects.psi20.toFixed(1)} km`, color: 'text-orange-400' },
                  { label: t.destruction.stats.severeDamage,     value: `${effects.psi5.toFixed(1)} km`,  color: 'text-yellow-400' },
                  { label: t.destruction.stats.windowsShatter,   value: `${effects.psi1.toFixed(1)} km`,  color: 'text-blue-400' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-text-muted">{row.label}</span>
                    <span className={`${row.color} font-mono font-bold`}>{row.value}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-border text-xs text-text-muted">
                  {t.destruction.stats.destructionArea}: {formatAreaComparison(effects.areaPsi5)}
                </div>
              </div>
            </div>

            {/* Detonate button */}
            <motion.button
              onClick={handleDetonate}
              disabled={detonatePhase !== 'idle' && detonatePhase !== 'done'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-xl font-black text-sm tracking-widest uppercase border-2 border-red-600/60 bg-red-950/30 text-red-400 hover:bg-red-900/40 hover:border-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {detonatePhase === 'idle' || detonatePhase === 'done'
                ? (isAr ? '☢ فجّر' : '☢ Detonate')
                : (isAr ? '💥 جارٍ الانفجار...' : '💥 Detonating...')
              }
            </motion.button>
          </div>

          {/* Map + animation overlay */}
          <div className="relative">
            <BaseMap center={center} zoom={zoom} className="h-[320px] md:h-[480px] lg:h-[560px]">
              <MapUpdater center={center} zoom={zoom} />
              {showRings && <EffectRings center={center} rings={rings} />}
            </BaseMap>

            {/* Detonation animation overlay */}
            <AnimatePresence>
              {detonatePhase === 'flash' && (
                <motion.div
                  className="absolute inset-0 rounded-lg bg-white z-20 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.8, 0] }}
                  transition={{ duration: 0.6, times: [0, 0.1, 0.3, 1] }}
                />
              )}
              {(detonatePhase === 'fireball' || detonatePhase === 'shockwave') && (
                <motion.div className="absolute inset-0 rounded-lg z-20 flex items-center justify-center pointer-events-none overflow-hidden">
                  {/* Fireball */}
                  <motion.div
                    className="absolute rounded-full"
                    style={{ background: 'radial-gradient(circle, #fff 0%, #fef08a 20%, #f97316 50%, #dc2626 70%, transparent 100%)' }}
                    initial={{ width: 20, height: 20, opacity: 1 }}
                    animate={{ width: 220, height: 220, opacity: detonatePhase === 'shockwave' ? 0.4 : 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                  {/* Shockwave rings */}
                  {detonatePhase === 'shockwave' && [1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full border-2 border-white/60"
                      initial={{ width: 80, height: 80, opacity: 0.9 }}
                      animate={{ width: 800, height: 800, opacity: 0 }}
                      transition={{ duration: 1.2, delay: i * 0.15, ease: 'easeOut' }}
                    />
                  ))}
                  {/* Flash text */}
                  {detonatePhase === 'fireball' && (
                    <motion.div
                      className="absolute bottom-6 left-0 right-0 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="text-white/90 text-xs font-bold tracking-widest uppercase bg-black/50 px-3 py-1 rounded-full">
                        {isAr ? 'T = 0 · فلاش نووي' : 'T = 0 · Nuclear Flash'}
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="text-xs text-text-muted">{t.destruction.location}: {cityName}</p>
        </div>
      </div>
    </SectionWrapper>
  )
}
