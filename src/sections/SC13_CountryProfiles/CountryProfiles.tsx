import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { useAppStore } from '../../hooks/useAppStore'

const COUNTRIES = [
  {
    id: 'usa', flag: '🇺🇸', name: 'United States', nameAr: 'الولايات المتحدة',
    warheads: 5550, deployed: 1700, strategic: 800,
    deliverySystems: ['Minuteman III ICBM (400)', 'Trident II SLBM (14 subs)', 'B-52H + B-2 bombers'],
    deliveryAr: ['صاروخ Minuteman III العابر للقارات (400)', 'صاروخ Trident II (14 غواصة)', 'قاذفات B-52H + B-2'],
    firstTest: 1945, doctrine: 'Ambiguous (no NFU pledge)', doctrineAr: 'غامض (لا تعهد بعدم الاستخدام الأول)',
    budget: '$50B+/yr', color: '#3b82f6',
    highlight: 'Only country to have used nuclear weapons in war (1945)', highlightAr: 'الدولة الوحيدة التي استخدمت أسلحة نووية في الحرب (1945)',
    peakWarheads: 31255, peakYear: 1967,
  },
  {
    id: 'russia', flag: '🇷🇺', name: 'Russia', nameAr: 'روسيا',
    warheads: 6257, deployed: 1588, strategic: 812,
    deliverySystems: ['RS-28 Sarmat ICBM', 'Bulava SLBM (12 subs)', 'Tu-160 + Tu-95 bombers', 'Poseidon nuclear torpedo'],
    deliveryAr: ['صاروخ RS-28 Sarmat العابر للقارات', 'صاروخ بولافا (12 غواصة)', 'قاذفات Tu-160 + Tu-95', 'طوربيد بوسيدون النووي'],
    firstTest: 1949, doctrine: 'Escalate to de-escalate', doctrineAr: 'التصعيد لتخفيف التصعيد',
    budget: '$8B+/yr', color: '#ef4444',
    highlight: 'Largest stockpile; developing new "exotic" delivery systems (Poseidon, Avangard)', highlightAr: 'أكبر مخزون؛ تطوير أنظمة إيصال "غريبة" جديدة',
    peakWarheads: 40159, peakYear: 1986,
  },
  {
    id: 'china', flag: '🇨🇳', name: 'China', nameAr: 'الصين',
    warheads: 500, deployed: 0, strategic: 350,
    deliverySystems: ['DF-41 ICBM (land-mobile)', 'DF-5B ICBM (silo)', 'JL-2/JL-3 SLBM', 'H-6 bomber'],
    deliveryAr: ['DF-41 العابر للقارات (متنقل)', 'DF-5B (صوامع)', 'صاروخ JL-2/JL-3', 'قاذفة H-6'],
    firstTest: 1964, doctrine: 'No First Use (since 1964)', doctrineAr: 'عدم الاستخدام الأول (منذ 1964)',
    budget: '$3B+/yr', color: '#f97316',
    highlight: 'Rapidly expanding: ~500 warheads now, estimated 1,500 by 2035', highlightAr: 'يتوسع بسرعة: ~500 رأس حربي الآن، يُقدر بـ 1500 بحلول 2035',
    peakWarheads: 435, peakYear: 1993,
  },
  {
    id: 'uk', flag: '🇬🇧', name: 'United Kingdom', nameAr: 'المملكة المتحدة',
    warheads: 225, deployed: 120, strategic: 120,
    deliverySystems: ['Trident II D5 SLBM (4 Vanguard subs)', 'Continuous at-sea deterrent since 1969'],
    deliveryAr: ['صاروخ Trident II D5 (4 غواصات Vanguard)', 'ردع مستمر في البحر منذ 1969'],
    firstTest: 1952, doctrine: 'Sub-strategic + strategic ambiguity', doctrineAr: 'غموض استراتيجي',
    budget: '$3B/yr', color: '#8b5cf6',
    highlight: 'Only submarine-based deterrent; always one sub at sea', highlightAr: 'الردع القائم على الغواصة فقط؛ دائماً غواصة واحدة في البحر',
    peakWarheads: 520, peakYear: 1975,
  },
  {
    id: 'france', flag: '🇫🇷', name: 'France', nameAr: 'فرنسا',
    warheads: 290, deployed: 280, strategic: 240,
    deliverySystems: ['M51 SLBM (4 Le Triomphant subs)', 'ASMP-A air-launched cruise missile', 'Rafale fighter jets'],
    deliveryAr: ['صاروخ M51 (4 غواصات)', 'صاروخ كروز ASMP-A جوي', 'مقاتلات رافال'],
    firstTest: 1960, doctrine: 'Strict sufficiency / no NFU', doctrineAr: 'الاكتفاء الصارم / لا استخدام أول',
    budget: '$5B/yr', color: '#6366f1',
    highlight: 'Conducted 210 tests (many in French Polynesia); all delivery systems domestic', highlightAr: 'أجرت 210 اختباراً (كثيراً في بولينيزيا الفرنسية)؛ جميع أنظمة الإيصال محلية الصنع',
    peakWarheads: 540, peakYear: 1992,
  },
  {
    id: 'india', flag: '🇮🇳', name: 'India', nameAr: 'الهند',
    warheads: 172, deployed: 0, strategic: 0,
    deliverySystems: ['Agni-V ICBM (5,500+ km)', 'Arihant SLBM submarine', 'Prithvi missiles'],
    deliveryAr: ['صاروخ Agni-V العابر للقارات', 'غواصة Arihant', 'صواريخ Prithvi'],
    firstTest: 1974, doctrine: 'No First Use + massive retaliation', doctrineAr: 'لا استخدام أول + انتقام شامل',
    budget: '$2.5B/yr', color: '#f59e0b',
    highlight: '"Smiling Buddha" (1974) shocked the world. Now developing MIRVed ICBMs targeting China', highlightAr: '"بوذا المبتسم" (1974) صدمت العالم. تطوير صواريخ عابرة للقارات تستهدف الصين',
    peakWarheads: 172, peakYear: 2024,
  },
  {
    id: 'pakistan', flag: '🇵🇰', name: 'Pakistan', nameAr: 'باكستان',
    warheads: 170, deployed: 0, strategic: 0,
    deliverySystems: ['Shaheen-III MRBM (2,750 km)', "Ra'ad air-launched cruise missile", 'Babur cruise missile'],
    deliveryAr: ['صاروخ شاهين-III (2750 كم)', 'صاروخ رعد الجوي', 'صاروخ كروز بابر'],
    firstTest: 1998, doctrine: 'Full spectrum deterrence (first use option)', doctrineAr: 'ردع الطيف الكامل (خيار الاستخدام الأول)',
    budget: '$2.5B/yr', color: '#22c55e',
    highlight: 'A.Q. Khan network sold nuclear secrets to Libya, Iran, North Korea; fastest-growing arsenal', highlightAr: 'شبكة AQ خان باعت أسراراً نووية لليبيا وإيران وكوريا الشمالية؛ أسرع ترسانة نمواً',
    peakWarheads: 170, peakYear: 2024,
  },
  {
    id: 'israel', flag: '🇮🇱', name: 'Israel', nameAr: 'إسرائيل',
    warheads: 90, deployed: 0, strategic: 0,
    deliverySystems: ['Jericho III ICBM', 'F-35I aircraft', 'Dolphin-class submarine (suspected)'],
    deliveryAr: ['صاروخ أريحا III', 'طائرات F-35I', 'غواصة دولفين (يُشتبه بها)'],
    firstTest: 0, doctrine: 'Nuclear opacity / Samson Option', doctrineAr: 'الغموض النووي / خيار شمشون',
    budget: 'Classified', color: '#a855f7',
    highlight: 'Has never confirmed or denied possession. "Samson Option": launch as last resort even in defeat.', highlightAr: 'لم تؤكد أو تنف امتلاكها أبداً. "خيار شمشون": الإطلاق كملاذ أخير حتى في الهزيمة.',
    peakWarheads: 90, peakYear: 2024,
  },
  {
    id: 'nkorea', flag: '🇰🇵', name: 'North Korea', nameAr: 'كوريا الشمالية',
    warheads: 50, deployed: 0, strategic: 0,
    deliverySystems: ['Hwasong-17 ICBM (15,000+ km)', 'KN-23 short-range', 'Submarine-launched (developing)'],
    deliveryAr: ['صاروخ هواسونغ-17 (15,000+ كم)', 'KN-23 قصير المدى', 'إطلاق من غواصة (قيد التطوير)'],
    firstTest: 2006, doctrine: 'Pre-emptive first use', doctrineAr: 'الضربة الأولى الاستباقية',
    budget: '~$1B/yr (estimated)', color: '#94a3b8',
    highlight: 'Hwasong-17 can reach all of continental US; 6 underground nuclear tests; Kim enshrined nuclear status in constitution', highlightAr: 'هواسونغ-17 يمكنه الوصول إلى كل الولايات المتحدة القارية؛ 6 اختبارات نووية تحت الأرض',
    peakWarheads: 50, peakYear: 2024,
  },
]

export default function CountryProfiles() {
  const { language } = useAppStore()
  const isAr = language === 'ar'
  const [selectedId, setSelectedId] = useState('usa')
  const country = COUNTRIES.find(c => c.id === selectedId)!

  const deployedPct = Math.round((country.deployed / country.warheads) * 100)
  const peakPct = Math.min(100, Math.round((country.warheads / country.peakWarheads) * 100))
  const isGrowth = country.warheads >= country.peakWarheads

  return (
    <SectionWrapper id="c-countries" fullHeight={false}>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-black">
            {isAr ? 'الدول النووية' : 'Nuclear States'}
          </h2>
          <p className="text-text-secondary max-w-2xl">
            {isAr
              ? 'تسع دول تمتلك أسلحة نووية. فيما يلي ملف تفصيلي لكل منها — ترساناتها وعقائدها والحقائق التي لا يعرفها معظم الناس.'
              : 'Nine countries possess nuclear weapons. Here is a detailed profile of each — their arsenals, doctrines, and the facts most people don\'t know.'
            }
          </p>
        </div>

        {/* Tab row */}
        <div className="overflow-x-auto pb-2 -mx-1">
          <div className="flex gap-2 min-w-max px-1">
            {COUNTRIES.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl border-2 transition-all text-center"
                style={{
                  borderColor: selectedId === c.id ? c.color : 'rgba(255,255,255,0.08)',
                  backgroundColor: selectedId === c.id ? c.color + '18' : 'rgba(255,255,255,0.02)',
                  minWidth: '72px',
                }}
              >
                <span className="text-2xl">{c.flag}</span>
                <span
                  className="text-xs font-medium leading-tight"
                  style={{ color: selectedId === c.id ? c.color : 'rgba(255,255,255,0.6)' }}
                >
                  {isAr ? c.nameAr : c.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Country card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border overflow-hidden"
            style={{
              borderColor: country.color + '50',
              backgroundColor: 'rgba(255,255,255,0.02)',
            }}
          >
            {/* Left accent + header */}
            <div
              className="p-6 border-b"
              style={{
                borderColor: country.color + '30',
                borderLeftWidth: '4px',
                borderLeftColor: country.color,
              }}
            >
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-5xl">{country.flag}</span>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white">
                    {isAr ? country.nameAr : country.name}
                  </h3>
                  <p className="text-text-muted text-sm mt-0.5">
                    {isAr ? 'أول اختبار:' : 'First test:'}{' '}
                    <span className="text-text-secondary font-mono">
                      {country.firstTest === 0 ? (isAr ? 'لم يُؤكد' : 'Unconfirmed') : country.firstTest}
                    </span>
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <div
                    className="text-4xl md:text-5xl font-black font-mono"
                    style={{ color: country.color }}
                  >
                    {country.warheads.toLocaleString()}
                  </div>
                  <div className="text-xs text-text-muted">{isAr ? 'رأس حربي إجمالي' : 'total warheads'}</div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Deployed bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">
                    {isAr ? 'المنتشرة مقابل الإجمالي' : 'Deployed vs. Total'}
                  </span>
                  <span className="font-mono text-text-muted">
                    {country.deployed.toLocaleString()} / {country.warheads.toLocaleString()}
                  </span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${deployedPct}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: country.color }}
                  />
                </div>
                <p className="text-xs text-text-muted">
                  {deployedPct}% {isAr ? 'منتشرة (جاهزة للإطلاق)' : 'deployed (launch-ready)'}
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: isAr ? 'الرؤوس الاستراتيجية' : 'Strategic', value: country.strategic.toLocaleString() },
                  { label: isAr ? 'الميزانية السنوية' : 'Annual budget', value: country.budget },
                  { label: isAr ? 'عقيدة الاستخدام' : 'Doctrine', value: isAr ? country.doctrineAr : country.doctrine },
                ].map(stat => (
                  <div
                    key={stat.label}
                    className="rounded-xl p-3 space-y-1 border border-border"
                    style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                  >
                    <div className="text-xs text-text-muted">{stat.label}</div>
                    <div className="text-sm font-semibold text-text-primary leading-snug">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Delivery systems */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-text-secondary uppercase tracking-wider">
                  {isAr ? 'أنظمة الإيصال' : 'Delivery Systems'}
                </h4>
                <ul className="space-y-1">
                  {(isAr ? country.deliveryAr : country.deliverySystems).map((sys, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span style={{ color: country.color }} className="mt-0.5 flex-shrink-0">▸</span>
                      <span>{sys}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Highlight fact */}
              <div
                className="rounded-xl p-4 border"
                style={{
                  borderColor: country.color + '40',
                  backgroundColor: country.color + '0d',
                  boxShadow: `0 0 18px ${country.color}18`,
                }}
              >
                <p className="text-sm italic text-text-secondary leading-relaxed">
                  <span style={{ color: country.color }} className="font-bold not-italic mr-1">
                    {isAr ? 'حقيقة:' : 'Key fact:'}
                  </span>
                  {isAr ? country.highlightAr : country.highlight}
                </p>
              </div>

              {/* Peak warheads bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">
                    {isAr ? `الذروة: ${country.peakWarheads.toLocaleString()} رأس حربي في ${country.peakYear}` : `Peak: ${country.peakWarheads.toLocaleString()} warheads in ${country.peakYear}`}
                  </span>
                  <span className="font-mono text-text-muted">
                    {isGrowth ? '▲' : '▼'} {isAr ? 'مقارنة بالذروة' : 'vs peak'}
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${peakPct}%`,
                      backgroundColor: isGrowth ? '#22c55e' : '#94a3b8',
                    }}
                  />
                </div>
                <p className="text-xs text-text-muted">
                  {isGrowth
                    ? (isAr ? 'المخزون الحالي عند أو أعلى من الذروة التاريخية' : 'Current stockpile at or above historical peak')
                    : (isAr
                        ? `تراجع إلى ${peakPct}٪ من الذروة (تخفيض: ${(country.peakWarheads - country.warheads).toLocaleString()} رأس حربي)`
                        : `Reduced to ${peakPct}% of peak (down ${(country.peakWarheads - country.warheads).toLocaleString()} warheads)`
                      )
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="text-xs text-text-muted">
          {isAr
            ? 'المصادر: SIPRI، FAS، Bulletin of Atomic Scientists. بيانات 2024.'
            : 'Sources: SIPRI, FAS, Bulletin of Atomic Scientists. 2024 data.'
          }
        </p>
      </div>
    </SectionWrapper>
  )
}
