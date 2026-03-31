import { useState, useMemo } from 'react'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { Slider } from '../../components/ui/Slider'
import { InfoCard } from '../../components/ui/InfoCard'
import { HOBCrossSection } from './HOBCrossSection'
import { HOBRadiusChart } from './HOBRadiusChart'
import { optimalHOB, effectiveGroundRadius } from '../../lib/physics/hob'
import { fireballRadius } from '../../lib/physics/fireball'
import { formatYield, formatDistance } from '../../lib/format'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { useTranslation } from '../../hooks/useTranslation'

export default function HeightOfBurst() {
  const [yieldKt, setYieldKt] = useState(15)
  const [hobMeters, setHobMeters] = useState(580)
  const [targetPsi, setTargetPsi] = useState(5)

  const t = useTranslation()
  const th = t.expert.hob

  const debouncedYield = useDebouncedValue(yieldKt, 100)
  const debouncedHOB = useDebouncedValue(hobMeters, 50)

  const stats = useMemo(() => {
    const optHob = optimalHOB(debouncedYield, targetPsi)
    const effectiveRadius = effectiveGroundRadius(debouncedYield, debouncedHOB, targetPsi)
    const surfaceRadius = effectiveGroundRadius(debouncedYield, 0, targetPsi)
    const optimalRadius = effectiveGroundRadius(debouncedYield, optHob, targetPsi)
    const fb = fireballRadius(debouncedYield) / 1000

    return {
      optimalHOB: optHob,
      effectiveRadius,
      surfaceRadius,
      optimalRadius,
      fireballRadiusKm: fb,
      enhancement: ((effectiveRadius / surfaceRadius - 1) * 100),
    }
  }, [debouncedYield, debouncedHOB, targetPsi])

  const maxHOB = Math.max(2000, stats.optimalHOB * 3)

  return (
    <SectionWrapper id="height-of-burst" fullHeight={false}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">
            {th.title}
          </h2>
          <p className="text-text-secondary max-w-3xl">
            {th.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* Controls */}
          <div className="space-y-4 bg-bg-secondary rounded-lg p-4 border border-border">
            <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">{th.parametersLabel}</h3>

            <Slider
              min={0.1}
              max={10000}
              value={yieldKt}
              onChange={setYieldKt}
              label={th.yieldLabel}
              logarithmic
              accentColor="#3b82f6"
              formatValue={formatYield}
            />

            <Slider
              min={0}
              max={maxHOB}
              value={hobMeters}
              onChange={setHobMeters}
              label={th.hobLabel}
              unit="m"
              accentColor="#f59e0b"
              formatValue={(v) => `${Math.round(v).toLocaleString()} m`}
            />

            <div className="space-y-1.5">
              <label className="text-sm text-text-secondary font-medium">{th.targetOverpressureLabel}</label>
              <div className="flex flex-wrap gap-1.5">
                {[1, 2, 5, 10, 20].map(psi => (
                  <button
                    key={psi}
                    onClick={() => setTargetPsi(psi)}
                    className={`text-xs px-2.5 py-1.5 rounded border transition-colors ${
                      targetPsi === psi
                        ? 'bg-blast/20 border-blast text-blast'
                        : 'bg-bg-card border-border text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {psi} psi
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setHobMeters(stats.optimalHOB)}
              className="w-full text-sm px-3 py-2 rounded bg-blast/10 border border-blast/30 text-blast hover:bg-blast/20 transition-colors"
            >
              {th.setOptimalButton} ({Math.round(stats.optimalHOB)} m)
            </button>

            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-sm text-text-secondary font-medium">{th.presetsLabel}</span>
              <button
                onClick={() => { setYieldKt(15); setHobMeters(580); setTargetPsi(5) }}
                className="w-full text-xs px-2 py-1.5 rounded bg-bg-card border border-border text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors text-left"
              >
                {th.presetHiroshima}
              </button>
              <button
                onClick={() => { setYieldKt(475); setHobMeters(0); setTargetPsi(5) }}
                className="w-full text-xs px-2 py-1.5 rounded bg-bg-card border border-border text-text-secondary hover:text-text-primary hover:border-text-muted transition-colors text-left"
              >
                {th.presetW88}
              </button>
            </div>

            <div className="bg-bg-primary rounded p-3 text-xs text-text-muted border border-border">
              <span className="text-blast font-semibold">{th.machStemLabel} </span>
              {th.machStemDesc}
            </div>
          </div>

          {/* Visualization */}
          <div className="space-y-4">
            <HOBCrossSection
              yieldKt={debouncedYield}
              hobMeters={debouncedHOB}
              targetPsi={targetPsi}
              optimalHOB={stats.optimalHOB}
            />
            <HOBRadiusChart
              yieldKt={debouncedYield}
              targetPsi={targetPsi}
              currentHOB={debouncedHOB}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <InfoCard
            label={th.stats.optimalHOB}
            value={stats.optimalHOB}
            accentColor="#f59e0b"
            formatValue={(v) => `${Math.round(v)} m`}
          />
          <InfoCard
            label={th.stats.effectiveRadius.replace('{psi}', String(targetPsi))}
            value={stats.effectiveRadius}
            accentColor="#3b82f6"
            formatValue={formatDistance}
          />
          <InfoCard
            label={th.stats.vsSurface}
            value={stats.enhancement}
            accentColor={stats.enhancement > 0 ? '#22c55e' : '#ef4444'}
            formatValue={(v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`}
          />
          <InfoCard
            label={th.stats.fireballRadius}
            value={stats.fireballRadiusKm * 1000}
            accentColor="#fbbf24"
            formatValue={(v) => `${Math.round(v)} m`}
          />
        </div>
      </div>
    </SectionWrapper>
  )
}
