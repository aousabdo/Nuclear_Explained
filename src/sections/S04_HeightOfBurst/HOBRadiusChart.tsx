import { useMemo } from 'react'
import { scaleLinear } from 'd3-scale'
import { effectiveGroundRadius, optimalHOB } from '../../lib/physics/hob'

interface HOBRadiusChartProps {
  yieldKt: number
  targetPsi: number
  currentHOB: number
}

export function HOBRadiusChart({ yieldKt, targetPsi, currentHOB }: HOBRadiusChartProps) {
  const width = 800
  const height = 250
  const margin = { top: 20, right: 30, bottom: 40, left: 70 }
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  const data = useMemo(() => {
    const optHob = optimalHOB(yieldKt, targetPsi)
    const maxHOB = optHob * 3
    const points: Array<{ hob: number; radius: number }> = []

    for (let h = 0; h <= maxHOB; h += maxHOB / 80) {
      points.push({
        hob: h,
        radius: effectiveGroundRadius(yieldKt, h, targetPsi),
      })
    }

    return { points, optHob, maxHOB }
  }, [yieldKt, targetPsi])

  const viz = useMemo(() => {
    const maxRadius = Math.max(...data.points.map(p => p.radius)) * 1.1
    const xScale = scaleLinear().domain([0, data.maxHOB]).range([0, innerW])
    const yScale = scaleLinear().domain([0, maxRadius]).range([innerH, 0])

    const pathD = data.points.map((p, i) => {
      const x = xScale(p.hob)
      const y = yScale(p.radius)
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')

    return { xScale, yScale, pathD, maxRadius }
  }, [data, innerW, innerH])

  const currentRadius = effectiveGroundRadius(yieldKt, currentHOB, targetPsi)
  const optRadius = effectiveGroundRadius(yieldKt, data.optHob, targetPsi)

  return (
    <div className="bg-bg-secondary rounded-lg border border-border p-4">
      <h4 className="text-sm font-semibold text-text-secondary mb-3">
        Destruction Radius vs. Height of Burst — {targetPsi} psi target
      </h4>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Grid */}
          {viz.xScale.ticks(6).map(t => (
            <line key={`x-${t}`} x1={viz.xScale(t)} y1={0} x2={viz.xScale(t)} y2={innerH}
              stroke="#1e293b" strokeWidth={0.5} />
          ))}
          {viz.yScale.ticks(5).map(t => (
            <line key={`y-${t}`} x1={0} y1={viz.yScale(t)} x2={innerW} y2={viz.yScale(t)}
              stroke="#1e293b" strokeWidth={0.5} />
          ))}

          {/* Curve */}
          <path d={viz.pathD} fill="none" stroke="#3b82f6" strokeWidth={2} />

          {/* Optimal HOB marker */}
          <line
            x1={viz.xScale(data.optHob)} y1={0}
            x2={viz.xScale(data.optHob)} y2={innerH}
            stroke="#22c55e" strokeWidth={1} strokeDasharray="4,4"
          />
          <circle
            cx={viz.xScale(data.optHob)}
            cy={viz.yScale(optRadius)}
            r={5} fill="#22c55e" stroke="#0a0e1a" strokeWidth={2}
          />
          <text
            x={viz.xScale(data.optHob) + 8}
            y={viz.yScale(optRadius) - 8}
            fill="#22c55e" fontSize={10} fontFamily="Inter"
          >
            Optimal ({Math.round(data.optHob)} m)
          </text>

          {/* Current HOB marker */}
          <line
            x1={viz.xScale(currentHOB)} y1={0}
            x2={viz.xScale(currentHOB)} y2={innerH}
            stroke="#f59e0b" strokeWidth={1} strokeDasharray="4,4"
          />
          <circle
            cx={viz.xScale(currentHOB)}
            cy={viz.yScale(currentRadius)}
            r={5} fill="#f59e0b" stroke="#0a0e1a" strokeWidth={2}
          />

          {/* Axes labels */}
          {viz.xScale.ticks(6).map(t => (
            <text key={`xl-${t}`} x={viz.xScale(t)} y={innerH + 18} fill="#94a3b8" fontSize={10}
              textAnchor="middle" fontFamily="Inter">
              {Math.round(t)} m
            </text>
          ))}
          {viz.yScale.ticks(5).map(t => (
            <text key={`yl-${t}`} x={-10} y={viz.yScale(t) + 3} fill="#94a3b8" fontSize={10}
              textAnchor="end" fontFamily="Inter">
              {t.toFixed(1)} km
            </text>
          ))}

          <text x={innerW / 2} y={innerH + 35} fill="#64748b" fontSize={11} textAnchor="middle" fontFamily="Inter">
            Height of Burst (meters)
          </text>
          <text transform={`rotate(-90) translate(${-innerH / 2}, -50)`} fill="#64748b" fontSize={11}
            textAnchor="middle" fontFamily="Inter">
            {targetPsi} psi Radius (km)
          </text>
        </g>
      </svg>
    </div>
  )
}
