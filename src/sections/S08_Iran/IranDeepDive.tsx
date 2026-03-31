import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { blastRadius } from '../../lib/physics/blast'
import { formatDistance } from '../../lib/format'

export default function IranDeepDive() {
  const yield400kt = 400
  const blast5psi = blastRadius(yield400kt, 5)
  const blast1psi = blastRadius(yield400kt, 1)

  return (
    <SectionWrapper id="iran" fullHeight={false}>
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">
            The Bunker Buster Problem — Fordow
          </h2>
          <p className="text-text-secondary max-w-3xl">
            Iran's Fordow Fuel Enrichment Plant is built into a mountain with ~80-90m of rock overburden.
            This depth exceeds the penetration capability of any conventional weapon, making it
            the canonical example of why deeply buried targets remain a nuclear question.
          </p>
        </div>

        {/* Fordow cross-section */}
        <div className="bg-bg-secondary rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold text-text-secondary mb-4">
            Fordow Facility Cross-Section — Weapon Penetration Comparison
          </h3>
          <svg viewBox="0 0 800 400" className="w-full" preserveAspectRatio="xMidYMid meet">
            {/* Mountain profile */}
            <path
              d="M 0 350 L 100 300 L 200 200 L 300 130 L 400 100 L 500 110 L 600 160 L 700 250 L 800 350 Z"
              fill="#2d1f0e"
              stroke="#8b7355"
              strokeWidth={1}
            />
            {/* Mountain surface detail */}
            <path
              d="M 0 350 L 100 300 L 200 200 L 300 130 L 400 100 L 500 110 L 600 160 L 700 250 L 800 350"
              fill="none"
              stroke="#a0855c"
              strokeWidth={2}
            />

            {/* Rock layers */}
            <path d="M 150 280 Q 400 200 650 280" fill="none" stroke="#6b5b3e" strokeWidth={0.5} opacity={0.5} />
            <path d="M 180 260 Q 400 180 620 260" fill="none" stroke="#6b5b3e" strokeWidth={0.5} opacity={0.5} />

            {/* Facility chambers */}
            <rect x={320} y={240} width={160} height={50} rx={5}
              fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth={1.5} />
            <text x={400} y={268} fill="#ef4444" fontSize={11} textAnchor="middle" fontFamily="Inter" fontWeight={600}>
              Enrichment Halls
            </text>

            {/* Tunnel entrance */}
            <rect x={200} y={270} width={60} height={20} rx={3}
              fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth={1} />
            <line x1={260} y1={280} x2={320} y2={265} stroke="#f59e0b" strokeWidth={1} strokeDasharray="4,2" />
            <text x={175} y={285} fill="#f59e0b" fontSize={9} textAnchor="end" fontFamily="Inter">Tunnel entrance</text>

            {/* Overburden measurement */}
            <line x1={400} y1={100} x2={400} y2={240} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4,4" />
            <text x={415} y={170} fill="#94a3b8" fontSize={10} fontFamily="Inter">80-90m rock</text>
            <line x1={395} y1={100} x2={405} y2={100} stroke="#94a3b8" strokeWidth={2} />
            <line x1={395} y1={240} x2={405} y2={240} stroke="#94a3b8" strokeWidth={2} />

            {/* Weapon penetration lines */}
            {/* GBU-28 */}
            <line x1={500} y1={110} x2={500} y2={145} stroke="#3b82f6" strokeWidth={2} />
            <circle cx={500} cy={145} r={4} fill="#3b82f6" />
            <text x={510} y={140} fill="#3b82f6" fontSize={9} fontFamily="Inter">GBU-28: ~30m</text>
            <text x={510} y={152} fill="#64748b" fontSize={8} fontFamily="Inter">(far short)</text>

            {/* GBU-57 MOP */}
            <line x1={560} y1={110} x2={560} y2={175} stroke="#f59e0b" strokeWidth={2} />
            <circle cx={560} cy={175} r={4} fill="#f59e0b" />
            <text x={570} y={170} fill="#f59e0b" fontSize={9} fontFamily="Inter">GBU-57 MOP: ~60m</text>
            <text x={570} y={182} fill="#64748b" fontSize={8} fontFamily="Inter">(doesn't reach)</text>

            {/* B61-11 physical + shock */}
            <line x1={620} y1={110} x2={620} y2={120} stroke="#ef4444" strokeWidth={2} />
            <circle cx={620} cy={120} r={4} fill="#ef4444" />
            <text x={630} y={118} fill="#ef4444" fontSize={9} fontFamily="Inter">B61-11: 6m physical</text>
            {/* Shock coupling */}
            <circle cx={620} cy={120} r={60} fill="none" stroke="#ef4444" strokeWidth={1} strokeDasharray="4,4" opacity={0.4} />
            <text x={630} y={200} fill="#ef4444" fontSize={9} fontFamily="Inter">Ground shock: ~200m</text>
            <text x={630} y={212} fill="#ef4444" fontSize={8} fontFamily="Inter" fontWeight={600}>(reaches facility)</text>

            {/* Ground level label */}
            <text x={50} y={310} fill="#8b7355" fontSize={10} fontFamily="Inter">Surface</text>

            {/* Legend */}
            <text x={20} y={380} fill="#94a3b8" fontSize={10} fontFamily="Inter" fontWeight={600}>
              "The physics gap that makes this a nuclear question"
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ground shock coupling */}
          <div className="bg-bg-secondary rounded-lg border border-border p-5 space-y-3">
            <h3 className="text-lg font-semibold text-fallout">Ground Shock Coupling</h3>
            <p className="text-sm text-text-secondary">
              A nuclear earth penetrator doesn't need to physically reach the target. A 400 kt
              detonation at 6m depth couples approximately <span className="text-fallout font-medium">20×
              more energy</span> into the ground compared to a surface burst.
            </p>
            <p className="text-sm text-text-secondary">
              The resulting ground shock propagates through rock at ~5 km/s, creating pressures
              sufficient to collapse underground chambers at distances of 100-200m — well beyond
              the physical penetration depth.
            </p>
            <div className="bg-bg-card rounded p-3 border border-border text-xs text-text-muted">
              However, the trade-off is catastrophic: a 400 kt ground burst produces
              <span className="text-fallout font-medium"> massive radioactive fallout</span>.
              Prevailing winds could carry contamination hundreds of kilometers.
            </div>
          </div>

          {/* Fallout comparison */}
          <div className="bg-bg-secondary rounded-lg border border-border p-5 space-y-3">
            <h3 className="text-lg font-semibold text-thermal">The Fallout Problem</h3>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <span className="text-xs px-2 py-0.5 rounded bg-fallout/20 text-fallout whitespace-nowrap">Ground Burst</span>
                <p className="text-sm text-text-secondary">
                  400 kt surface/shallow burst at Fordow: massive fallout plume extending
                  hundreds of km downwind. Tehran (125 km) potentially in the fallout path
                  depending on wind direction.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-xs px-2 py-0.5 rounded bg-blast/20 text-blast whitespace-nowrap">Airburst</span>
                <p className="text-sm text-text-secondary">
                  If the facility were above ground: a 400 kt airburst would produce minimal
                  local fallout. But an airburst cannot destroy a deeply buried target.
                </p>
              </div>
            </div>
            <div className="bg-bg-card rounded p-3 border border-border space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-text-muted">400 kt blast (5 psi):</span>
                <span className="text-blast">{formatDistance(blast5psi)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">400 kt blast (1 psi):</span>
                <span className="text-thermal">{formatDistance(blast1psi)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Tehran distance:</span>
                <span className="text-text-primary">~125 km from Fordow</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
