import { useState, useMemo, useCallback } from 'react'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { BaseMap } from '../../components/map/BaseMap'
import { FalloutPlume } from '../../components/map/FalloutPlume'
import { MapUpdater } from '../../components/map/MapUpdater'
import { CitySearch } from '../../components/map/CitySearch'
import { generateFalloutContours } from '../../lib/physics/fallout'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import type { City } from '../../data/cities'

const DEFAULT_CENTER: [number, number] = [38.9072, -77.0369] // Washington D.C.

const WEAPONS = [
  { name: 'Little Boy', yieldKt: 15, color: '#f59e0b' },
  { name: 'Modern Warhead', yieldKt: 100, color: '#3b82f6' },
  { name: 'City Buster', yieldKt: 475, color: '#ef4444' },
]

const WIND_SPEEDS = [
  { label: 'Calm', kmh: 10 },
  { label: 'Moderate', kmh: 30 },
  { label: 'Strong', kmh: 60 },
]

const WIND_DIRS = [
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
  { color: 'rgba(127,29,29,0.85)', label: 'Immediately Fatal', desc: 'Lethal within minutes. No shelter is adequate.' },
  { color: 'rgba(220,38,38,0.75)', label: 'Extremely Dangerous', desc: 'Lethal within hours without treatment.' },
  { color: 'rgba(249,115,22,0.65)', label: 'Danger Zone', desc: 'Serious illness. Evacuate or shelter deeply.' },
  { color: 'rgba(234,179,8,0.55)', label: 'Seek Shelter', desc: 'Stay indoors, close all windows and vents.' },
  { color: 'rgba(134,239,172,0.45)', label: 'Caution', desc: 'Minimize outdoor exposure.' },
]

const SURVIVAL_TIPS = [
  'Stay inside a concrete or brick building',
  'Close all windows, doors, and vents',
  'Shower and change clothes if exposed',
  'Do not eat garden produce',
  'Monitor official broadcasts',
  'The first 24 hours are the most dangerous',
]

export default function CasualFallout() {
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [zoom] = useState(8)
  const [weapon, setWeapon] = useState(WEAPONS[1])
  const [windSpeed, setWindSpeed] = useState(WIND_SPEEDS[1])
  const [windDir, setWindDir] = useState(WIND_DIRS[2])

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
          <h2 className="text-3xl md:text-4xl font-black">The Invisible Danger</h2>
          <p className="text-text-secondary max-w-2xl">
            Radioactive fallout drifts downwind for hundreds of miles after a surface burst. It's invisible, odorless, and lethal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div className="bg-bg-secondary rounded-xl border border-border p-4 space-y-4">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Weapon</h3>
              <div className="flex flex-col gap-2">
                {WEAPONS.map((w) => (
                  <button
                    key={w.name}
                    onClick={() => setWeapon(w)}
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
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Wind Speed</h3>
              <div className="flex gap-2">
                {WIND_SPEEDS.map((ws) => (
                  <button
                    key={ws.label}
                    onClick={() => setWindSpeed(ws)}
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
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Wind Direction</h3>
              <div className="grid grid-cols-4 gap-1.5">
                {WIND_DIRS.map((wd) => (
                  <button
                    key={wd.label}
                    onClick={() => setWindDir(wd)}
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
            <span>⚠</span> If You Are in the Fallout Zone
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {SURVIVAL_TIPS.map((tip) => (
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
