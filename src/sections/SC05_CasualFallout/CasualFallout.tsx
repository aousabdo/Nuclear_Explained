import { useState, useMemo, useCallback } from 'react'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { BaseMap } from '../../components/map/BaseMap'
import { FalloutPlume } from '../../components/map/FalloutPlume'
import { MapUpdater } from '../../components/map/MapUpdater'
import { CitySearch } from '../../components/map/CitySearch'
import { generateFalloutContours } from '../../lib/physics/fallout'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import type { City } from '../../data/cities'
import { useTranslation } from '../../hooks/useTranslation'

const DEFAULT_CENTER: [number, number] = [38.9072, -77.0369] // Washington D.C.

const WEAPON_YIELDS = [15, 100, 475]
const WEAPON_COLORS = ['#f59e0b', '#3b82f6', '#ef4444']

const WIND_SPEED_VALUES = [10, 30, 60]

const ZONE_COLORS = [
  'rgba(127,29,29,0.85)',
  'rgba(220,38,38,0.75)',
  'rgba(249,115,22,0.65)',
  'rgba(234,179,8,0.55)',
  'rgba(134,239,172,0.45)',
]

const ZONE_DESCS = [
  'Lethal within minutes. No shelter is adequate.',
  'Lethal within hours without treatment.',
  'Serious illness. Evacuate or shelter deeply.',
  'Stay indoors, close all windows and vents.',
  'Minimize outdoor exposure.',
]

export default function CasualFallout() {
  const t = useTranslation()

  const WEAPONS = [
    { name: 'Little Boy', yieldKt: WEAPON_YIELDS[0], color: WEAPON_COLORS[0] },
    { name: 'Modern Warhead', yieldKt: WEAPON_YIELDS[1], color: WEAPON_COLORS[1] },
    { name: 'City Buster', yieldKt: WEAPON_YIELDS[2], color: WEAPON_COLORS[2] },
  ]

  const WIND_SPEEDS_LIST = [
    { label: 'Calm', kmh: WIND_SPEED_VALUES[0] },
    { label: 'Moderate', kmh: WIND_SPEED_VALUES[1] },
    { label: 'Strong', kmh: WIND_SPEED_VALUES[2] },
  ]

  const WIND_DIRS_LIST = [
    { label: 'N', deg: 0 },
    { label: 'NE', deg: 45 },
    { label: 'E', deg: 90 },
    { label: 'SE', deg: 135 },
    { label: 'S', deg: 180 },
    { label: 'SW', deg: 225 },
    { label: 'W', deg: 270 },
    { label: 'NW', deg: 315 },
  ]

  const ZONE_LABELS = [
    { color: ZONE_COLORS[0], label: t.casualFallout.zones.fatal, desc: ZONE_DESCS[0] },
    { color: ZONE_COLORS[1], label: t.casualFallout.zones.extremelyDangerous, desc: ZONE_DESCS[1] },
    { color: ZONE_COLORS[2], label: t.casualFallout.zones.dangerZone, desc: ZONE_DESCS[2] },
    { color: ZONE_COLORS[3], label: t.casualFallout.zones.seekShelter, desc: ZONE_DESCS[3] },
    { color: ZONE_COLORS[4], label: t.casualFallout.zones.caution, desc: ZONE_DESCS[4] },
  ]

  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [zoom] = useState(8)
  const [weaponIdx, setWeaponIdx] = useState(1)
  const [windSpeedIdx, setWindSpeedIdx] = useState(1)
  const [windDirIdx, setWindDirIdx] = useState(2)

  const weapon = WEAPONS[weaponIdx]
  const windSpeed = WIND_SPEEDS_LIST[windSpeedIdx]
  const windDir = WIND_DIRS_LIST[windDirIdx]

  const debouncedYield = useDebouncedValue(weapon.yieldKt, 100)
  const debouncedWindSpeed = useDebouncedValue(windSpeed.kmh, 100)
  const debouncedWindDir = useDebouncedValue(windDir.deg, 100)

  const contours = useMemo(() => {
    return generateFalloutContours({
      lat: center[0],
      lng: center[1],
      yieldKt: debouncedYield,
      windSpeedKmh: debouncedWindSpeed,
      windDirectionDeg: debouncedWindDir,
      surfaceBurst: true,
      fissionFraction: 0.5,
    })
  }, [center, debouncedYield, debouncedWindSpeed, debouncedWindDir])

  const handleCitySelect = useCallback((city: City) => {
    setCenter([city.lat, city.lng])
  }, [])

  return (
    <SectionWrapper id="c-fallout" fullHeight={false}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-black">{t.casualFallout.title}</h2>
          <p className="text-text-secondary max-w-2xl">
            {t.casualFallout.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div className="bg-bg-secondary rounded-xl border border-border p-4 space-y-4">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t.casualFallout.weapon}</h3>
              <div className="flex flex-col gap-2">
                {WEAPONS.map((w, i) => (
                  <button
                    key={w.name}
                    onClick={() => setWeaponIdx(i)}
                    className="px-3 py-2 rounded-lg text-sm font-semibold text-left border-2 transition-all"
                    style={{
                      borderColor: weapon.name === w.name ? w.color : 'transparent',
                      backgroundColor: weapon.name === w.name ? w.color + '20' : 'rgba(255,255,255,0.04)',
                      color: weapon.name === w.name ? w.color : '#94a3b8',
                    }}
                  >
                    {w.name} <span className="font-normal text-xs opacity-60">({w.yieldKt} kt)</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-bg-secondary rounded-xl border border-border p-4 space-y-4">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t.casualFallout.windSpeed}</h3>
              <div className="flex gap-2">
                {WIND_SPEEDS_LIST.map((ws, i) => (
                  <button
                    key={ws.label}
                    onClick={() => setWindSpeedIdx(i)}
                    className="flex-1 px-2 py-2 rounded-lg text-xs font-semibold border-2 transition-all"
                    style={{
                      borderColor: windSpeed.label === ws.label ? '#94a3b8' : 'transparent',
                      backgroundColor: windSpeed.label === ws.label ? 'rgba(148,163,184,0.15)' : 'rgba(255,255,255,0.04)',
                      color: windSpeed.label === ws.label ? '#e2e8f0' : '#64748b',
                    }}
                  >
                    {ws.label}
                    <div className="text-[10px] opacity-60">{ws.kmh} km/h</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-bg-secondary rounded-xl border border-border p-4 space-y-3">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">{t.casualFallout.windDirection}</h3>
              <div className="grid grid-cols-4 gap-1.5">
                {WIND_DIRS_LIST.map((wd, i) => (
                  <button
                    key={wd.label}
                    onClick={() => setWindDirIdx(i)}
                    className="py-2 rounded-lg text-xs font-bold border-2 transition-all"
                    style={{
                      borderColor: windDir.label === wd.label ? '#ef4444' : 'transparent',
                      backgroundColor: windDir.label === wd.label ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.04)',
                      color: windDir.label === wd.label ? '#fca5a5' : '#64748b',
                    }}
                  >
                    {wd.label}
                  </button>
                ))}
              </div>
            </div>

            <CitySearch onSelect={handleCitySelect} />
          </div>

          {/* Map */}
          <div className="space-y-3">
            <BaseMap center={center} zoom={zoom}>
              <MapUpdater center={center} zoom={zoom} />
              <FalloutPlume contours={contours} />
            </BaseMap>

            {/* Zone legend */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
              {ZONE_LABELS.map((z) => (
                <div key={z.label} className="flex items-start gap-2.5 text-xs">
                  <div
                    className="w-3 h-3 rounded-sm flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: z.color }}
                  />
                  <div>
                    <span className="font-bold text-text-primary">{z.label}</span>
                    <span className="text-text-muted ml-1">{z.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Survival tips */}
        <div className="bg-bg-secondary rounded-xl border border-border p-5 space-y-3">
          <h3 className="font-bold text-text-primary flex items-center gap-2">
            <span>⚠</span> {t.casualFallout.survivalTitle}
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {t.casualFallout.survivalTips.map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="text-yellow-400 mt-0.5 flex-shrink-0">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionWrapper>
  )
}
