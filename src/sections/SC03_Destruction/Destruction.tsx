import { useState, useMemo, useCallback } from 'react'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { BaseMap } from '../../components/map/BaseMap'
import { EffectRings } from '../../components/map/EffectRings'
import type { EffectRing } from '../../components/map/EffectRings'
import { MapUpdater } from '../../components/map/MapUpdater'
import { CitySearch } from '../../components/map/CitySearch'
import { blastRadius, blastArea } from '../../lib/physics/blast'
import { fireballRadius } from '../../lib/physics/fireball'
import type { City } from '../../data/cities'

const DEFAULT_CENTER: [number, number] = [38.9072, -77.0369] // Washington D.C.

interface WeaponPreset {
  name: string
  subtitle: string
  yieldKt: number
  color: string
  icon: string
}

const CASUAL_WEAPONS: WeaponPreset[] = [
  { name: 'Little Boy', subtitle: 'Hiroshima, 1945', yieldKt: 15, color: '#f59e0b', icon: '💣' },
  { name: 'Modern Warhead', subtitle: 'Standard SLBM warhead', yieldKt: 100, color: '#3b82f6', icon: '🚀' },
  { name: 'City Buster', subtitle: 'W88 — Most powerful US warhead', yieldKt: 475, color: '#ef4444', icon: '☢' },
  { name: 'Tsar Bomba', subtitle: 'Largest ever detonated', yieldKt: 50000, color: '#a855f7', icon: '💀' },
]

const CENTRAL_PARK_KM2 = 3.4
const DC_KM2 = 159

function formatAreaComparison(areaKm2: number): string {
  if (areaKm2 < 3.4) {
    const pct = (areaKm2 / CENTRAL_PARK_KM2 * 100).toFixed(0)
    return `${pct}% of Central Park`
  } else if (areaKm2 < 159) {
    const x = (areaKm2 / CENTRAL_PARK_KM2).toFixed(1)
    return `≈ ${x}× Central Park`
  } else {
    const x = (areaKm2 / DC_KM2).toFixed(1)
    return `≈ ${x}× Washington DC`
  }
}

export default function Destruction() {
  const [selected, setSelected] = useState<WeaponPreset>(CASUAL_WEAPONS[1])
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [cityName, setCityName] = useState('Washington, D.C.')
  const [zoom] = useState(10)

  const handleCitySelect = useCallback((city: City) => {
    setCenter([city.lat, city.lng])
    setCityName(city.name)
  }, [])

  const effects = useMemo(() => {
    const y = selected.yieldKt
    return {
      fireballKm: fireballRadius(y) / 1000,
      psi20: blastRadius(y, 20),
      psi5: blastRadius(y, 5),
      psi1: blastRadius(y, 1),
      areaPsi5: blastArea(y, 5),
    }
  }, [selected])

  const rings: EffectRing[] = useMemo(() => [
    { radiusKm: effects.fireballKm, color: '#dc2626', label: 'Fireball — Vaporized' },
    { radiusKm: effects.psi20, color: '#f97316', label: 'Total destruction' },
    { radiusKm: effects.psi5, color: '#eab308', label: 'Severe damage' },
    { radiusKm: effects.psi1, color: '#3b82f6', label: 'Windows shatter' },
  ].filter(r => r.radiusKm > 0.001), [effects])

  return (
    <SectionWrapper id="c-destruction" fullHeight={false}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-black">Destruction Zones</h2>
          <p className="text-text-secondary max-w-2xl">
            Choose a weapon to see how far the destruction reaches on a real map.
          </p>
        </div>

        {/* Weapon selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CASUAL_WEAPONS.map((w) => (
            <button
              key={w.name}
              onClick={() => setSelected(w)}
              className="relative rounded-xl p-4 border-2 text-left transition-all duration-200 space-y-1"
              style={{
                borderColor: selected.name === w.name ? w.color : 'rgba(255,255,255,0.08)',
                backgroundColor: selected.name === w.name ? w.color + '18' : 'rgba(255,255,255,0.03)',
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
          {/* City search + legend */}
          <div className="space-y-4">
            <CitySearch onSelect={handleCitySelect} value={cityName} />

            <div className="bg-bg-secondary rounded-xl border border-border p-4 space-y-3">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Effect Zones</h3>
              {[
                { color: '#dc2626', label: 'Fireball', desc: 'Vaporized' },
                { color: '#f97316', label: '20 psi', desc: 'Total destruction' },
                { color: '#eab308', label: '5 psi', desc: 'Severe damage' },
                { color: '#3b82f6', label: '1 psi', desc: 'Windows shatter' },
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

            {/* Stats */}
            <div className="bg-bg-secondary rounded-xl border border-border p-4 space-y-3">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Impact Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Fireball diameter</span>
                  <span className="text-red-400 font-mono font-bold">
                    {(effects.fireballKm * 2 * 1000) >= 1000
                      ? `${(effects.fireballKm * 2).toFixed(1)} km`
                      : `${(effects.fireballKm * 2 * 1000).toFixed(0)} m`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Total destruction</span>
                  <span className="text-orange-400 font-mono font-bold">
                    {effects.psi20.toFixed(1)} km
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Severe damage</span>
                  <span className="text-yellow-400 font-mono font-bold">
                    {effects.psi5.toFixed(1)} km
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Windows shatter</span>
                  <span className="text-blue-400 font-mono font-bold">
                    {effects.psi1.toFixed(1)} km
                  </span>
                </div>
                <div className="pt-2 border-t border-border text-xs text-text-muted">
                  Destruction area: {formatAreaComparison(effects.areaPsi5)}
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <BaseMap center={center} zoom={zoom}>
            <MapUpdater center={center} zoom={zoom} />
            <EffectRings center={center} rings={rings} />
          </BaseMap>
        </div>
      </div>
    </SectionWrapper>
  )
}
