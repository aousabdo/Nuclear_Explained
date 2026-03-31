import { useMemo } from 'react'
import { scaleLinear } from 'd3-scale'
import { fireballRadius } from '../../lib/physics/fireball'
import { effectiveGroundRadius } from '../../lib/physics/hob'

interface HOBCrossSectionProps {
  yieldKt: number
  hobMeters: number
  targetPsi: number
  optimalHOB: number
}

export function HOBCrossSection({ yieldKt, hobMeters, targetPsi, optimalHOB }: HOBCrossSectionProps) {
  const width = 800
  const height = 400
  const margin = { top: 30, right: 30, bottom: 50, left: 70 }
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  const viz = useMemo(() => {
    const fb = fireballRadius(yieldKt) / 1000 // km
    const effectiveR = effectiveGroundRadius(yieldKt, hobMeters, targetPsi)
    const maxR = Math.max(effectiveR * 1.5, fb * 3, 2)
    const maxAlt = Math.max(hobMeters / 1000 * 1.5, 1, maxR * 0.6)

    const xScale = scaleLinear().domain([0, maxR]).range([0, innerW])
    const yScale = scaleLinear().domain([0, maxAlt]).range([innerH, 0])

    const burstX = xScale(0)
    const burstY = yScale(hobMeters / 1000)

    // Fireball circle
    const fbPixelR = Math.max(xScale(fb) - xScale(0), 4)

    // Effective damage radius on ground
    const damageX = xScale(effectiveR)

    // Optimal HOB line
    const optY = yScale(optimalHOB / 1000)

    // Incident wave arc (from burst point to ground)
    const incidentR = Math.sqrt((effectiveR) ** 2 + (hobMeters / 1000) ** 2)
    const incidentPixelR = xScale(incidentR) - xScale(0)

    // Mach stem region: triangular zone near ground where waves merge
    // Starts at roughly 0.8 * HOB ground distance, extends to effective radius
    const machStart = hobMeters / 1000 * 0.8
    const machStartX = xScale(machStart)
    const machEndX = damageX
    // Mach stem height decreases from formation point to effective radius
    const machHeight = hobMeters / 1000 * 0.3
    const machHeightY = yScale(machHeight)
    const groundY = yScale(0)

    return {
      xScale, yScale, burstX, burstY, fbPixelR, damageX,
      optY, incidentPixelR, machStartX, machEndX,
      machHeightY, groundY, maxR, maxAlt,
    }
  }, [yieldKt, hobMeters, targetPsi, optimalHOB, innerW, innerH])

  const xTicks = viz.xScale.ticks(6)
  const yTicks = viz.yScale.ticks(5)

  return (
    <div className="bg-bg-secondary rounded-lg border border-border p-4">
      <h4 className="text-sm font-semibold text-text-secondary mb-3">
        Cross-Section View — Blast Wave Propagation
      </h4>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Ground plane */}
          <rect x={0} y={viz.groundY} width={innerW} height={margin.bottom} fill="#1a1f2e" />
          <line x1={0} y1={viz.groundY} x2={innerW} y2={viz.groundY} stroke="#475569" strokeWidth={2} />

          {/* Grid lines */}
          {xTicks.map(t => (
            <line key={`x-${t}`} x1={viz.xScale(t)} y1={0} x2={viz.xScale(t)} y2={innerH}
              stroke="#1e293b" strokeWidth={0.5} />
          ))}
          {yTicks.map(t => (
            <line key={`y-${t}`} x1={0} y1={viz.yScale(t)} x2={innerW} y2={viz.yScale(t)}
              stroke="#1e293b" strokeWidth={0.5} />
          ))}

          {/* Mach stem region */}
          {hobMeters > 0 && (
            <polygon
              points={`${viz.machStartX},${viz.groundY} ${viz.machEndX},${viz.groundY} ${viz.machEndX},${viz.groundY - 5} ${(viz.machStartX + viz.machEndX) / 2},${viz.machHeightY} ${viz.machStartX},${viz.groundY - 5}`}
              fill="rgba(59, 130, 246, 0.15)"
              stroke="#3b82f6"
              strokeWidth={1}
              strokeDasharray="4,4"
            />
          )}

          {/* Incident wave arc */}
          {hobMeters > 0 && (
            <circle
              cx={viz.burstX}
              cy={viz.burstY}
              r={viz.incidentPixelR}
              fill="none"
              stroke="rgba(59, 130, 246, 0.3)"
              strokeWidth={1.5}
              strokeDasharray="6,4"
              clipPath="url(#above-ground)"
            />
          )}

          {/* Clip path for above ground */}
          <defs>
            <clipPath id="above-ground">
              <rect x={0} y={0} width={innerW} height={viz.groundY} />
            </clipPath>
          </defs>

          {/* Effective damage radius line */}
          <line
            x1={viz.damageX} y1={viz.groundY - 5}
            x2={viz.damageX} y2={viz.groundY + 5}
            stroke="#f97316" strokeWidth={2}
          />
          <line
            x1={0} y1={viz.groundY}
            x2={viz.damageX} y2={viz.groundY}
            stroke="#f97316" strokeWidth={2} opacity={0.5}
          />

          {/* Optimal HOB indicator */}
          <line
            x1={0} y1={viz.optY}
            x2={innerW} y2={viz.optY}
            stroke="#22c55e" strokeWidth={1} strokeDasharray="8,4" opacity={0.5}
          />
          <text x={innerW - 5} y={viz.optY - 5} fill="#22c55e" fontSize={10} textAnchor="end" fontFamily="Inter">
            Optimal HOB
          </text>

          {/* Fireball */}
          <circle
            cx={viz.burstX}
            cy={viz.burstY}
            r={viz.fbPixelR}
            fill="rgba(251, 191, 36, 0.3)"
            stroke="#fbbf24"
            strokeWidth={1.5}
          />

          {/* Burst point */}
          <circle cx={viz.burstX} cy={viz.burstY} r={4} fill="#ffffff" />

          {/* Mach stem label */}
          {hobMeters > 0 && (
            <text
              x={(viz.machStartX + viz.machEndX) / 2}
              y={viz.groundY - 15}
              fill="#3b82f6"
              fontSize={11}
              textAnchor="middle"
              fontFamily="Inter"
              fontWeight={600}
            >
              Mach Stem Region
            </text>
          )}

          {/* Axes labels */}
          {xTicks.map(t => (
            <text key={`xl-${t}`} x={viz.xScale(t)} y={innerH + 20} fill="#94a3b8" fontSize={10} textAnchor="middle" fontFamily="Inter">
              {t.toFixed(1)} km
            </text>
          ))}
          {yTicks.map(t => (
            <text key={`yl-${t}`} x={-10} y={viz.yScale(t) + 3} fill="#94a3b8" fontSize={10} textAnchor="end" fontFamily="Inter">
              {(t * 1000).toFixed(0)} m
            </text>
          ))}

          {/* Axis titles */}
          <text x={innerW / 2} y={innerH + 40} fill="#64748b" fontSize={11} textAnchor="middle" fontFamily="Inter">
            Ground Distance from Ground Zero
          </text>
          <text
            transform={`rotate(-90) translate(${-innerH / 2}, -50)`}
            fill="#64748b" fontSize={11} textAnchor="middle" fontFamily="Inter"
          >
            Altitude
          </text>
        </g>
      </svg>
    </div>
  )
}
