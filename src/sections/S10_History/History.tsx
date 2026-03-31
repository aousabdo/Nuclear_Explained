import { useState, useMemo } from 'react'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { scaleLinear, scaleLog } from 'd3-scale'
import { formatYield } from '../../lib/format'

interface NuclearTest {
  name: string
  year: number
  month: number
  yieldKt: number
  country: string
  notable?: boolean
}

const TESTS: NuclearTest[] = [
  { name: 'Trinity', year: 1945, month: 7, yieldKt: 21, country: 'US', notable: true },
  { name: 'Hiroshima', year: 1945, month: 8, yieldKt: 15, country: 'US', notable: true },
  { name: 'Nagasaki', year: 1945, month: 8, yieldKt: 21, country: 'US', notable: true },
  { name: 'Joe-1', year: 1949, month: 8, yieldKt: 22, country: 'USSR', notable: true },
  { name: 'Ivy Mike', year: 1952, month: 11, yieldKt: 10400, country: 'US', notable: true },
  { name: 'Castle Bravo', year: 1954, month: 3, yieldKt: 15000, country: 'US', notable: true },
  { name: 'Tsar Bomba', year: 1961, month: 10, yieldKt: 50000, country: 'USSR', notable: true },
  { name: 'Starfish Prime', year: 1962, month: 7, yieldKt: 1400, country: 'US', notable: true },
  { name: 'Canopus', year: 1968, month: 8, yieldKt: 2600, country: 'France' },
  { name: 'Chagai-I', year: 1998, month: 5, yieldKt: 40, country: 'Pakistan', notable: true },
  { name: 'Pokhran-II', year: 1998, month: 5, yieldKt: 45, country: 'India', notable: true },
  { name: 'DPRK-1', year: 2006, month: 10, yieldKt: 1, country: 'DPRK', notable: true },
  { name: 'DPRK-6', year: 2017, month: 9, yieldKt: 250, country: 'DPRK', notable: true },
]

const COUNTRY_COLORS: Record<string, string> = {
  US: '#3b82f6',
  USSR: '#ef4444',
  UK: '#f59e0b',
  France: '#a855f7',
  China: '#22c55e',
  India: '#f97316',
  Pakistan: '#06b6d4',
  DPRK: '#e879f9',
}

const COUNTRY_TESTS: Record<string, number> = {
  US: 1032, USSR: 727, UK: 45, France: 210, China: 45, India: 6, Pakistan: 6, DPRK: 6,
}

export default function History() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  const filteredTests = useMemo(() => {
    if (!selectedCountry) return TESTS
    return TESTS.filter(t => t.country === selectedCountry)
  }, [selectedCountry])

  const width = 800
  const height = 300
  const margin = { top: 30, right: 30, bottom: 50, left: 70 }
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  const xScale = scaleLinear().domain([1945, 2020]).range([0, innerW])
  const yScale = scaleLog().domain([0.5, 60000]).range([innerH, 0])

  return (
    <SectionWrapper id="history" fullHeight={false}>
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">
            Nuclear Testing History
          </h2>
          <p className="text-text-secondary max-w-3xl">
            Between 1945 and 2017, nine nations conducted over 2,000 nuclear tests.
            The Comprehensive Nuclear-Test-Ban Treaty (1996) has been signed but not
            entered into force. The most recent test was by North Korea in September 2017.
          </p>
        </div>

        {/* Country filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCountry(null)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              !selectedCountry ? 'bg-text-secondary/20 text-text-primary border-text-secondary/30' : 'border-border text-text-muted'
            }`}
          >
            All ({Object.values(COUNTRY_TESTS).reduce((a, b) => a + b, 0)})
          </button>
          {Object.entries(COUNTRY_COLORS).map(([country, color]) => (
            <button
              key={country}
              onClick={() => setSelectedCountry(selectedCountry === country ? null : country)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors`}
              style={{
                borderColor: selectedCountry === country ? color : '#1e293b',
                backgroundColor: selectedCountry === country ? color + '20' : 'transparent',
                color: selectedCountry === country ? color : '#94a3b8',
              }}
            >
              {country} ({COUNTRY_TESTS[country]})
            </button>
          ))}
        </div>

        {/* Timeline chart */}
        <div className="bg-bg-secondary rounded-lg border border-border p-4">
          <h4 className="text-sm font-semibold text-text-secondary mb-3">
            Notable Nuclear Tests — Yield vs. Time
          </h4>
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
            <g transform={`translate(${margin.left},${margin.top})`}>
              {/* CTBT line */}
              <line x1={xScale(1996)} y1={0} x2={xScale(1996)} y2={innerH}
                stroke="#475569" strokeWidth={1} strokeDasharray="4,4" />
              <text x={xScale(1996) + 5} y={15} fill="#475569" fontSize={9} fontFamily="Inter">CTBT (1996)</text>

              {/* Grid */}
              {[1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020].map(t => (
                <line key={`x-${t}`} x1={xScale(t)} y1={0} x2={xScale(t)} y2={innerH}
                  stroke="#1e293b" strokeWidth={0.5} />
              ))}

              {/* Test dots */}
              {filteredTests.map((test, i) => {
                const x = xScale(test.year + test.month / 12)
                const y = yScale(Math.max(test.yieldKt, 1))
                const r = test.notable ? 6 : 4
                const color = COUNTRY_COLORS[test.country] || '#94a3b8'

                return (
                  <g key={`${test.name}-${i}`}>
                    <circle cx={x} cy={y} r={r}
                      fill={color} opacity={0.8} stroke="#0a0e1a" strokeWidth={1} />
                    {test.notable && (
                      <text x={x} y={y - 10} fill={color} fontSize={8}
                        textAnchor="middle" fontFamily="Inter" fontWeight={600}>
                        {test.name}
                      </text>
                    )}
                  </g>
                )
              })}

              {/* Axes */}
              {[1950, 1960, 1970, 1980, 1990, 2000, 2010].map(t => (
                <text key={`xl-${t}`} x={xScale(t)} y={innerH + 18} fill="#94a3b8" fontSize={9}
                  textAnchor="middle" fontFamily="Inter">{t}</text>
              ))}
              {[1, 10, 100, 1000, 10000].map(t => (
                <text key={`yl-${t}`} x={-10} y={yScale(t) + 3} fill="#94a3b8" fontSize={9}
                  textAnchor="end" fontFamily="Inter">{formatYield(t)}</text>
              ))}

              <text x={innerW / 2} y={innerH + 40} fill="#64748b" fontSize={10} textAnchor="middle" fontFamily="Inter">Year</text>
              <text transform={`rotate(-90) translate(${-innerH / 2}, -55)`} fill="#64748b" fontSize={10}
                textAnchor="middle" fontFamily="Inter">Yield (log scale)</text>
            </g>
          </svg>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total Tests', value: '2,056', sublabel: '1945-2017' },
            { label: 'Atmospheric', value: '528', sublabel: '1945-1980' },
            { label: 'Underground', value: '1,528', sublabel: '1951-2017' },
            { label: 'Largest', value: '50 Mt', sublabel: 'Tsar Bomba, 1961' },
          ].map(stat => (
            <div key={stat.label} className="bg-bg-card rounded-lg p-3 border border-border">
              <p className="text-xs text-text-muted uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-muted">{stat.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
