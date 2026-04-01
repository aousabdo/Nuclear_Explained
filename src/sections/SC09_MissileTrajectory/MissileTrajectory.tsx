import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { useAppStore } from '../../hooks/useAppStore'
import { CITIES } from '../../data/cities'

// ─── Launcher data ──────────────────────────────────────────────────────────
const LAUNCHERS = [
  { id: 'russia',  country: 'Russia',    flag: '🇷🇺', lat: 55.75,  lng: 37.62,   weapon: 'RS-28 Sarmat',    maxRangeKm: 18000, speedKmS: 7.3, warheads: 10, yieldKt: 750,  type: 'ICBM' },
  { id: 'china',   country: 'China',     flag: '🇨🇳', lat: 39.90,  lng: 116.41,  weapon: 'DF-41',           maxRangeKm: 14000, speedKmS: 7.0, warheads: 3,  yieldKt: 250,  type: 'ICBM' },
  { id: 'nkorea',  country: 'N. Korea',  flag: '🇰🇵', lat: 39.04,  lng: 125.76,  weapon: 'Hwasong-17',      maxRangeKm: 15000, speedKmS: 6.8, warheads: 1,  yieldKt: 200,  type: 'ICBM' },
  { id: 'usa',     country: 'USA',       flag: '🇺🇸', lat: 38.91,  lng: -77.04,  weapon: 'Minuteman III',   maxRangeKm: 13000, speedKmS: 7.0, warheads: 3,  yieldKt: 335,  type: 'ICBM' },
  { id: 'uk',      country: 'UK (sub)',  flag: '🇬🇧', lat: 51.51,  lng: -0.13,   weapon: 'Trident II D5',   maxRangeKm: 12000, speedKmS: 6.0, warheads: 8,  yieldKt: 100,  type: 'SLBM' },
]

// ─── Haversine distance ──────────────────────────────────────────────────────
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ─── Flight phases ───────────────────────────────────────────────────────────
const PHASES_EN = [
  { key: 'launch',   label: 'LAUNCH',     labelFull: 'Launch & Boost Phase',  color: '#f97316', durationFrac: 0.10 },
  { key: 'midcourse',label: 'MIDCOURSE',  labelFull: 'Midcourse (Space Arc)', color: '#f59e0b', durationFrac: 0.75 },
  { key: 'reentry',  label: 'REENTRY',    labelFull: 'Terminal Reentry',      color: '#ef4444', durationFrac: 0.12 },
  { key: 'impact',   label: '💥 IMPACT',  labelFull: 'IMPACT',                color: '#dc2626', durationFrac: 0.03 },
]

const PHASES_AR = [
  { key: 'launch',   label: 'إطلاق',     labelFull: 'مرحلة الإطلاق والدفع',  color: '#f97316', durationFrac: 0.10 },
  { key: 'midcourse',label: 'المسار',     labelFull: 'منتصف المسار (قوس فضائي)', color: '#f59e0b', durationFrac: 0.75 },
  { key: 'reentry',  label: 'إعادة دخول',labelFull: 'الدخول الطرفي',          color: '#ef4444', durationFrac: 0.12 },
  { key: 'impact',   label: '💥 اصطدام', labelFull: 'الاصطدام',              color: '#dc2626', durationFrac: 0.03 },
]

// ─── Animated arc SVG ────────────────────────────────────────────────────────
function ArcAnimation({ progress }: { progress: number }) {
  const W = 340
  const H = 100
  // arc from left to right with a high apex
  const startX = 20
  const endX = W - 20
  const apexY = 10
  const baseY = H - 20

  // Quadratic bezier points
  const ctrlX = W / 2
  const ctrlY = apexY

  // Compute position along bezier at t=progress
  const t = Math.min(progress, 1)
  const px = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * ctrlX + t * t * endX
  const py = (1 - t) * (1 - t) * baseY + 2 * (1 - t) * t * ctrlY + t * t * baseY

  // Trail length for dashes
  const pathLength = 320 // approximate
  const drawn = t * pathLength

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
      {/* Ground line */}
      <line x1={startX} y1={baseY} x2={endX} y2={baseY} stroke="#334155" strokeWidth="1" />

      {/* Dashed trajectory path */}
      <path
        d={`M ${startX} ${baseY} Q ${ctrlX} ${ctrlY} ${endX} ${baseY}`}
        fill="none"
        stroke="#475569"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />

      {/* Animated trail */}
      <path
        d={`M ${startX} ${baseY} Q ${ctrlX} ${ctrlY} ${endX} ${baseY}`}
        fill="none"
        stroke="#f97316"
        strokeWidth="2"
        strokeDasharray={`${drawn} ${pathLength}`}
        strokeLinecap="round"
      />

      {/* Missile dot */}
      {t > 0 && t < 1 && (
        <>
          <circle cx={px} cy={py} r="5" fill="#f97316" opacity="0.3" />
          <circle cx={px} cy={py} r="3" fill="#fb923c" />
        </>
      )}

      {/* Impact flash */}
      {t >= 1 && (
        <g>
          <circle cx={endX} cy={baseY} r="12" fill="#ef4444" opacity="0.4" />
          <circle cx={endX} cy={baseY} r="6" fill="#fca5a5" />
          <text x={endX} y={baseY - 18} textAnchor="middle" fontSize="16">💥</text>
        </g>
      )}

      {/* Launch site */}
      <rect x={startX - 3} y={baseY - 10} width="6" height="10" fill="#64748b" />
      {/* Target site */}
      <rect x={endX - 3} y={baseY - 10} width="6" height="10" fill="#64748b" />
    </svg>
  )
}

export default function MissileTrajectory() {
  const { language } = useAppStore()
  const isAr = language === 'ar'

  const [selectedLauncher, setSelectedLauncher] = useState(LAUNCHERS[0])
  const [selectedCity, setSelectedCity] = useState(CITIES.find(c => c.name === 'New York City') ?? CITIES[1])
  const [launched, setLaunched] = useState(false)
  const [elapsed, setElapsed] = useState(0)   // seconds elapsed (real-time, capped)
  const [impacted, setImpacted] = useState(false)

  const phases = isAr ? PHASES_AR : PHASES_EN

  // Computed values
  const distKm = haversineKm(selectedLauncher.lat, selectedLauncher.lng, selectedCity.lat, selectedCity.lng)
  const flightTimeSec = Math.round(distKm / selectedLauncher.speedKmS)
  const inRange = distKm <= selectedLauncher.maxRangeKm

  const flightMin = Math.floor(flightTimeSec / 60)
  const flightSec = flightTimeSec % 60

  // For countdown: real-time countdown but accelerated for drama
  // We run 1s real = 30s flight for animation pacing, but show actual flight time
  const ANIM_DURATION_S = 30  // animation always 30 real-seconds
  const progress = launched ? Math.min(elapsed / ANIM_DURATION_S, 1) : 0

  // Remaining flight time (interpolated)
  const remainingSec = Math.max(0, Math.round(flightTimeSec * (1 - progress)))
  const remMin = Math.floor(remainingSec / 60)
  const remSec = remainingSec % 60

  // Active phase
  let cumFrac = 0
  let activePhase = phases[0]
  for (const ph of phases) {
    if (progress <= cumFrac + ph.durationFrac) { activePhase = ph; break }
    cumFrac += ph.durationFrac
  }

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleLaunch = useCallback(() => {
    if (!inRange) return
    setLaunched(true)
    setElapsed(0)
    setImpacted(false)
  }, [inRange])

  const handleReset = useCallback(() => {
    setLaunched(false)
    setElapsed(0)
    setImpacted(false)
  }, [])

  useEffect(() => {
    if (!launched) return
    timerRef.current = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 0.1
        if (next >= ANIM_DURATION_S) {
          clearInterval(timerRef.current!)
          setImpacted(true)
          return ANIM_DURATION_S
        }
        return next
      })
    }, 100)
    return () => clearInterval(timerRef.current!)
  }, [launched])

  // Reset when launcher/city changes
  useEffect(() => { handleReset() }, [selectedLauncher, selectedCity, handleReset])

  const warningText = isAr
    ? 'الوقت هو العدو. بحلول الوقت الذي تسمع فيه التحذير، قد يكون فات الأوان.'
    : 'Time is the enemy. By the time you hear the alert, it may already be too late.'

  return (
    <SectionWrapper id="c-trajectory" fullHeight={false}>
      <div className="space-y-8" dir={isAr ? 'rtl' : 'ltr'}>

        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-black text-text-primary">
            {isAr ? 'مسار الصاروخ الباليستي' : 'ICBM Trajectory'}
          </h2>
          <p className="text-text-secondary max-w-2xl">
            {isAr
              ? 'من الإطلاق إلى الاصطدام — لديك دقائق معدودة. اختر الجهة المطلقة والمدينة المستهدفة.'
              : 'From launch to impact — you have minutes. Select a launch country and target city.'}
          </p>
        </div>

        {/* Warning bar */}
        <div className="border border-red-800/50 bg-red-950/30 rounded-lg px-4 py-3 flex items-start gap-3">
          <span className="text-red-400 text-lg mt-0.5">⚠️</span>
          <p className="text-red-300 text-sm italic">{warningText}</p>
        </div>

        {/* Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Launch site */}
          <div className="space-y-2">
            <label className="text-text-muted text-xs uppercase tracking-widest">
              {isAr ? 'الجهة المطلقة' : 'Launch Country'}
            </label>
            <div className="grid grid-cols-1 gap-2">
              {LAUNCHERS.map(l => (
                <button
                  key={l.id}
                  onClick={() => setSelectedLauncher(l)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-start transition-all ${
                    selectedLauncher.id === l.id
                      ? 'border-red-500/70 bg-red-950/40 text-text-primary'
                      : 'border-border bg-bg-secondary text-text-secondary hover:border-border/80'
                  }`}
                >
                  <span className="text-xl">{l.flag}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-sm">{l.country}</span>
                    <span className="text-text-muted text-xs mx-2">·</span>
                    <span className="text-text-muted text-xs">{l.weapon}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                    l.type === 'SLBM' ? 'bg-blue-900/40 text-blue-300' : 'bg-orange-900/40 text-orange-300'
                  }`}>{l.type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Target city */}
          <div className="space-y-2">
            <label className="text-text-muted text-xs uppercase tracking-widest">
              {isAr ? 'المدينة المستهدفة' : 'Target City'}
            </label>
            <select
              value={selectedCity.name}
              onChange={e => {
                const city = CITIES.find(c => c.name === e.target.value)
                if (city) setSelectedCity(city)
              }}
              className="w-full bg-bg-secondary border border-border text-text-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500/50"
            >
              {CITIES.map(c => (
                <option key={`${c.name}-${c.lat}`} value={c.name}>
                  {c.name} ({c.country})
                </option>
              ))}
            </select>

            {/* Stats card */}
            <div className="bg-bg-secondary border border-border rounded-lg p-4 space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-text-muted text-xs uppercase tracking-wider mb-1">
                    {isAr ? 'المسافة' : 'Distance'}
                  </div>
                  <div className="text-text-primary font-mono font-bold text-lg">
                    {Math.round(distKm).toLocaleString()} <span className="text-text-muted text-sm font-normal">km</span>
                  </div>
                </div>
                <div>
                  <div className="text-text-muted text-xs uppercase tracking-wider mb-1">
                    {isAr ? 'وقت الطيران' : 'Flight Time'}
                  </div>
                  <div className={`font-mono font-bold text-lg ${inRange ? 'text-red-400' : 'text-text-muted'}`}>
                    {inRange ? `${flightMin}m ${flightSec.toString().padStart(2,'0')}s` : (isAr ? 'خارج النطاق' : 'Out of range')}
                  </div>
                </div>
                <div>
                  <div className="text-text-muted text-xs uppercase tracking-wider mb-1">
                    {isAr ? 'الرؤوس الحربية' : 'Warheads'}
                  </div>
                  <div className="text-text-primary font-mono font-bold text-lg">
                    {selectedLauncher.warheads}× <span className="text-text-muted text-sm font-normal">{selectedLauncher.yieldKt}kt</span>
                  </div>
                </div>
                <div>
                  <div className="text-text-muted text-xs uppercase tracking-wider mb-1">
                    {isAr ? 'النطاق الأقصى' : 'Max Range'}
                  </div>
                  <div className="text-text-primary font-mono font-bold text-lg">
                    {(selectedLauncher.maxRangeKm / 1000).toFixed(0)}k <span className="text-text-muted text-sm font-normal">km</span>
                  </div>
                </div>
              </div>

              {!inRange && (
                <div className="text-yellow-400 text-xs border border-yellow-800/40 bg-yellow-950/20 rounded px-3 py-2">
                  {isAr
                    ? `${selectedCity.name} خارج نطاق ${selectedLauncher.weapon} (${Math.round(distKm).toLocaleString()} كم > ${selectedLauncher.maxRangeKm.toLocaleString()} كم)`
                    : `${selectedCity.name} is out of ${selectedLauncher.weapon} range (${Math.round(distKm).toLocaleString()} km > ${selectedLauncher.maxRangeKm.toLocaleString()} km)`
                  }
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trajectory visualization */}
        <div className="bg-bg-secondary border border-border rounded-xl p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-2xl">{selectedLauncher.flag}</span>
              <span className="text-text-secondary font-medium">{selectedLauncher.country}</span>
              <span className="text-text-muted mx-1">→</span>
              <span className="text-text-primary font-medium">{selectedCity.name}</span>
            </div>
            {inRange && (
              <div className={`text-xs px-3 py-1 rounded-full font-mono ${
                inRange ? 'bg-red-900/30 text-red-400 border border-red-800/40' : 'bg-gray-900/30 text-gray-500'
              }`}>
                {isAr ? 'في نطاق الضرب' : 'IN RANGE'}
              </div>
            )}
          </div>

          {/* Arc SVG */}
          <div className="px-2">
            <ArcAnimation progress={progress} />
          </div>

          {/* Phase bar */}
          <div className="flex gap-1 h-1.5 rounded-full overflow-hidden">
            {phases.map(ph => (
              <div
                key={ph.key}
                className="rounded-full transition-all duration-300"
                style={{
                  flex: ph.durationFrac,
                  backgroundColor: activePhase.key === ph.key ? ph.color : '#1e293b',
                  boxShadow: activePhase.key === ph.key ? `0 0 8px ${ph.color}` : 'none',
                }}
              />
            ))}
          </div>

          {/* Phase label */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activePhase.key}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-center font-mono text-sm font-bold"
              style={{ color: activePhase.color }}
            >
              {activePhase.labelFull}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Countdown + Launch button */}
        <div className="flex flex-col items-center gap-6">
          {/* Big countdown */}
          <AnimatePresence>
            {launched && !impacted && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="text-center"
              >
                <div className="text-text-muted text-xs uppercase tracking-widest mb-2">
                  {isAr ? 'الوقت المتبقي للاصطدام' : 'Time to Impact'}
                </div>
                <div className="font-mono text-5xl md:text-7xl font-black text-red-400 tabular-nums"
                  style={{ textShadow: '0 0 40px rgba(239,68,68,0.5)' }}>
                  {String(remMin).padStart(2, '0')}:{String(remSec).padStart(2, '0')}
                </div>
                <div className="text-text-muted text-xs mt-2 font-mono">
                  {isAr ? 'وقت الطيران الفعلي:' : 'Actual flight time:'}{' '}
                  <span className="text-text-secondary">{flightMin}m {flightSec.toString().padStart(2,'0')}s</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Impact screen */}
          <AnimatePresence>
            {impacted && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-2"
              >
                <div className="text-6xl">💥</div>
                <div className="text-red-400 font-black text-3xl font-mono tracking-widest">
                  {isAr ? 'اصطدام' : 'IMPACT'}
                </div>
                <div className="text-text-secondary text-sm">
                  {isAr
                    ? `${selectedCity.name} — ${selectedLauncher.warheads} رأس حربي × ${selectedLauncher.yieldKt} كيلوطن`
                    : `${selectedCity.name} — ${selectedLauncher.warheads} warhead${selectedLauncher.warheads > 1 ? 's' : ''} × ${selectedLauncher.yieldKt}kt`
                  }
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Buttons */}
          <div className="flex gap-3">
            {!launched || impacted ? (
              <button
                onClick={handleLaunch}
                disabled={!inRange}
                className={`px-8 py-4 rounded-xl font-black text-lg tracking-widest uppercase transition-all ${
                  inRange
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/40 hover:shadow-red-800/60 active:scale-95'
                    : 'bg-bg-secondary text-text-muted border border-border cursor-not-allowed'
                }`}
              >
                {isAr ? '🚀 إطلاق' : '🚀 LAUNCH'}
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-lg border border-border text-text-secondary hover:text-text-primary transition-all text-sm"
              >
                {isAr ? 'إعادة تعيين' : 'Reset'}
              </button>
            )}
          </div>

          {/* Phase step pills */}
          {launched && (
            <div className="flex items-center gap-1 flex-wrap justify-center">
              {phases.map((ph, i) => {
                let cumFrac2 = 0
                for (let j = 0; j < i; j++) cumFrac2 += phases[j].durationFrac
                const phProgress = progress >= cumFrac2 + ph.durationFrac
                const phActive = activePhase.key === ph.key
                return (
                  <span
                    key={ph.key}
                    className="text-xs px-2 py-1 rounded-full font-mono transition-all"
                    style={{
                      backgroundColor: phActive ? `${ph.color}22` : phProgress ? '#1e293b' : '#0f172a',
                      color: phActive ? ph.color : phProgress ? '#64748b' : '#334155',
                      border: `1px solid ${phActive ? ph.color + '55' : '#1e293b'}`,
                    }}
                  >
                    {ph.label}
                  </span>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-text-muted text-xs text-center border-t border-border pt-4">
          {isAr
            ? 'السرعات والمديات مبنية على بيانات غير سرية متاحة للعموم. وقت الطيران الفعلي: مسافة ÷ سرعة متوسطة.'
            : 'Speeds and ranges based on unclassified public data. Actual flight time = distance ÷ average speed.'}
        </p>
      </div>
    </SectionWrapper>
  )
}
