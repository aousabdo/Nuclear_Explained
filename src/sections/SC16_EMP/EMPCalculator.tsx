import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { useAppStore } from '../../hooks/useAppStore'
import { CITIES } from '../../data/cities'
import type { City } from '../../data/cities'

const R_EARTH = 6371 // km

function calcEmpRadius(altitudeKm: number): number {
  return Math.sqrt(Math.pow(R_EARTH + altitudeKm, 2) - Math.pow(R_EARTH, 2))
}

function calcAffectedAreaMkm2(radiusKm: number): number {
  return parseFloat(((Math.PI * radiusKm * radiusKm) / 1_000_000).toFixed(2))
}

// Very rough affected population estimate based on area overlap with populated regions
function estimatePopulation(radiusKm: number): string {
  const area = Math.PI * radiusKm * radiusKm // km²
  // World avg density ~50/km², but targeted regions are denser
  const avgDensity = 60
  const popM = (area * avgDensity) / 1_000_000
  if (popM > 1000) return `~${(popM / 1000).toFixed(1)}B`
  return `~${Math.round(popM)}M`
}

function estimateCountries(radiusKm: number): number {
  if (radiusKm < 300) return 1
  if (radiusKm < 600) return 3
  if (radiusKm < 1000) return 6
  if (radiusKm < 1500) return 10
  if (radiusKm < 2000) return 18
  if (radiusKm < 2500) return 25
  return 35
}

const YIELD_OPTIONS = [
  { kt: 1, label: '1 kt', labelAr: '1 كيلوطن', e1: 'Moderate', e1Ar: 'معتدل', e2: 'Limited', e2Ar: 'محدود', e3: 'Minimal', e3Ar: 'ضئيل' },
  { kt: 10, label: '10 kt', labelAr: '10 كيلوطن', e1: 'Significant', e1Ar: 'كبير', e2: 'Moderate', e2Ar: 'معتدل', e3: 'Limited', e3Ar: 'محدود' },
  { kt: 100, label: '100 kt', labelAr: '100 كيلوطن', e1: 'Severe', e1Ar: 'شديد', e2: 'Severe', e2Ar: 'شديد', e3: 'Significant', e3Ar: 'كبير' },
  { kt: 1000, label: '1 Mt', labelAr: '1 ميغاطن', e1: 'Catastrophic', e1Ar: 'كارثي', e2: 'Catastrophic', e2Ar: 'كارثي', e3: 'Catastrophic', e3Ar: 'كارثي' },
]

const ALTITUDE_LABELS: Array<{ alt: number; label: string; labelAr: string }> = [
  { alt: 30, label: 'Low altitude (30 km)', labelAr: 'ارتفاع منخفض (30 كم)' },
  { alt: 100, label: 'Optimal EMP altitude (100 km)', labelAr: 'الارتفاع الأمثل للنبضة EMP (100 كم)' },
  { alt: 200, label: 'High altitude (200 km)', labelAr: 'ارتفاع عالٍ (200 كم)' },
  { alt: 400, label: 'Low Earth Orbit (400 km)', labelAr: 'المدار الأرضي المنخفض (400 كم)' },
]

const EMP_PULSES = [
  {
    id: 'E1',
    color: '#ef4444',
    durationEn: 'Nanoseconds',
    durationAr: 'نانو ثانية',
    titleEn: 'E1 — Instant Kill',
    titleAr: 'E1 — القتل الفوري',
    descEn: 'Destroys microelectronics: phones, computers, vehicle ECUs, medical devices. Travels at the speed of light. No warning possible.',
    descAr: 'يدمر الإلكترونيات الدقيقة: الهواتف، الحواسيب، وحدات تحكم السيارات، الأجهزة الطبية. ينتشر بسرعة الضوء. لا تحذير ممكن.',
  },
  {
    id: 'E2',
    color: '#f97316',
    durationEn: 'Milliseconds',
    durationAr: 'ميلي ثانية',
    titleEn: 'E2 — Lightning Analogue',
    titleAr: 'E2 — مماثل للبرق',
    descEn: 'Similar to a lightning strike but spread across thousands of km². Damages power infrastructure, surge protectors, and transformers.',
    descAr: 'مشابه لضربة البرق لكن منتشر على آلاف كم². يتلف البنية التحتية للطاقة، وقواطع التيار، والمحولات.',
  },
  {
    id: 'E3',
    color: '#f59e0b',
    durationEn: 'Seconds to minutes',
    durationAr: 'ثوانٍ إلى دقائق',
    titleEn: 'E3 — Grid Killer',
    titleAr: 'E3 — قاتل الشبكة',
    descEn: 'Induces massive current surges in power lines and pipelines. Burns out transformers that take 12–18 months to replace. Causes permanent blackouts.',
    descAr: 'يُحدث تدفقات تيارية هائلة في خطوط الطاقة والأنابيب. يحرق المحولات التي تستغرق 12–18 شهراً لاستبدالها. يُسبب انقطاعات دائمة.',
  },
]

export default function EMPCalculator() {
  const { language } = useAppStore()
  const isAr = language === 'ar'

  const [altitude, setAltitude] = useState(100)
  const [yieldIdx, setYieldIdx] = useState(2)
  const [selectedCity, setSelectedCity] = useState<City>(
    CITIES.find(c => c.name === 'Washington, D.C.') ?? CITIES[2]
  )

  const yield_ = YIELD_OPTIONS[yieldIdx]

  const { radiusKm, areaMkm2, affectedPop, countriesCount } = useMemo(() => {
    const r = Math.round(calcEmpRadius(altitude))
    const a = calcAffectedAreaMkm2(r)
    const pop = estimatePopulation(r)
    const cc = estimateCountries(r)
    return { radiusKm: r, areaMkm2: a, affectedPop: pop, countriesCount: cc }
  }, [altitude])

  return (
    <SectionWrapper id="s-emp" fullHeight={false}>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span
              className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              {isAr ? 'وضع الخبراء' : 'Expert Mode'}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black">
            {isAr ? 'حاسبة النبضة الكهرومغناطيسية EMP' : 'EMP Calculator'}
          </h2>
          <p className="text-text-secondary max-w-2xl">
            {isAr
              ? 'انفجار نووي على ارتفاع عالٍ يُولّد نبضة كهرومغناطيسية تُشلّ الإلكترونيات على مساحة هائلة — دون أن يموت أي شخص مباشرة في الانفجار.'
              : 'A high-altitude nuclear burst generates an EMP that disables electronics across a massive area — without directly killing anyone in the blast.'
            }
          </p>
        </div>

        {/* Controls */}
        <div
          className="rounded-2xl border border-border p-6 space-y-6"
          style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
        >
          {/* Altitude slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-text-secondary">
                {isAr ? 'ارتفاع الانفجار' : 'Burst Altitude'}
              </label>
              <span className="font-mono text-lg font-black text-white">{altitude} km</span>
            </div>
            <input
              type="range"
              min={30}
              max={400}
              step={5}
              value={altitude}
              onChange={e => setAltitude(Number(e.target.value))}
              className="w-full accent-red-500"
              style={{ cursor: 'pointer' }}
            />
            <div className="flex justify-between text-xs text-text-muted">
              <span>30 km</span>
              <span>{isAr ? 'الأمثل: 100 كم' : 'Optimal: 100 km'}</span>
              <span>400 km</span>
            </div>
            {/* Altitude label */}
            <div className="flex flex-wrap gap-2">
              {ALTITUDE_LABELS.map(al => (
                <button
                  key={al.alt}
                  onClick={() => setAltitude(al.alt)}
                  className="text-xs px-3 py-1 rounded-full border transition-all"
                  style={{
                    borderColor: altitude === al.alt ? '#ef4444' : 'rgba(255,255,255,0.12)',
                    backgroundColor: altitude === al.alt ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.03)',
                    color: altitude === al.alt ? '#ef4444' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {isAr ? al.labelAr : al.label}
                </button>
              ))}
            </div>
          </div>

          {/* Yield selector */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-text-secondary">
              {isAr ? 'القوة التفجيرية' : 'Warhead Yield'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {YIELD_OPTIONS.map((y, i) => (
                <button
                  key={y.kt}
                  onClick={() => setYieldIdx(i)}
                  className="rounded-xl border-2 py-2 text-sm font-bold transition-all"
                  style={{
                    borderColor: yieldIdx === i ? '#ef4444' : 'rgba(255,255,255,0.1)',
                    backgroundColor: yieldIdx === i ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.03)',
                    color: yieldIdx === i ? '#ef4444' : 'rgba(255,255,255,0.6)',
                  }}
                >
                  {isAr ? y.labelAr : y.label}
                </button>
              ))}
            </div>
          </div>

          {/* Epicenter city */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-text-secondary">
              {isAr ? 'نقطة الانفجار (فوق أي مدينة؟)' : 'Epicenter (detonated above which city?)'}
            </label>
            <select
              value={selectedCity.name}
              onChange={e => {
                const city = CITIES.find(c => c.name === e.target.value)
                if (city) setSelectedCity(city)
              }}
              className="w-full max-w-sm rounded-xl border border-border px-4 py-2.5 text-sm text-text-primary"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            >
              {CITIES.map(c => (
                <option key={c.name} value={c.name} style={{ backgroundColor: '#1a1a2e' }}>
                  {c.name}{c.country ? ` (${c.country})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main callout */}
        <motion.div
          key={`${altitude}-${yieldIdx}-${selectedCity.name}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border-2 p-6 space-y-2"
          style={{
            borderColor: 'rgba(239,68,68,0.5)',
            backgroundColor: 'rgba(239,68,68,0.06)',
            boxShadow: '0 0 32px rgba(239,68,68,0.1)',
          }}
        >
          <p className="text-base md:text-lg font-bold text-white leading-relaxed">
            {isAr
              ? `رأس حربي واحد (${yield_.labelAr}) يُفجَّر على ارتفاع ${altitude} كم فوق ${selectedCity.name} سيُعطّل الإلكترونيات في نطاق ${radiusKm.toLocaleString()} كم — مما يؤثر على ${affectedPop} شخص في ${countriesCount} دول.`
              : `A single warhead (${yield_.label}) detonated at ${altitude} km above ${selectedCity.name} would disable electronics across ${radiusKm.toLocaleString()} km — affecting ${affectedPop} people across ${countriesCount} countries.`
            }
          </p>
        </motion.div>

        {/* Stats cards */}
        <motion.div
          key={`stats-${altitude}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            {
              label: isAr ? 'نصف قطر EMP' : 'EMP Radius',
              value: `${radiusKm.toLocaleString()} km`,
              color: '#ef4444',
            },
            {
              label: isAr ? 'المساحة المتضررة' : 'Affected Area',
              value: `${areaMkm2} M km²`,
              color: '#f97316',
            },
            {
              label: isAr ? 'السكان المعرضون' : 'Exposed Pop.',
              value: affectedPop,
              color: '#f59e0b',
            },
            {
              label: isAr ? 'الدول المتضررة' : 'Countries Hit',
              value: `~${countriesCount}`,
              color: '#a855f7',
            },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-xl border border-border p-4 space-y-1"
              style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
            >
              <div className="text-2xl md:text-3xl font-black font-mono" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs text-text-muted">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Visual scale bar */}
        <div
          className="rounded-2xl border border-border p-5 space-y-3"
          style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
        >
          <h3 className="text-sm font-bold text-text-secondary">
            {isAr ? 'المقياس مقارنةً بالمسافات المعروفة' : 'Scale vs. Known Distances'}
          </h3>
          <div className="space-y-2">
            {[
              { label: isAr ? 'نصف قطر EMP الحالي' : 'Current EMP radius', km: radiusKm, color: '#ef4444', bold: true },
              { label: isAr ? 'عرض الولايات المتحدة القارية' : 'Width of continental US', km: 4500, color: '#3b82f6', bold: false },
              { label: isAr ? 'عرض أوروبا' : 'Width of Europe', km: 3000, color: '#22c55e', bold: false },
              { label: isAr ? 'عرض الصين' : 'Width of China', km: 5000, color: '#f97316', bold: false },
            ].map(item => {
              const maxKm = 5000
              const pct = Math.min(100, (item.km / maxKm) * 100)
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs text-text-muted">
                    <span style={{ color: item.bold ? item.color : undefined, fontWeight: item.bold ? 700 : 400 }}>
                      {item.label}
                    </span>
                    <span className="font-mono">{item.km.toLocaleString()} km</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color, opacity: item.bold ? 1 : 0.5 }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* EMP pulse types */}
        <div className="space-y-4">
          <h3 className="font-bold text-text-primary text-lg">
            {isAr ? 'مراحل النبضة الكهرومغناطيسية' : 'EMP Pulse Phases'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {EMP_PULSES.map(pulse => (
              <div
                key={pulse.id}
                className="rounded-xl border p-4 space-y-2"
                style={{
                  borderColor: pulse.color + '40',
                  backgroundColor: pulse.color + '0d',
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="text-lg font-black font-mono"
                    style={{ color: pulse.color }}
                  >
                    {pulse.id}
                  </span>
                  <span className="font-bold text-sm text-text-primary">
                    {isAr ? pulse.titleAr.split('—')[1]?.trim() : pulse.titleEn.split('—')[1]?.trim()}
                  </span>
                </div>
                <div
                  className="text-xs font-mono px-2 py-0.5 rounded-full inline-block"
                  style={{ backgroundColor: pulse.color + '20', color: pulse.color }}
                >
                  {isAr ? pulse.durationAr : pulse.durationEn}
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {isAr ? pulse.descAr : pulse.descEn}
                </p>
                {/* Yield intensity */}
                <div className="text-xs text-text-muted pt-1">
                  {isAr ? 'الشدة:' : 'Intensity:'}{' '}
                  <span style={{ color: pulse.color }} className="font-bold">
                    {pulse.id === 'E1' ? (isAr ? yield_.e1Ar : yield_.e1) :
                     pulse.id === 'E2' ? (isAr ? yield_.e2Ar : yield_.e2) :
                     (isAr ? yield_.e3Ar : yield_.e3)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recovery time */}
        <div
          className="rounded-2xl border border-red-500/30 bg-red-950/20 p-6 space-y-3"
        >
          <h3 className="font-bold text-white">
            {isAr ? '⚠ وقت التعافي' : '⚠ Recovery Time'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {[
              {
                phase: 'E1',
                color: '#ef4444',
                recovery: isAr ? 'دائم — أجهزة إلكترونية فردية' : 'Permanent — individual electronics',
                note: isAr ? 'لا يمكن إصلاح الرقائق المحترقة' : 'Burned chips cannot be repaired',
              },
              {
                phase: 'E2',
                color: '#f97316',
                recovery: isAr ? 'أسابيع — بنية تحتية' : 'Weeks — infrastructure',
                note: isAr ? 'واقيات التيار قابلة للاستبدال' : 'Surge protectors replaceable',
              },
              {
                phase: 'E3',
                color: '#f59e0b',
                recovery: isAr ? '12–18 شهراً — محولات الشبكة الكبرى' : '12–18 months — bulk power transformers',
                note: isAr ? 'كل دولة لديها عشرات فقط في الاحتياط' : 'Each country has only tens in reserve',
              },
            ].map(item => (
              <div key={item.phase} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-sm" style={{ color: item.color }}>{item.phase}</span>
                  <span className="font-bold text-text-primary text-sm">{item.recovery}</span>
                </div>
                <p className="text-xs text-text-muted">{item.note}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-text-secondary leading-relaxed border-t border-red-500/20 pt-3">
            {isAr
              ? 'الضربة الواحدة EMP فوق مركز الولايات المتحدة ستُشلّ شبكة الكهرباء لأشهر أو سنوات. بدون كهرباء: لا ماء، لا طعام، لا رعاية طبية. يُقدر بعض المحللين أن عشرة ملايين شخص سيموتون خلال عام واحد فقط من الجوع والمرض.'
              : 'A single EMP strike over the US heartland would disable the power grid for months or years. Without power: no water, no food, no medical care. Some analysts estimate tens of millions dead within a year from starvation and disease alone.'
            }
          </p>
        </div>

        <p className="text-xs text-text-muted">
          {isAr
            ? 'المصادر: تقرير EMP لعام 2008 (كوميسيون إيمب)، مختبر سانديا الوطني. بيانات تعليمية.'
            : 'Sources: 2008 EMP Commission Report, Sandia National Laboratories. Educational estimates.'
          }
        </p>
      </div>
    </SectionWrapper>
  )
}
