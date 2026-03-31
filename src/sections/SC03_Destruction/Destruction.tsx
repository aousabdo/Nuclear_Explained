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
import { useTranslation } from '../../hooks/useTranslation'

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
  const t = useTranslation()

  const CASUAL_WEAPONS: WeaponPreset[] = t.destruction.weapons.map((w, i) => ({
    name: w.name,
    subtitle: w.subtitle,
    yieldKt: WEAPON_YIELDS[i],
    color: WEAPON_COLORS[i],
    icon: WEAPON_ICONS[i],
  }))

  const [selected, setSelected] = useState<WeaponPreset>(() => ({
    name: t.destruction.weapons[1].name,
    subtitle: t.destruction.weapons[1].subtitle,
    yieldKt: WEAPON_YIELDS[1],
    color: WEAPON_COLORS[1],
    icon: WEAPON_ICONS[1],
  }))
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [cityName, setCityName] = useState('Washington, D.C.')
  const [zoom] = useState(10)

  // Keep selected in sync when language changes
  const selectedWeapon = CASUAL_WEAPONS.find((w) => w.yieldKt === selected.yieldKt) ?? CASUAL_WEAPONS[1]

  const handleCitySelect = useCallback((city: City) => {
    setCenter([city.lat, city.lng])
    setCityName(city.name)
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

  const rings: EffectRing[] = useMemo(() => [
    { radiusKm: effects.fireballKm, color: '#dc2626', label: `${t.destruction.zones.fireball} — ${t.destruction.zones.vaporized}` },
    { radiusKm: effects.psi20, color: '#f97316', label: t.destruction.zones.totalDestruction },
    { radiusKm: effects.psi5, color: '#eab308', label: t.destruction.zones.severeDamage },
    { radiusKm: effects.psi1, color: '#3b82f6', label: t.destruction.zones.windowsShatter },
  ].filter(r => r.radiusKm > 0.001), [effects, t])

  return (
    <SectionWrapper id="c-destruction" fullHeight={false}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-black">{t.destruction.title}</h2>
          <p className="text-text-secondary max-w-2xl">
            {t.destruction.subtitle}
          </p>
        </div>

        {/* Weapon selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CASUAL_WEAPONS.map((w) => (
            <button
              key={w.yieldKt}
              onClick={() => setSelected(w)}
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
          {/* City search + legend */}
          <div className="space-y-4">
            <CitySearch onSelect={handleCitySelect} value={cityName} />

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

            {/* Stats */}
            <div className="bg-bg-secondary rounded-xl border border-border p-4 space-y-3">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t.destruction.stats.title}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">{t.destruction.stats.fireballDiameter}</span>
                  <span className="text-red-400 font-mono font-bold">
                    {(effects.fireballKm * 2 * 1000) >= 1000
                      ? `${(effects.fireballKm * 2).toFixed(1)} km`
                      : `${(effects.fireballKm * 2 * 1000).toFixed(0)} m`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">{t.destruction.stats.totalDestruction}</span>
                  <span className="text-orange-400 font-mono font-bold">
                    {effects.psi20.toFixed(1)} km
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">{t.destruction.stats.severeDamage}</span>
                  <span className="text-yellow-400 font-mono font-bold">
                    {effects.psi5.toFixed(1)} km
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">{t.destruction.stats.windowsShatter}</span>
                  <span className="text-blue-400 font-mono font-bold">
                    {effects.psi1.toFixed(1)} km
                  </span>
                </div>
                <div className="pt-2 border-t border-border text-xs text-text-muted">
                  {t.destruction.stats.destructionArea}: {formatAreaComparison(effects.areaPsi5)}
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <BaseMap center={center} zoom={zoom}>
            <MapUpdater center={center} zoom={zoom} />
            <EffectRings center={center} rings={rings} />
          </BaseMap>
          <p className="text-xs text-text-muted">{t.destruction.location}: {cityName}</p>
        </div>
      </div>
    </SectionWrapper>
  )
}
