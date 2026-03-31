import { useState, useMemo, useCallback } from 'react'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { BaseMap } from '../../components/map/BaseMap'
import { EffectRings, type EffectRing } from '../../components/map/EffectRings'
import { MapUpdater } from '../../components/map/MapUpdater'
import { CitySearch } from '../../components/map/CitySearch'
import { Slider } from '../../components/ui/Slider'
import { InfoCard } from '../../components/ui/InfoCard'
import { Legend } from '../../components/ui/Legend'
import { blastRadius, blastArea } from '../../lib/physics/blast'
import { fireballRadius } from '../../lib/physics/fireball'
import { thermalRadius } from '../../lib/physics/thermal'
import { promptRadiationRadius } from '../../lib/physics/radiation'
import { formatYield, formatDistance, formatArea } from '../../lib/format'
import { WEAPON_PRESETS } from '../../data/weapons'
import { EFFECT_RING_COLORS } from '../../theme/colors'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import type { City } from '../../data/cities'

const DEFAULT_CENTER: [number, number] = [37.0, -116.05] // Nevada Test Site

export default function BlastRadius() {
  const [yieldKt, setYieldKt] = useState(100)
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [cityName, setCityName] = useState('Nevada Test Site')
  const [zoom, setZoom] = useState(10)

  const debouncedYield = useDebouncedValue(yieldKt, 100)

  const handleCitySelect = useCallback((city: City) => {
    setCenter([city.lat, city.lng])
    setCityName(city.name)
    setZoom(city.population && city.population > 5000000 ? 10 : 11)
  }, [])

  const handlePresetSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const preset = WEAPON_PRESETS.find(w => w.name === e.target.value)
    if (preset) setYieldKt(preset.yieldKt)
  }, [])

  const effects = useMemo(() => {
    const y = debouncedYield
    return {
      fireball: fireballRadius(y) / 1000, // Convert m to km
      psi20: blastRadius(y, 20),
      psi5: blastRadius(y, 5),
      psi2: blastRadius(y, 2),
      psi1: blastRadius(y, 1),
      thermal3: thermalRadius(y, 8),
      thermal1: thermalRadius(y, 3),
      radiation: promptRadiationRadius(y, 500),
      areaPsi5: blastArea(y, 5),
      areaPsi1: blastArea(y, 1),
    }
  }, [debouncedYield])

  const rings: EffectRing[] = useMemo(() => [
    { radiusKm: effects.fireball, color: EFFECT_RING_COLORS.fireball, label: 'Fireball' },
    { radiusKm: effects.psi20, color: EFFECT_RING_COLORS.psi20, label: 'Heavy blast (20 psi)' },
    { radiusKm: effects.psi5, color: EFFECT_RING_COLORS.psi5, label: 'Severe damage (5 psi)' },
    { radiusKm: effects.psi2, color: EFFECT_RING_COLORS.psi2, label: 'Moderate damage (2 psi)' },
    { radiusKm: effects.psi1, color: EFFECT_RING_COLORS.psi1, label: 'Light damage (1 psi)' },
    { radiusKm: effects.thermal3, color: EFFECT_RING_COLORS.thermalBurn3, label: '3rd degree burns', dashed: true },
    { radiusKm: effects.thermal1, color: EFFECT_RING_COLORS.thermalBurn1, label: '1st degree burns', dashed: true },
    { radiusKm: effects.radiation, color: EFFECT_RING_COLORS.radiationLethal, label: 'Lethal radiation (500 rem)', dashed: true },
  ].filter(r => r.radiusKm > 0.001), [effects])

  const legendItems = [
    { color: EFFECT_RING_COLORS.fireball, label: 'Fireball' },
    { color: EFFECT_RING_COLORS.psi20, label: '20 psi' },
    { color: EFFECT_RING_COLORS.psi5, label: '5 psi' },
    { color: EFFECT_RING_COLORS.psi2, label: '2 psi' },
    { color: EFFECT_RING_COLORS.psi1, label: '1 psi' },
    { color: EFFECT_RING_COLORS.thermalBurn3, label: '3rd° burns', dashed: true },
    { color: EFFECT_RING_COLORS.thermalBurn1, label: '1st° burns', dashed: true },
    { color: EFFECT_RING_COLORS.radiationLethal, label: 'Lethal rad.', dashed: true },
  ]

  return (
    <SectionWrapper id="blast-radius" fullHeight={false}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">
            Blast Radius Calculator
          </h2>
          <p className="text-text-secondary max-w-2xl">
            Visualize the destructive radius of a nuclear detonation. Select a yield and location
            to see the concentric zones of blast overpressure, thermal radiation, and prompt nuclear radiation.
          </p>
          <p className="text-text-muted text-xs max-w-2xl">
            Based on scaling laws from Glasstone & Dolan, "Effects of Nuclear Weapons" (1977).
            These are simplified educational models — actual effects depend on terrain, weather, and weapon design.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Controls */}
          <div className="space-y-4 bg-bg-secondary rounded-lg p-4 border border-border">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Parameters</h3>

            {/* Weapon preset */}
            <div className="space-y-1.5">
              <label className="text-sm text-text-secondary font-medium">Weapon Preset</label>
              <select
                onChange={handlePresetSelect}
                className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blast appearance-none cursor-pointer"
              >
                <option value="">Custom yield...</option>
                {WEAPON_PRESETS.map(w => (
                  <option key={w.name} value={w.name}>
                    {w.name} ({formatYield(w.yieldKt)})
                  </option>
                ))}
              </select>
            </div>

            {/* Yield slider */}
            <Slider
              min={0.01}
              max={100000}
              value={yieldKt}
              onChange={setYieldKt}
              label="Yield"
              logarithmic
              accentColor="#ef4444"
              formatValue={formatYield}
            />

            {/* City search */}
            <CitySearch onSelect={handleCitySelect} value={cityName} />

            {/* Quick yield presets */}
            <div className="space-y-1.5">
              <span className="text-sm text-text-secondary font-medium">Quick Select</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Hiroshima', yield: 15 },
                  { label: '100 kt', yield: 100 },
                  { label: '500 kt', yield: 500 },
                  { label: '1 Mt', yield: 1000 },
                  { label: 'Tsar Bomba', yield: 50000 },
                ].map(p => (
                  <button
                    key={p.label}
                    onClick={() => setYieldKt(p.yield)}
                    className="text-xs px-2 py-1 rounded bg-bg-card border border-border text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scaling law note */}
            <div className="bg-bg-primary rounded p-3 text-xs text-text-muted border border-border">
              <span className="text-thermal font-semibold">Cube root scaling: </span>
              r ∝ Y<sup>1/3</sup> — doubling the yield only increases radius by 26%.
              To double the blast radius, you need 8× the yield.
            </div>
          </div>

          {/* Map */}
          <div className="space-y-3">
            <BaseMap center={center} zoom={zoom}>
              <MapUpdater center={center} zoom={zoom} />
              <EffectRings center={center} rings={rings} />
            </BaseMap>
            <Legend items={legendItems} />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <InfoCard
            label="Fireball"
            value={effects.fireball * 2}
            accentColor={EFFECT_RING_COLORS.fireball}
            formatValue={(v) => formatDistance(v)}
            icon="🔥"
          />
          <InfoCard
            label="Total Destruction"
            value={effects.psi20}
            accentColor={EFFECT_RING_COLORS.psi20}
            formatValue={formatDistance}
          />
          <InfoCard
            label="Severe Damage"
            value={effects.psi5}
            accentColor={EFFECT_RING_COLORS.psi5}
            formatValue={formatDistance}
          />
          <InfoCard
            label="Light Damage"
            value={effects.psi1}
            accentColor={EFFECT_RING_COLORS.psi1}
            formatValue={formatDistance}
          />
          <InfoCard
            label="Area (5 psi)"
            value={effects.areaPsi5}
            accentColor={EFFECT_RING_COLORS.psi5}
            formatValue={formatArea}
          />
          <InfoCard
            label="Area (1 psi)"
            value={effects.areaPsi1}
            accentColor={EFFECT_RING_COLORS.psi1}
            formatValue={formatArea}
          />
        </div>
      </div>
    </SectionWrapper>
  )
}
