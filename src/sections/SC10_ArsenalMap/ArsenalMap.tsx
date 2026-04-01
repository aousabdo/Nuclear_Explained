import { motion } from 'framer-motion'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { useAppStore } from '../../hooks/useAppStore'

// ─── Arsenal data (2024) ─────────────────────────────────────────────────────
const ARSENALS = [
  { country: 'Russia',      countryAr: 'روسيا',         flag: '🇷🇺', warheads: 5889, color: '#ef4444', nfu: false },
  { country: 'USA',         countryAr: 'الولايات المتحدة', flag: '🇺🇸', warheads: 5550, color: '#3b82f6', nfu: false },
  { country: 'China',       countryAr: 'الصين',          flag: '🇨🇳', warheads: 500,  color: '#ef4444', nfu: true  },
  { country: 'UK',          countryAr: 'المملكة المتحدة', flag: '🇬🇧', warheads: 225,  color: '#a855f7', nfu: false },
  { country: 'France',      countryAr: 'فرنسا',          flag: '🇫🇷', warheads: 290,  color: '#6366f1', nfu: false },
  { country: 'India',       countryAr: 'الهند',           flag: '🇮🇳', warheads: 172,  color: '#f97316', nfu: true  },
  { country: 'Pakistan',    countryAr: 'باكستان',         flag: '🇵🇰', warheads: 170,  color: '#22c55e', nfu: false },
  { country: 'Israel',      countryAr: 'إسرائيل',         flag: '🇮🇱', warheads: 90,   color: '#f59e0b', nfu: false },
  { country: 'North Korea', countryAr: 'كوريا الشمالية', flag: '🇰🇵', warheads: 50,   color: '#6b7280', nfu: false },
]

const MAX_WARHEADS = 5889 // Russia

// ─── Historical milestones ────────────────────────────────────────────────────
const HISTORY_EN = [
  { year: '1945', count: 2,      label: 'First 2 weapons ever used' },
  { year: '1960', count: 20206,  label: 'Cold War buildup accelerates' },
  { year: '1986', count: 70300,  label: '🔺 PEAK — 70,300 total warheads worldwide' },
  { year: '1991', count: 55000,  label: 'USSR dissolves — numbers begin declining' },
  { year: '2000', count: 31535,  label: 'Post-Cold War drawdown continues' },
  { year: '2010', count: 22400,  label: 'New START treaty signed' },
  { year: '2024', count: 12121,  label: '~12,500 warheads remain today' },
]

const HISTORY_AR = [
  { year: '1945', count: 2,      label: 'أول سلاحين نوويين استُخدما في التاريخ' },
  { year: '1960', count: 20206,  label: 'تسارع التسلح في الحرب الباردة' },
  { year: '1986', count: 70300,  label: '🔺 الذروة — 70,300 رأس حربي حول العالم' },
  { year: '1991', count: 55000,  label: 'تفكك الاتحاد السوفيتي — بدء الانخفاض' },
  { year: '2000', count: 31535,  label: 'استمرار التخفيض بعد الحرب الباردة' },
  { year: '2010', count: 22400,  label: 'توقيع معاهدة نيو ستارت' },
  { year: '2024', count: 12121,  label: '~12,500 رأس حربي لا تزال موجودة اليوم' },
]

const PEAK = 70300
const CURRENT = 12121

export default function ArsenalMap() {
  const { language } = useAppStore()
  const isAr = language === 'ar'

  const total = ARSENALS.reduce((a, b) => a + b.warheads, 0)
  const history = isAr ? HISTORY_AR : HISTORY_EN

  return (
    <SectionWrapper id="c-arsenal" fullHeight={false}>
      <div className="space-y-10" dir={isAr ? 'rtl' : 'ltr'}>

        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-black text-text-primary">
            {isAr ? 'خريطة الترسانة النووية العالمية' : 'Global Nuclear Arsenal'}
          </h2>
          <p className="text-text-secondary max-w-2xl">
            {isAr
              ? `بيانات 2024 — ${total.toLocaleString()} رأس حربي نووي على متن طائرات وصواريخ وغواصات جاهزة للإطلاق`
              : `2024 data — ${total.toLocaleString()} nuclear warheads on aircraft, missiles, and submarines ready to launch`}
          </p>
        </div>

        {/* Bar chart */}
        <div className="space-y-3">
          {ARSENALS.map((entry, i) => (
            <motion.div
              key={entry.country}
              initial={{ opacity: 0, x: isAr ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-center gap-3"
            >
              {/* Flag + name */}
              <div className="flex items-center gap-2 w-36 shrink-0">
                <span className="text-xl">{entry.flag}</span>
                <span className="text-text-secondary text-sm font-medium truncate">
                  {isAr ? entry.countryAr : entry.country}
                </span>
              </div>

              {/* Bar */}
              <div className="flex-1 relative h-7 bg-bg-secondary rounded-r-lg overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 start-0 rounded-r-lg flex items-center"
                  style={{ backgroundColor: entry.color + '33', borderRight: `2px solid ${entry.color}` }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(entry.warheads / MAX_WARHEADS) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.08 + 0.2, ease: 'easeOut' }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-40"
                    style={{ background: `linear-gradient(90deg, ${entry.color}00, ${entry.color})` }}
                  />
                </motion.div>
              </div>

              {/* Count + NFU badge */}
              <div className="flex items-center gap-2 w-28 shrink-0 justify-end">
                <span
                  className="font-mono font-bold tabular-nums text-sm"
                  style={{ color: entry.color }}
                >
                  {entry.warheads.toLocaleString()}
                </span>
                {entry.nfu ? (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 font-mono">
                    NFU
                  </span>
                ) : (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-red-950/20 text-red-500/70 border border-red-900/30 font-mono">
                    1ST
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* NFU legend */}
        <div className="flex flex-wrap gap-4 text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 font-mono">NFU</span>
            <span>{isAr ? 'سياسة "عدم الاستخدام الأول" — تلتزم بعدم الضرب أولاً' : '"No First Use" pledge — committed not to strike first'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-red-950/20 text-red-500/70 border border-red-900/30 font-mono">1ST</span>
            <span>{isAr ? 'لا يوجد التزام — تحتفظ بحق الضرب الأول' : 'No pledge — reserves right to first strike'}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Historical decline */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-text-primary">
            {isAr ? 'السياق التاريخي: صعود وهبوط' : 'Historical Context: Rise & Fall'}
          </h3>
          <p className="text-text-secondary text-sm">
            {isAr
              ? `ذروة 1986: 70,300 رأس حربي. اليوم: ~12,500. تراجع هائل — لكن القدرة على الإبادة لا تزال قائمة.`
              : `Peak 1986: 70,300 warheads. Today: ~12,500. A dramatic decline — but the capacity for annihilation remains.`}
          </p>

          {/* Timeline bars */}
          <div className="space-y-2">
            {history.map((h, i) => (
              <motion.div
                key={h.year}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3"
              >
                <span className="text-text-muted font-mono text-xs w-10 shrink-0">{h.year}</span>
                <div className="flex-1 relative h-4 bg-bg-secondary rounded overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 start-0 rounded"
                    style={{
                      background: h.count === PEAK
                        ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                        : h.count <= CURRENT
                        ? 'linear-gradient(90deg, #3b82f6, #1d4ed8)'
                        : 'linear-gradient(90deg, #f97316, #ea580c)',
                    }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(h.count / PEAK) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.07 + 0.2 }}
                  />
                </div>
                <span className="text-text-muted text-xs w-14 shrink-0 text-end font-mono">
                  {h.count >= 1000 ? `${(h.count / 1000).toFixed(0)}k` : h.count}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Peak vs now comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4 mt-4"
          >
            <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-4 text-center space-y-1">
              <div className="text-red-400 font-mono font-black text-3xl">70,300</div>
              <div className="text-text-muted text-xs uppercase tracking-wider">
                {isAr ? 'ذروة 1986' : '1986 Peak'}
              </div>
              <div className="text-text-muted text-xs">
                {isAr ? 'كافٍ لتدمير الأرض 13× مرة' : 'Enough to destroy Earth 13× over'}
              </div>
            </div>
            <div className="bg-blue-950/20 border border-blue-900/30 rounded-xl p-4 text-center space-y-1">
              <div className="text-blue-400 font-mono font-black text-3xl">~12,500</div>
              <div className="text-text-muted text-xs uppercase tracking-wider">
                {isAr ? 'اليوم 2024' : '2024 Today'}
              </div>
              <div className="text-text-muted text-xs">
                {isAr ? 'لا تزال كافية للشتاء النووي العالمي' : 'Still enough for global nuclear winter'}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Closing statement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border border-border bg-bg-secondary rounded-xl p-5 text-center"
        >
          <p className="text-text-secondary text-sm italic max-w-2xl mx-auto">
            {isAr
              ? '"حتى مع خفض الأعداد بنسبة 83٪ منذ 1986، تمتلك البشرية ما يكفي من الأسلحة النووية لإنهاء الحضارة الحديثة في ساعة واحدة."'
              : '"Even with an 83% reduction since 1986, humanity still possesses enough nuclear weapons to end modern civilization within a single hour."'
            }
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
