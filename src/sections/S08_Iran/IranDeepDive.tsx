import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { blastRadius } from '../../lib/physics/blast'
import { formatDistance } from '../../lib/format'
import { useTranslation } from '../../hooks/useTranslation'

export default function IranDeepDive() {
  const yield400kt = 400
  const blast5psi = blastRadius(yield400kt, 5)
  const blast1psi = blastRadius(yield400kt, 1)

  const t = useTranslation()
  const ti = t.expert.iran

  return (
    <SectionWrapper id="iran" fullHeight={false}>
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">
            {ti.title}
          </h2>
          <p className="text-text-secondary max-w-3xl">
            {ti.subtitle}
          </p>
        </div>

        {/* Fordow cross-section */}
        <div className="bg-bg-secondary rounded-lg border border-border p-4">
          <h3 className="text-sm font-semibold text-text-secondary mb-4">
            {ti.crossSectionTitle}
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
              {ti.enrichmentHalls}
            </text>

            {/* Tunnel entrance */}
            <rect x={200} y={270} width={60} height={20} rx={3}
              fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" strokeWidth={1} />
            <line x1={260} y1={280} x2={320} y2={265} stroke="#f59e0b" strokeWidth={1} strokeDasharray="4,2" />
            <text x={175} y={285} fill="#f59e0b" fontSize={9} textAnchor="end" fontFamily="Inter">{ti.tunnelEntrance}</text>

            {/* Overburden measurement */}
            <line x1={400} y1={100} x2={400} y2={240} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4,4" />
            <text x={415} y={170} fill="#94a3b8" fontSize={10} fontFamily="Inter">{ti.rockOverburden}</text>
            <line x1={395} y1={100} x2={405} y2={100} stroke="#94a3b8" strokeWidth={2} />
            <line x1={395} y1={240} x2={405} y2={240} stroke="#94a3b8" strokeWidth={2} />

            {/* Weapon penetration lines */}
            {/* GBU-28 */}
            <line x1={500} y1={110} x2={500} y2={145} stroke="#3b82f6" strokeWidth={2} />
            <circle cx={500} cy={145} r={4} fill="#3b82f6" />
            <text x={510} y={140} fill="#3b82f6" fontSize={9} fontFamily="Inter">{ti.gbu28Label}</text>
            <text x={510} y={152} fill="#64748b" fontSize={8} fontFamily="Inter">{ti.gbu28Note}</text>

            {/* GBU-57 MOP */}
            <line x1={560} y1={110} x2={560} y2={175} stroke="#f59e0b" strokeWidth={2} />
            <circle cx={560} cy={175} r={4} fill="#f59e0b" />
            <text x={570} y={170} fill="#f59e0b" fontSize={9} fontFamily="Inter">{ti.gbu57Label}</text>
            <text x={570} y={182} fill="#64748b" fontSize={8} fontFamily="Inter">{ti.gbu57Note}</text>

            {/* B61-11 physical + shock */}
            <line x1={620} y1={110} x2={620} y2={120} stroke="#ef4444" strokeWidth={2} />
            <circle cx={620} cy={120} r={4} fill="#ef4444" />
            <text x={630} y={118} fill="#ef4444" fontSize={9} fontFamily="Inter">{ti.b61Label}</text>
            {/* Shock coupling */}
            <circle cx={620} cy={120} r={60} fill="none" stroke="#ef4444" strokeWidth={1} strokeDasharray="4,4" opacity={0.4} />
            <text x={630} y={200} fill="#ef4444" fontSize={9} fontFamily="Inter">{ti.groundShockLabel}</text>
            <text x={630} y={212} fill="#ef4444" fontSize={8} fontFamily="Inter" fontWeight={600}>{ti.groundShockNote}</text>

            {/* Ground level label */}
            <text x={50} y={310} fill="#8b7355" fontSize={10} fontFamily="Inter">{ti.surfaceLabel}</text>

            {/* Legend */}
            <text x={20} y={380} fill="#94a3b8" fontSize={10} fontFamily="Inter" fontWeight={600}>
              {ti.physicsGapLabel}
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ground shock coupling */}
          <div className="bg-bg-secondary rounded-lg border border-border p-5 space-y-3">
            <h3 className="text-lg font-semibold text-fallout">{ti.groundShockTitle}</h3>
            <p className="text-sm text-text-secondary">
              {ti.groundShockBody1}
            </p>
            <p className="text-sm text-text-secondary">
              {ti.groundShockBody2}
            </p>
            <div className="bg-bg-card rounded p-3 border border-border text-xs text-text-muted">
              {ti.groundShockNote2}
            </div>
          </div>

          {/* Fallout comparison */}
          <div className="bg-bg-secondary rounded-lg border border-border p-5 space-y-3">
            <h3 className="text-lg font-semibold text-thermal">{ti.falloutProblemTitle}</h3>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <span className="text-xs px-2 py-0.5 rounded bg-fallout/20 text-fallout whitespace-nowrap">{ti.groundBurstLabel}</span>
                <p className="text-sm text-text-secondary">
                  {ti.groundBurstDesc}
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-xs px-2 py-0.5 rounded bg-blast/20 text-blast whitespace-nowrap">{ti.airburstLabel}</span>
                <p className="text-sm text-text-secondary">
                  {ti.airburstDesc}
                </p>
              </div>
            </div>
            <div className="bg-bg-card rounded p-3 border border-border space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-text-muted">{ti.blast5psiLabel}</span>
                <span className="text-blast">{formatDistance(blast5psi)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">{ti.blast1psiLabel}</span>
                <span className="text-thermal">{formatDistance(blast1psi)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">{ti.tehranDistance}</span>
                <span className="text-text-primary">{ti.tehranDistanceValue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
