import { useState, useMemo } from 'react'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { Slider } from '../../components/ui/Slider'
import { blastArea } from '../../lib/physics/blast'
import { formatArea, formatYield } from '../../lib/format'
import { scaleLog, scaleLinear } from 'd3-scale'
import { useTranslation } from '../../hooks/useTranslation'

export default function CubeRoot() {
  const [numWarheads, setNumWarheads] = useState(10)
  const totalYield = 1000 // 1 Mt total budget

  const t = useTranslation()
  const tc = t.expert.cubeRoot

  const singleArea = blastArea(totalYield, 5)
  const mirvYield = totalYield / numWarheads
  const mirvAreaEach = blastArea(mirvYield, 5)
  const mirvAreaTotal = mirvAreaEach * numWarheads
  const advantage = mirvAreaTotal / singleArea

  // Scaling curve data
  const curveData = useMemo(() => {
    const points: Array<{ yield: number; area: number }> = []
    for (let y = 1; y <= 10000; y *= 1.2) {
      points.push({ yield: y, area: blastArea(y, 5) })
    }
    return points
  }, [])

  const width = 700
  const height = 250
  const margin = { top: 20, right: 30, bottom: 40, left: 70 }
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  const xScale = scaleLog().domain([1, 10000]).range([0, innerW])
  const yScale = scaleLinear().domain([0, Math.max(...curveData.map(p => p.area)) * 1.1]).range([innerH, 0])

  const pathD = curveData.map((p, i) => {
    const x = xScale(p.yield)
    const y = yScale(p.area)
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  // Linear reference (if area scaled linearly with yield)
  const linearPathD = curveData.map((p, i) => {
    const x = xScale(p.yield)
    const linearArea = curveData[0].area * (p.yield / curveData[0].yield)
    const y = yScale(Math.min(linearArea, yScale.domain()[1]))
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  return (
    <SectionWrapper id="cube-root" fullHeight={false}>
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">
            {tc.title}
          </h2>
          <p className="text-text-secondary max-w-3xl">
            {tc.subtitle}
          </p>
        </div>

        {/* MIRV comparison */}
        <div className="bg-bg-secondary rounded-lg border border-border p-6 space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">
            {tc.mirvTitle} {numWarheads} × {formatYield(mirvYield)} {tc.mirvVs} 1 × {formatYield(totalYield)}
          </h3>
          <p className="text-sm text-text-muted">
            {tc.mirvFixedBudget} {formatYield(totalYield)} {tc.mirvDistribute}
          </p>

          <Slider
            min={1}
            max={20}
            value={numWarheads}
            onChange={(v) => setNumWarheads(Math.round(v))}
            label={tc.numWarheadsLabel}
            step={1}
            accentColor="#3b82f6"
            formatValue={(v) => `${Math.round(v)} ${tc.warheadsUnit}`}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-bg-card rounded-lg p-4 border border-border">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{tc.singleWarheadLabel}</p>
              <p className="text-2xl font-bold text-fallout">{formatArea(singleArea)}</p>
              <p className="text-xs text-text-muted">1 × {formatYield(totalYield)}</p>
            </div>
            <div className="bg-bg-card rounded-lg p-4 border border-border">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{tc.mirvedLabel} ({numWarheads}×)</p>
              <p className="text-2xl font-bold text-blast">{formatArea(mirvAreaTotal)}</p>
              <p className="text-xs text-text-muted">{numWarheads} × {formatYield(mirvYield)}</p>
            </div>
            <div className="bg-bg-card rounded-lg p-4 border border-border">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{tc.mirvAdvantageLabel}</p>
              <p className="text-2xl font-bold text-radiation">{advantage.toFixed(1)}×</p>
              <p className="text-xs text-text-muted">{tc.moreAreaDestroyed}</p>
            </div>
          </div>
        </div>

        {/* Scaling curve */}
        <div className="bg-bg-secondary rounded-lg border border-border p-4">
          <h4 className="text-sm font-semibold text-text-secondary mb-3">
            {tc.chartTitle}
          </h4>
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
            <g transform={`translate(${margin.left},${margin.top})`}>
              {/* Grid */}
              {[1, 10, 100, 1000, 10000].map(tick => (
                <line key={`x-${tick}`} x1={xScale(tick)} y1={0} x2={xScale(tick)} y2={innerH}
                  stroke="#1e293b" strokeWidth={0.5} />
              ))}

              {/* Linear reference (if it were proportional) */}
              <path d={linearPathD} fill="none" stroke="#475569" strokeWidth={1} strokeDasharray="4,4" />
              <text x={innerW - 5} y={15} fill="#475569" fontSize={9} textAnchor="end" fontFamily="Inter">
                {tc.linearRefLabel}
              </text>

              {/* Actual curve */}
              <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth={2.5} />
              <text x={innerW - 5} y={yScale(curveData[curveData.length - 1].area) - 5}
                fill="#3b82f6" fontSize={9} textAnchor="end" fontFamily="Inter" fontWeight={600}>
                {tc.actualCurveLabel}
              </text>

              {/* Axes */}
              {[1, 10, 100, 1000, 10000].map(tick => (
                <text key={`xl-${tick}`} x={xScale(tick)} y={innerH + 18} fill="#94a3b8" fontSize={9}
                  textAnchor="middle" fontFamily="Inter">
                  {formatYield(tick)}
                </text>
              ))}
              {yScale.ticks(5).map(tick => (
                <text key={`yl-${tick}`} x={-10} y={yScale(tick) + 3} fill="#94a3b8" fontSize={9}
                  textAnchor="end" fontFamily="Inter">
                  {formatArea(tick)}
                </text>
              ))}

              <text x={innerW / 2} y={innerH + 35} fill="#64748b" fontSize={10} textAnchor="middle" fontFamily="Inter">
                {tc.xAxisLabel}
              </text>
              <text transform={`rotate(-90) translate(${-innerH / 2}, -55)`} fill="#64748b" fontSize={10}
                textAnchor="middle" fontFamily="Inter">
                {tc.yAxisLabel}
              </text>
            </g>
          </svg>
        </div>
      </div>
    </SectionWrapper>
  )
}
