import { useState, useMemo, useCallback } from 'react'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { BaseMap } from '../../components/map/BaseMap'
import { FalloutPlume } from '../../components/map/FalloutPlume'
import { MapUpdater } from '../../components/map/MapUpdater'
import { CitySearch } from '../../components/map/CitySearch'
import { Slider } from '../../components/ui/Slider'
import { InfoCard } from '../../components/ui/InfoCard'
import { Legend } from '../../components/ui/Legend'
import { generateFalloutContours } from '../../lib/physics/fallout'
import { formatYield } from '../../lib/format'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import type { City } from '../../data/cities'

const DEFAULT_CENTER: [number, number] = [37.0, -116.05]

interface Preset {
  label: string
  lat: number
  lng: number
  yieldKt: number
  windSpeed: number
  windDir: number
  surface: boolean
  zoom: number
}

const PRESETS: Preset[] = [
  { label: 'Fordow, Iran — 400 kt ground burst', lat: 34.884, lng: 51.263, yieldKt: 400, windSpeed: 30, windDir: 90, surface: true, zoom: 7 },
  { label: 'Hiroshima — 15 kt airburst', lat: 34.3853, lng: 132.4553, yieldKt: 15, windSpeed: 15, windDir: 180, surface: false, zoom: 10 },
  { label: 'Nevada Test Site — 100 kt surface', lat: 37.0, lng: -116.05, yieldKt: 100, windSpeed: 20, windDir: 45, surface: true, zoom: 8 },
]

export default function FalloutSimulator() {
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [zoom, setZoom] = useState(8)
  const [yieldKt, setYieldKt] = useState(100)
  const [windSpeed, setWindSpeed] = useState(20)
  const [windDir, setWindDir] = useState(90)
  const [surfaceBurst, setSurfaceBurst] = useState(true)
  const [fissionFraction, setFissionFraction] = useState(0.5)

  const debouncedYield = useDebouncedValue(yieldKt, 100)
  const debouncedWindSpeed = useDebouncedValue(windSpeed, 100)
  const debouncedWindDir = useDebouncedValue(windDir, 100)

  const contours = useMemo(() => {
    return generateFalloutContours({
      lat: center[0],
      lng: center[1],
      yieldKt: debouncedYield,
      windSpeedKmh: debouncedWindSpeed,
      windDirectionDeg: debouncedWindDir,
      surfaceBurst,
      fissionFraction,
    })
  }, [center, debouncedYield, debouncedWindSpeed, debouncedWindDir, surfaceBurst, fissionFraction])

  const handleCitySelect = useCallback((city: City) => {
    setCenter([city.lat, city.lng])
    setZoom(8)
  }, [])

  const applyPreset = useCallback((preset: Preset) => {
    setCenter([preset.lat, preset.lng])
    setYieldKt(preset.yieldKt)
    setWindSpeed(preset.windSpeed)
    setWindDir(preset.windDir)
    setSurfaceBurst(preset.surface)
    setZoom(preset.zoom)
  }, [])

  const legendItems = [
    { color: 'rgba(127, 29, 29, 0.8)', label: '>1000 rad/hr (lethal)' },
    { color: 'rgba(220, 38, 38, 0.7)', label: '300-1000 rad/hr' },
    { color: 'rgba(249, 115, 22, 0.6)', label: '100-300 rad/hr' },
    { color: 'rgba(234, 179, 8, 0.5)', label: '10-100 rad/hr' },
    { color: 'rgba(234, 179, 8, 0.3)', label: '1-10 rad/hr' },
  ]

  // Estimate plume extent
  const maxDownwind = contours.length > 0
    ? Math.max(...contours.flatMap(c => c.polygon.map(p => {
        const dlat = p[0] - center[0]
        const dlng = p[1] - center[1]
        return Math.sqrt(dlat * dlat + dlng * dlng) * 111
      })))
    : 0

  return (
    <SectionWrapper id="fallout" fullHeight={false}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">
            Fallout Plume Simulator
          </h2>
          <p className="text-text-secondary max-w-3xl">
            Visualize the downwind spread of radioactive fallout from a nuclear detonation.
            <span className="text-thermal font-medium"> Surface bursts</span> produce massive fallout as the fireball
            vaporizes soil and debris. <span className="text-blast font-medium">Airbursts</span> produce
            minimal local fallout — the fireball never touches the ground.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Controls */}
          <div className="space-y-4 bg-bg-secondary rounded-lg p-4 border border-border">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Parameters</h3>

            <CitySearch onSelect={handleCitySelect} />

            <Slider
              min={1}
              max={10000}
              value={yieldKt}
              onChange={setYieldKt}
              label="Yield"
              logarithmic
              accentColor="#ef4444"
              formatValue={formatYield}
            />

            {/* Burst type toggle */}
            <div className="space-y-1.5">
              <label className="text-sm text-text-secondary font-medium">Burst Type</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSurfaceBurst(true)}
                  className={`flex-1 text-xs px-3 py-2 rounded border transition-colors ${
                    surfaceBurst
                      ? 'bg-fallout/20 border-fallout text-fallout'
                      : 'bg-bg-card border-border text-text-secondary'
                  }`}
                >
                  Surface Burst
                </button>
                <button
                  onClick={() => setSurfaceBurst(false)}
                  className={`flex-1 text-xs px-3 py-2 rounded border transition-colors ${
                    !surfaceBurst
                      ? 'bg-blast/20 border-blast text-blast'
                      : 'bg-bg-card border-border text-text-secondary'
                  }`}
                >
                  Airburst
                </button>
              </div>
            </div>

            {!surfaceBurst && (
              <div className="bg-blast/10 rounded p-3 text-xs text-blast border border-blast/20">
                Airbursts produce minimal local fallout. The fireball doesn't contact the ground,
                so no soil or debris is activated and lofted into the atmosphere.
              </div>
            )}

            <Slider
              min={5}
              max={60}
              value={windSpeed}
              onChange={setWindSpeed}
              label="Wind Speed"
              unit="km/h"
              accentColor="#94a3b8"
            />

            <Slider
              min={0}
              max={360}
              value={windDir}
              onChange={setWindDir}
              label="Wind Direction (blowing toward)"
              accentColor="#94a3b8"
              formatValue={(v) => {
                const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
                return `${Math.round(v)}° (${dirs[Math.round(v / 45) % 8]})`
              }}
            />

            <Slider
              min={0.1}
              max={1}
              value={fissionFraction}
              onChange={setFissionFraction}
              label="Fission Fraction"
              step={0.05}
              accentColor="#22c55e"
              formatValue={(v) => `${(v * 100).toFixed(0)}%`}
            />

            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-sm text-text-secondary font-medium">Scenario Presets</span>
              {PRESETS.map(preset => (
                <button
                  key={preset.label}
                  onClick={() => applyPreset(preset)}
                  className="w-full text-xs px-2 py-1.5 rounded bg-bg-card border border-border text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors text-left"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="bg-bg-primary rounded p-3 text-xs text-text-muted border border-border">
              <span className="text-fallout font-semibold">Fallout decay: </span>
              Fission products follow the 7:10 rule — for every 7-fold increase in time,
              radiation decreases by a factor of 10. At 49 hours, dose rate is 1% of the 1-hour level.
            </div>
          </div>

          {/* Map */}
          <div className="space-y-3">
            <BaseMap center={center} zoom={zoom}>
              <MapUpdater center={center} zoom={zoom} />
              <FalloutPlume contours={contours} />
            </BaseMap>
            <Legend items={legendItems} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <InfoCard
            label="Plume Extent"
            value={maxDownwind}
            accentColor="#ef4444"
            formatValue={(v) => `${v.toFixed(0)} km`}
          />
          <InfoCard
            label="Wind Speed"
            value={windSpeed}
            unit="km/h"
            accentColor="#94a3b8"
          />
          <InfoCard
            label="Fission Yield"
            value={yieldKt * fissionFraction}
            accentColor="#22c55e"
            formatValue={formatYield}
          />
          <InfoCard
            label="Contour Zones"
            value={contours.length}
            accentColor="#f59e0b"
          />
        </div>
      </div>
    </SectionWrapper>
  )
}
