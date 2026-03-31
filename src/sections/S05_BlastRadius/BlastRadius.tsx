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
import { useTranslation } from '../../hooks/useTranslation'
import type { City } from '../../data/cities'

const DEFAULT_CENTER: [number, number] = [34.884, 51.263] // Fordow, Iran

export default function BlastRadius() {
  const [yieldKt, setYieldKt] = useState(100)
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [cityName, setCityName] = useState('Nevada Test Site')
  const [zoom, setZoom] = useState(10)

  const t = useTranslation()
  const tb = t.expert.blast

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
    { radiusKm: effects.fireball, color: EFFECT_RING_COLORS.fireball, label: tb.rings.fireball },
    { radiusKm: effects.psi20, color: EFFECT_RING_COLORS.psi20, label: tb.rings.heavyBlast },
    { radiusKm: effects.psi5, color: EFFECT_RING_COLORS.psi5, label: tb.rings.severeDamage },
    { radiusKm: effects.psi2, color: EFFECT_RING_COLORS.psi2, label: tb.rings.moderateDamage },
    { radiusKm: effects.psi1, color: EFFECT_RING_COLORS.psi1, label: tb.rings.lightDamage },
    { radiusKm: effects.thermal3, color: EFFECT_RING_COLORS.thermalBurn3, label: tb.rings.burns3rd, dashed: true },
    { radiusKm: effects.thermal1, color: EFFECT_RING_COLORS.thermalBurn1, label: tb.rings.burns1st, dashed: true },
    { radiusKm: effects.radiation, color: EFFECT_RING_COLORS.radiationLethal, label: tb.rings.lethalRad, dashed: true },
  ].filter(r => r.radiusKm > 0.001), [effects, tb.rings])

  const legendItems = [
    { color: EFFECT_RING_COLORS.fireball, label: tb.legend.fireball },
    { color: EFFECT_RING_COLORS.psi20, label: tb.legend.psi20 },
    { color: EFFECT_RING_COLORS.psi5, label: tb.legend.psi5 },
    { color: EFFECT_RING_COLORS.psi2, label: tb.legend.psi2 },
    { color: EFFECT_RING_COLORS.psi1, label: tb.legend.psi1 },
    { color: EFFECT_RING_COLORS.thermalBurn3, label: tb.legend.burns3rd, dashed: true },
    { color: EFFECT_RING_COLORS.thermalBurn1, label: tb.legend.burns1st, dashed: true },
    { color: EFFECT_RING_COLORS.radiationLethal, label: tb.legend.lethalRad, dashed: true },
  ]

  return (
    <SectionWrapper id="blast-radius" fullHeight={false}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">
            {tb.title}
          </h2>
          <p className="text-text-secondary max-w-2xl">
            {tb.subtitle}
          </p>
          <p className="text-text-muted text-xs max-w-2xl">
            {tb.sourceNote}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Controls */}
          <div className="space-y-4 bg-bg-secondary rounded-lg p-4 border border-border">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">{tb.parametersLabel}</h3>

            {/* Weapon preset */}
            <div className="space-y-1.5">
              <label className="text-sm text-text-secondary font-medium">{tb.weaponPresetLabel}</label>
              <select
                onChange={handlePresetSelect}
                className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blast appearance-none cursor-pointer"
              >
                <option value="">{tb.customYield}</option>
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
              label={tb.yieldLabel}
              logarithmic
              accentColor="#ef4444"
              formatValue={formatYield}
            />

            {/* City search */}
            <CitySearch onSelect={handleCitySelect} value={cityName} />

            {/* Quick yield presets */}
            <div className="space-y-1.5">
              <span className="text-sm text-text-secondary font-medium">{tb.quickSelectLabel}</span>
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
              <span className="text-thermal font-semibold">{tb.cubeRootLabel} </span>
              {tb.cubeRootDesc}
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
            label={tb.stats.fireball}
            value={effects.fireball * 2}
            accentColor={EFFECT_RING_COLORS.fireball}
            formatValue={(v) => formatDistance(v)}
            icon="🔥"
          />
          <InfoCard
            label={tb.stats.totalDestruction}
            value={effects.psi20}
            accentColor={EFFECT_RING_COLORS.psi20}
            formatValue={formatDistance}
          />
          <InfoCard
            label={tb.stats.severeDamage}
            value={effects.psi5}
            accentColor={EFFECT_RING_COLORS.psi5}
            formatValue={formatDistance}
          />
          <InfoCard
            label={tb.stats.lightDamage}
            value={effects.psi1}
            accentColor={EFFECT_RING_COLORS.psi1}
            formatValue={formatDistance}
          />
          <InfoCard
            label={tb.stats.area5psi}
            value={effects.areaPsi5}
            accentColor={EFFECT_RING_COLORS.psi5}
            formatValue={formatArea}
          />
          <InfoCard
            label={tb.stats.area1psi}
            value={effects.areaPsi1}
            accentColor={EFFECT_RING_COLORS.psi1}
            formatValue={formatArea}
          />
        </div>
      </div>
    </SectionWrapper>
  )
}
