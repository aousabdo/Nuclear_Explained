import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { useAppStore } from '../../hooks/useAppStore'

// ─── Test data ────────────────────────────────────────────────────────────────
const TEST_ERAS = [
  { year: 1945, count: 2,   us: 2,  ussr: 0,  uk: 0, france: 0, china: 0, india: 0, pakistan: 0, nk: 0, label: 'Trinity + Hiroshima/Nagasaki', labelAr: 'ترينيتي + هيروشيما/ناغازاكي' },
  { year: 1950, count: 6,   us: 6,  ussr: 0,  uk: 0, france: 0, china: 0, india: 0, pakistan: 0, nk: 0 },
  { year: 1952, count: 10,  us: 8,  ussr: 1,  uk: 1, france: 0, china: 0, india: 0, pakistan: 0, nk: 0 },
  { year: 1954, count: 12,  us: 9,  ussr: 2,  uk: 1, france: 0, china: 0, india: 0, pakistan: 0, nk: 0, label: 'Castle Bravo (15 Mt)', labelAr: 'كاسل برافو (15 ميغاطن)' },
  { year: 1958, count: 95,  us: 62, ussr: 29, uk: 4, france: 0, china: 0, india: 0, pakistan: 0, nk: 0 },
  { year: 1961, count: 96,  us: 10, ussr: 59, uk: 0, france: 3, china: 0, india: 0, pakistan: 0, nk: 0, label: 'Tsar Bomba (50 Mt)', labelAr: 'تسار بومبا (50 ميغاطن)' },
  { year: 1962, count: 178, us: 96, ussr: 79, uk: 2, france: 1, china: 0, india: 0, pakistan: 0, nk: 0, label: 'Peak year: 178 tests', labelAr: 'ذروة الاختبارات: 178 اختباراً' },
  { year: 1964, count: 45,  us: 29, ussr: 6,  uk: 1, france: 3, china: 6, india: 0, pakistan: 0, nk: 0, label: 'China joins nuclear club', labelAr: 'الصين تنضم للنادي النووي' },
  { year: 1968, count: 79,  us: 39, ussr: 33, uk: 0, france: 5, china: 2, india: 0, pakistan: 0, nk: 0 },
  { year: 1974, count: 30,  us: 15, ussr: 13, uk: 1, france: 9, china: 2, india: 1, pakistan: 0, nk: 0, label: 'India tests "Smiling Buddha"', labelAr: 'الهند تختبر "البوذا المبتسم"' },
  { year: 1980, count: 54,  us: 14, ussr: 24, uk: 3, france: 11, china: 2, india: 0, pakistan: 0, nk: 0 },
  { year: 1986, count: 70,  us: 16, ussr: 31, uk: 1, france: 8, china: 5, india: 0, pakistan: 0, nk: 0, label: 'Peak stockpile: 70,300 warheads', labelAr: 'ذروة المخزون: 70,300 رأس حربي' },
  { year: 1990, count: 14,  us: 8,  ussr: 1,  uk: 1, france: 6, china: 2, india: 0, pakistan: 0, nk: 0, label: 'Cold War ends', labelAr: 'نهاية الحرب الباردة' },
  { year: 1992, count: 6,   us: 6,  ussr: 0,  uk: 0, france: 0, china: 0, india: 0, pakistan: 0, nk: 0, label: 'US declares moratorium', labelAr: 'الولايات المتحدة تعلن وقفاً للتجارب' },
  { year: 1996, count: 0,   us: 0,  ussr: 0,  uk: 0, france: 0, china: 0, india: 0, pakistan: 0, nk: 0, label: 'CTBT signed (never ratified by US/China)', labelAr: 'توقيع معاهدة الحظر الشامل (لم تُصادق عليها الولايات المتحدة والصين)' },
  { year: 1998, count: 11,  us: 0,  ussr: 0,  uk: 0, france: 0, china: 0, india: 5, pakistan: 6, nk: 0, label: 'India & Pakistan go nuclear', labelAr: 'الهند وباكستان تصبحان نوويتين' },
  { year: 2006, count: 1,   us: 0,  ussr: 0,  uk: 0, france: 0, china: 0, india: 0, pakistan: 0, nk: 1, label: 'North Korea: first test', labelAr: 'كوريا الشمالية: أول اختبار نووي' },
  { year: 2017, count: 1,   us: 0,  ussr: 0,  uk: 0, france: 0, china: 0, india: 0, pakistan: 0, nk: 1, label: 'NK Hydrogen bomb test (~250 kt)', labelAr: 'اختبار قنبلة هيدروجينية كورية (~250 كيلوطن)' },
]

const TOTAL_TESTS = 2056
const MAX_COUNT = 178

// Country color map
const COLORS = {
  us:       '#3b82f6',  // blue
  ussr:     '#ef4444',  // red
  uk:       '#a855f7',  // purple
  france:   '#6366f1',  // indigo
  china:    '#ef4444',  // red (lighter shade via opacity)
  india:    '#f97316',  // orange
  pakistan: '#22c55e',  // green
  nk:       '#6b7280',  // gray
}

const COUNTRY_LABELS_EN = { us: 'USA', ussr: 'USSR/Russia', uk: 'UK', france: 'France', china: 'China', india: 'India', pakistan: 'Pakistan', nk: 'N. Korea' }
const COUNTRY_LABELS_AR = { us: 'الولايات المتحدة', ussr: 'الاتحاد السوفيتي/روسيا', uk: 'المملكة المتحدة', france: 'فرنسا', china: 'الصين', india: 'الهند', pakistan: 'باكستان', nk: 'كوريا الشمالية' }

type CountryKey = keyof typeof COLORS

// ─── Stacked bar for one era ──────────────────────────────────────────────────
function EraBar({
  era,
  isActive,
  isPast,
  isAr,
}: {
  era: typeof TEST_ERAS[0]
  isActive: boolean
  isPast: boolean
  isAr: boolean
}) {
  const barWidth = `${(era.count / MAX_COUNT) * 100}%`
  const countries: CountryKey[] = ['us', 'ussr', 'uk', 'france', 'china', 'india', 'pakistan', 'nk']

  return (
    <div
      className={`flex items-center gap-3 transition-all duration-200 ${
        isActive ? 'opacity-100' : isPast ? 'opacity-60' : 'opacity-20'
      }`}
    >
      {/* Year */}
      <span
        className={`font-mono text-xs w-10 shrink-0 transition-colors ${
          isActive ? 'text-text-primary font-bold' : 'text-text-muted'
        }`}
      >
        {era.year}
      </span>

      {/* Stacked bar */}
      <div className="flex-1 h-5 bg-bg-secondary rounded overflow-hidden relative">
        <div className="absolute inset-0 flex" style={{ width: barWidth }}>
          {countries.map(key => {
            const val = era[key as keyof typeof era] as number
            if (!val) return null
            const frac = val / era.count
            return (
              <div
                key={key}
                style={{
                  width: `${frac * 100}%`,
                  backgroundColor: key === 'china' ? '#dc2626' : COLORS[key],
                  opacity: isActive ? 1 : 0.7,
                }}
              />
            )
          })}
        </div>
        {/* Active glow overlay */}
        {isActive && (
          <div className="absolute inset-0 border border-white/20 rounded" />
        )}
      </div>

      {/* Count */}
      <span
        className={`font-mono text-xs w-7 text-end shrink-0 transition-colors ${
          isActive ? 'text-text-primary font-bold' : 'text-text-muted'
        }`}
      >
        {era.count > 0 ? era.count : '—'}
      </span>

      {/* Label callout */}
      <AnimatePresence>
        {isActive && era.label && (
          <motion.span
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="hidden md:block text-xs text-yellow-300 font-medium truncate max-w-xs"
          >
            {isAr && era.labelAr ? era.labelAr : era.label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function TestTimeline() {
  const { language } = useAppStore()
  const isAr = language === 'ar'

  const [activeIdx, setActiveIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const countryLabels = isAr ? COUNTRY_LABELS_AR : COUNTRY_LABELS_EN

  // Running total through activeIdx
  const runningTotal = TEST_ERAS.slice(0, activeIdx + 1).reduce((s, e) => s + e.count, 0)

  const tick = useCallback(() => {
    setActiveIdx(prev => {
      if (prev >= TEST_ERAS.length - 1) {
        setPlaying(false)
        return prev
      }
      return prev + 1
    })
  }, [])

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(tick, 350)
    } else {
      clearInterval(intervalRef.current!)
    }
    return () => clearInterval(intervalRef.current!)
  }, [playing, tick])

  // Auto-start on mount
  useEffect(() => {
    const t = setTimeout(() => setPlaying(true), 800)
    return () => clearTimeout(t)
  }, [])

  const handlePlayPause = () => {
    if (activeIdx >= TEST_ERAS.length - 1) {
      setActiveIdx(0)
      setPlaying(true)
    } else {
      setPlaying(p => !p)
    }
  }

  const activeEra = TEST_ERAS[activeIdx]

  return (
    <SectionWrapper id="c-timeline" fullHeight={false}>
      <div className="space-y-8" dir={isAr ? 'rtl' : 'ltr'}>

        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-black text-text-primary">
            {isAr ? 'الجدول الزمني للاختبارات النووية' : 'Nuclear Test Timeline'}
          </h2>
          <p className="text-text-secondary max-w-2xl text-sm">
            {isAr
              ? 'من ترينيتي 1945 إلى اليوم — كل شعلة في هذا الرسم البياني كانت تجربة لأسلحة الإبادة الجماعية.'
              : 'From Trinity 1945 to today — every bar in this chart was a test of weapons of mass destruction.'}
          </p>
        </div>

        {/* Running counter */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="bg-bg-secondary border border-border rounded-xl px-5 py-3 space-y-0.5">
            <div className="text-text-muted text-xs uppercase tracking-wider">
              {isAr ? 'إجمالي الاختبارات حتى الآن' : 'Total tests so far'}
            </div>
            <div className="font-mono font-black text-3xl text-text-primary tabular-nums">
              {runningTotal.toLocaleString()}
              <span className="text-text-muted font-normal text-base"> / {TOTAL_TESTS.toLocaleString()}</span>
            </div>
          </div>

          {/* Active year callout */}
          <div
            className="rounded-xl px-4 py-3 border transition-all"
            style={{
              borderColor: activeEra.label ? '#f59e0b55' : '#1e293b',
              backgroundColor: activeEra.label ? '#78350f22' : 'transparent',
            }}
          >
            <div className="text-text-muted text-xs uppercase tracking-wider mb-0.5">
              {isAr ? 'السنة الحالية' : 'Current year'}
            </div>
            <div className="font-mono font-bold text-xl text-text-primary">{activeEra.year}</div>
            {activeEra.label && (
              <div className="text-yellow-300 text-xs mt-0.5">
                {isAr && activeEra.labelAr ? activeEra.labelAr : activeEra.label}
              </div>
            )}
          </div>
        </div>

        {/* Play/Pause + progress bar */}
        <div className="flex items-center gap-4">
          <button
            onClick={handlePlayPause}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-bg-secondary text-text-secondary hover:text-text-primary transition-all text-sm font-medium"
          >
            {playing ? (
              <>
                <span>⏸</span>
                <span>{isAr ? 'إيقاف مؤقت' : 'Pause'}</span>
              </>
            ) : activeIdx >= TEST_ERAS.length - 1 ? (
              <>
                <span>🔄</span>
                <span>{isAr ? 'إعادة' : 'Replay'}</span>
              </>
            ) : (
              <>
                <span>▶</span>
                <span>{isAr ? 'تشغيل' : 'Play'}</span>
              </>
            )}
          </button>

          {/* Scrubber */}
          <input
            type="range"
            min={0}
            max={TEST_ERAS.length - 1}
            value={activeIdx}
            onChange={e => { setPlaying(false); setActiveIdx(Number(e.target.value)) }}
            className="flex-1 accent-red-500 cursor-pointer"
          />
        </div>

        {/* Bars */}
        <div className="space-y-1.5">
          {TEST_ERAS.map((era, i) => (
            <EraBar
              key={era.year}
              era={era}
              isActive={i === activeIdx}
              isPast={i <= activeIdx}
              isAr={isAr}
            />
          ))}
        </div>

        {/* Country legend */}
        <div className="flex flex-wrap gap-3 pt-2">
          {(Object.keys(COLORS) as CountryKey[]).map(key => (
            <div key={key} className="flex items-center gap-1.5 text-xs text-text-muted">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: key === 'china' ? '#dc2626' : COLORS[key] }}
              />
              <span>{countryLabels[key]}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Closing statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">
            {isAr
              ? `أُجريت <strong>2,056 تجربة نووية</strong> منذ عام 1945. الإشعاع الناتج عن هذه التجارب لا يزال موجوداً في أجساد كل إنسان على وجه الأرض — مضمّناً في العظام والأسنان والأنسجة.`
              : `<strong>2,056 nuclear tests</strong> have been conducted since 1945. The radiation from these tests is still detectable in every human on Earth — embedded in bones, teeth, and tissue.`
            }
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                num: '2,056',
                labelEn: 'Total tests',
                labelAr: 'إجمالي الاختبارات',
                sub: isAr ? '1945 — 2017' : '1945 — 2017',
                color: '#ef4444',
              },
              {
                num: '528',
                labelEn: 'Atmospheric tests',
                labelAr: 'اختبارات جوية',
                sub: isAr ? 'قبل معاهدة الحظر الجزئي 1963' : 'Before Partial Test Ban Treaty 1963',
                color: '#f97316',
              },
              {
                num: '50 Mt',
                labelEn: 'Largest test',
                labelAr: 'أضخم اختبار',
                sub: isAr ? 'تسار بومبا — 1961 الاتحاد السوفيتي' : 'Tsar Bomba — USSR 1961',
                color: '#f59e0b',
              },
            ].map(stat => (
              <motion.div
                key={stat.num}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-bg-secondary border border-border rounded-xl p-4 text-center space-y-1"
              >
                <div className="font-mono font-black text-3xl" style={{ color: stat.color }}>
                  {stat.num}
                </div>
                <div className="text-text-primary font-semibold text-sm">
                  {isAr ? stat.labelAr : stat.labelEn}
                </div>
                <div className="text-text-muted text-xs">{stat.sub}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
