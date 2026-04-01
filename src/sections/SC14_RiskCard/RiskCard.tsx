import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { useAppStore } from '../../hooks/useAppStore'
import { CITIES } from '../../data/cities'
import type { City } from '../../data/cities'

const NUCLEAR_TARGETS = [
  { name: 'Pentagon', lat: 38.8719, lng: -77.0563 },
  { name: 'Cheyenne Mountain', lat: 38.7442, lng: -104.8461 },
  { name: 'STRATCOM, Omaha', lat: 41.1178, lng: -95.9128 },
  { name: 'Minot AFB', lat: 48.4156, lng: -101.358 },
  { name: 'Malmstrom AFB', lat: 47.5058, lng: -111.1878 },
  { name: 'Warren AFB', lat: 41.1453, lng: -104.8214 },
  { name: 'NS Kings Bay', lat: 30.799, lng: -81.5526 },
  { name: 'Norfolk Naval Station', lat: 36.9377, lng: -76.2932 },
  { name: 'New York City', lat: 40.7128, lng: -74.006 },
  { name: 'Washington D.C.', lat: 38.9072, lng: -77.0369 },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'Moscow', lat: 55.7558, lng: 37.6173 },
  { name: 'Beijing', lat: 39.9042, lng: 116.4074 },
  { name: 'Pyongyang', lat: 39.0392, lng: 125.7625 },
  { name: 'Tel Aviv', lat: 32.0853, lng: 34.7818 },
  { name: 'Islamabad', lat: 33.6844, lng: 73.0479 },
  { name: 'Fordow', lat: 34.884, lng: 51.263 },
  { name: 'Dimona', lat: 31.0681, lng: 35.1552 },
  { name: 'Yongbyon', lat: 39.7867, lng: 125.7575 },
]

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

interface RiskTier {
  label: string
  labelAr: string
  desc: string
  descAr: string
  color: string
  bgColor: string
  borderColor: string
}

function getRiskTier(distKm: number): RiskTier {
  if (distKm < 50) return {
    label: 'CRITICAL',
    labelAr: 'حرج',
    desc: 'Inside the fireball zone of most weapons',
    descAr: 'داخل منطقة كرة اللهب لمعظم الأسلحة',
    color: '#ff1a1a',
    bgColor: 'rgba(255,26,26,0.12)',
    borderColor: 'rgba(255,26,26,0.5)',
  }
  if (distKm < 200) return {
    label: 'EXTREME',
    labelAr: 'شديد للغاية',
    desc: 'Heavy blast damage & intense fallout',
    descAr: 'أضرار انفجارية شديدة وتساقط مكثف',
    color: '#ff6b00',
    bgColor: 'rgba(255,107,0,0.12)',
    borderColor: 'rgba(255,107,0,0.5)',
  }
  if (distKm < 500) return {
    label: 'HIGH',
    labelAr: 'مرتفع',
    desc: 'Significant fallout risk for days',
    descAr: 'خطر كبير من التساقط لأيام',
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.12)',
    borderColor: 'rgba(245,158,11,0.5)',
  }
  if (distKm < 1000) return {
    label: 'ELEVATED',
    labelAr: 'مرتفع نسبياً',
    desc: 'Fallout possible depending on wind',
    descAr: 'التساقط ممكن حسب اتجاه الرياح',
    color: '#eab308',
    bgColor: 'rgba(234,179,8,0.12)',
    borderColor: 'rgba(234,179,8,0.5)',
  }
  return {
    label: 'MODERATE',
    labelAr: 'معتدل',
    desc: 'Fallout unlikely; major disruption guaranteed',
    descAr: 'التساقط غير مرجح؛ اضطراب كبير مضمون',
    color: '#22c55e',
    bgColor: 'rgba(34,197,94,0.12)',
    borderColor: 'rgba(34,197,94,0.5)',
  }
}

const COUNTRY_FLAGS: Record<string, string> = {
  US: '🇺🇸', UK: '🇬🇧', France: '🇫🇷', Russia: '🇷🇺', China: '🇨🇳',
  Japan: '🇯🇵', Iran: '🇮🇷', 'North Korea': '🇰🇵', 'South Korea': '🇰🇷',
  Ukraine: '🇺🇦', Israel: '🇮🇱', Pakistan: '🇵🇰', India: '🇮🇳',
  Germany: '🇩🇪', Australia: '🇦🇺', Brazil: '🇧🇷', Canada: '🇨🇦',
  Italy: '🇮🇹', Spain: '🇪🇸', Turkey: '🇹🇷', Saudi: '🇸🇦',
}

function getFlag(country: string): string {
  return COUNTRY_FLAGS[country] ?? '🌍'
}

export default function RiskCard() {
  const { language } = useAppStore()
  const isAr = language === 'ar'

  const [selectedCity, setSelectedCity] = useState<City>(
    CITIES.find(c => c.name === 'New York City') ?? CITIES[1]
  )
  const [copied, setCopied] = useState(false)

  const result = useMemo(() => {
    let nearest = NUCLEAR_TARGETS[0]
    let minDist = Infinity
    for (const target of NUCLEAR_TARGETS) {
      const d = haversineKm(selectedCity.lat, selectedCity.lng, target.lat, target.lng)
      if (d < minDist) {
        minDist = d
        nearest = target
      }
    }
    const distKm = Math.round(minDist)
    const tier = getRiskTier(distKm)
    return { nearest, distKm, tier }
  }, [selectedCity])

  const handleShare = () => {
    const text = isAr
      ? `نتيجة المخاطر النووية الخاصة بي: ${result.tier.labelAr} — ${selectedCity.name} تبعد ${result.distKm} كم من ${result.nearest.name}. تعرف على المزيد على nukes.analyticadss.com`
      : `My nuclear risk score: ${result.tier.label} — ${selectedCity.name} is ${result.distKm} km from ${result.nearest.name}. Learn more at nukes.analyticadss.com`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <SectionWrapper id="c-risk" fullHeight={false}>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-black">
            {isAr ? 'ما هو خطرك النووي؟' : 'What Is Your Nuclear Risk?'}
          </h2>
          <p className="text-text-secondary max-w-2xl">
            {isAr
              ? 'اختر مدينتك لمعرفة مدى قربها من أقرب هدف نووي محتمل وما يعنيه ذلك فعلاً.'
              : 'Select your city to see how close it is to the nearest probable nuclear target — and what that actually means.'
            }
          </p>
        </div>

        {/* City selector */}
        <div className="space-y-2">
          <label className="text-sm text-text-secondary font-medium">
            {isAr ? 'اختر مدينتك:' : 'Select your city:'}
          </label>
          <select
            value={selectedCity.name}
            onChange={e => {
              const city = CITIES.find(c => c.name === e.target.value)
              if (city) setSelectedCity(city)
            }}
            className="w-full max-w-sm rounded-xl border border-border px-4 py-3 text-sm text-text-primary font-medium"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
          >
            {CITIES.map(c => (
              <option key={c.name} value={c.name} style={{ backgroundColor: '#1a1a2e' }}>
                {c.name}{c.country ? ` (${c.country})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Risk card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCity.name}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border-2 overflow-hidden"
            style={{
              borderColor: result.tier.borderColor,
              backgroundColor: result.tier.bgColor,
              boxShadow: `0 0 32px ${result.tier.color}20`,
            }}
          >
            {/* Card header */}
            <div
              className="px-6 py-5 border-b flex flex-wrap items-center gap-3"
              style={{ borderColor: result.tier.borderColor + '80' }}
            >
              <span className="text-4xl">{getFlag(selectedCity.country)}</span>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-black text-white truncate">{selectedCity.name}</h3>
                <p className="text-xs text-text-muted">{selectedCity.country}</p>
              </div>
              {/* Risk badge */}
              <div
                className="px-4 py-2 rounded-full font-black text-sm tracking-widest"
                style={{
                  backgroundColor: result.tier.color + '25',
                  color: result.tier.color,
                  border: `1.5px solid ${result.tier.color}60`,
                }}
              >
                {isAr ? result.tier.labelAr : result.tier.label}
              </div>
            </div>

            {/* Stats */}
            <div className="p-6 space-y-5">
              <p className="text-base text-text-secondary italic">
                {isAr ? result.tier.descAr : result.tier.desc}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className="rounded-xl p-4 space-y-1 border border-border"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="text-xs text-text-muted uppercase tracking-wider">
                    {isAr ? 'أقرب هدف' : 'Nearest target'}
                  </div>
                  <div className="font-bold text-text-primary">{result.nearest.name}</div>
                </div>

                <div
                  className="rounded-xl p-4 space-y-1 border border-border"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="text-xs text-text-muted uppercase tracking-wider">
                    {isAr ? 'المسافة' : 'Distance'}
                  </div>
                  <div
                    className="text-2xl font-black font-mono"
                    style={{ color: result.tier.color }}
                  >
                    {result.distKm.toLocaleString()} km
                  </div>
                </div>

                <div
                  className="rounded-xl p-4 space-y-1 border border-border"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="text-xs text-text-muted uppercase tracking-wider">
                    {isAr ? 'مستوى الخطر' : 'Risk tier'}
                  </div>
                  <div
                    className="font-black text-lg"
                    style={{ color: result.tier.color }}
                  >
                    {isAr ? result.tier.labelAr : result.tier.label}
                  </div>
                </div>
              </div>

              {/* Contextual callout */}
              <div
                className="rounded-xl p-4 border"
                style={{
                  borderColor: result.tier.borderColor,
                  backgroundColor: result.tier.color + '0d',
                }}
              >
                <p className="text-sm text-text-secondary leading-relaxed">
                  {result.distKm < 50 && (isAr
                    ? `${selectedCity.name} داخل نطاق التدمير الفوري لأسلحة تتراوح قوتها بين 100 كيلوطن و1 ميغاطن. لن يكون هناك وقت للإخلاء.`
                    : `${selectedCity.name} is within the immediate destruction radius of weapons ranging from 100 kt to 1 Mt. There is no time to evacuate.`
                  )}
                  {result.distKm >= 50 && result.distKm < 200 && (isAr
                    ? `${selectedCity.name} ستتعرض لأضرار انفجارية حادة وتساقط نووي مكثف. الإشعاع يمثل خطراً مميتاً لأسابيع.`
                    : `${selectedCity.name} would experience severe blast damage and intense nuclear fallout. Radiation is a lethal threat for weeks.`
                  )}
                  {result.distKm >= 200 && result.distKm < 500 && (isAr
                    ? `بعيداً عن نطاق الانفجار المباشر، لكن ${selectedCity.name} ستواجه تساقطاً إشعاعياً كبيراً لأيام. يُنصح بالبقاء داخل المبنى.`
                    : `Beyond the direct blast zone, but ${selectedCity.name} faces significant fallout for days. Shelter-in-place is critical.`
                  )}
                  {result.distKm >= 500 && result.distKm < 1000 && (isAr
                    ? `التساقط الإشعاعي ممكن حسب اتجاه الرياح. ${selectedCity.name} ستواجه بالتأكيد اضطرابات شديدة في البنية التحتية والإمدادات.`
                    : `Fallout is possible depending on wind direction. ${selectedCity.name} will face severe infrastructure and supply disruptions regardless.`
                  )}
                  {result.distKm >= 1000 && (isAr
                    ? `التساقط المباشر غير مرجح، لكن ${selectedCity.name} ستعاني من انهيار الشبكة الكهربائية، وانقطاع سلاسل التوريد، والاضطراب الاجتماعي في أي حرب نووية إقليمية.`
                    : `Direct fallout is unlikely, but ${selectedCity.name} will suffer grid collapse, supply chain breakdown, and societal disruption in any nuclear war.`
                  )}
                </p>
              </div>

              {/* Share button */}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all"
                style={{
                  backgroundColor: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.08)',
                  border: `1.5px solid ${copied ? '#22c55e' : 'rgba(255,255,255,0.15)'}`,
                  color: copied ? '#22c55e' : 'rgba(255,255,255,0.8)',
                }}
              >
                {copied
                  ? (isAr ? '✓ تم النسخ!' : '✓ Copied!')
                  : (isAr ? '↗ مشاركة نتيجتي' : '↗ Share my score')
                }
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="text-xs text-text-muted">
          {isAr
            ? 'المسافات محسوبة بناءً على أهداف مشهورة يُرجَّح استهدافها. تقديري وتعليمي فقط.'
            : 'Distances calculated based on well-known probable target sites. Estimative and educational only.'
          }
        </p>
      </div>
    </SectionWrapper>
  )
}
