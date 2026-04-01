import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { useAppStore } from '../../hooks/useAppStore'

const SCENARIOS = [
  {
    id: 'regional',
    labelEn: 'Regional War',
    labelAr: 'حرب إقليمية',
    warheads: 100,
    yieldMt: 15,
    sootMt: 5,
    tempDropC: 1.25,
    cropLossPct: 20,
    famineDeathsM: 2000,
    color: '#f59e0b',
    exampleEn: 'e.g. India–Pakistan',
    exampleAr: 'مثال: الهند–باكستان',
  },
  {
    id: 'limited',
    labelEn: 'Limited Exchange',
    labelAr: 'تبادل محدود',
    warheads: 500,
    yieldMt: 100,
    sootMt: 50,
    tempDropC: 3,
    cropLossPct: 50,
    famineDeathsM: 4000,
    color: '#f97316',
    exampleEn: 'e.g. NATO vs Russia',
    exampleAr: 'مثال: الناتو ضد روسيا',
  },
  {
    id: 'full',
    labelEn: 'Full Exchange',
    labelAr: 'تبادل شامل',
    warheads: 4400,
    yieldMt: 440,
    sootMt: 150,
    tempDropC: 8,
    cropLossPct: 90,
    famineDeathsM: 5000,
    color: '#ef4444',
    exampleEn: 'US + Russia full arsenals',
    exampleAr: 'الترسانة الكاملة الأمريكية والروسية',
  },
]

const TIMELINE_EN = [
  { time: 'Day 1',     icon: '💥', text: 'Detonations ignite massive city firestorms. Billions of tonnes of smoke and soot surge into the upper atmosphere.' },
  { time: 'Week 1',    icon: '🌑', text: 'Soot spreads globally, blocking 20–70% of sunlight. Surface temperatures plummet within days.' },
  { time: 'Month 1',   icon: '❄️', text: 'Average global temperatures drop by 1–8°C. Growing seasons shorten or end in temperate regions.' },
  { time: 'Year 1–3',  icon: '🌾', text: 'Catastrophic crop failures worldwide. Global food supply collapses. Famine kills far more than the bombs.' },
  { time: 'Year 5–10', icon: '☀️', text: 'Soot slowly settles. Temperatures begin recovering — but ozone depletion continues for decades.' },
]

const TIMELINE_AR = [
  { time: 'اليوم الأول',       icon: '💥', text: 'تشعل التفجيرات عواصف نارية ضخمة. مليارات الأطنان من الدخان والسخام تصعد إلى طبقات الغلاف الجوي العليا.' },
  { time: 'الأسبوع الأول',     icon: '🌑', text: 'ينتشر السخام عالمياً محجباً 20–70٪ من ضوء الشمس. تنخفض درجات الحرارة السطحية خلال أيام.' },
  { time: 'الشهر الأول',       icon: '❄️', text: 'تنخفض درجات الحرارة العالمية 1–8°م. تتقلص مواسم الزراعة أو تنتهي في المناطق المعتدلة.' },
  { time: 'السنوات 1–3',       icon: '🌾', text: 'فشل كارثي للمحاصيل في جميع أنحاء العالم. انهيار إمدادات الغذاء العالمية. يقتل الجوع أكثر بكثير من القنابل.' },
  { time: 'السنوات 5–10',      icon: '☀️', text: 'يستقر السخام تدريجياً. تبدأ درجات الحرارة بالتعافي — لكن استنزاف الأوزون يستمر لعقود.' },
]

export default function NuclearWinter() {
  const { language } = useAppStore()
  const isAr = language === 'ar'
  const [selected, setSelected] = useState(SCENARIOS[1])
  const timeline = isAr ? TIMELINE_AR : TIMELINE_EN

  return (
    <SectionWrapper id="c-winter" fullHeight={false}>
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-black">
            {isAr ? 'الشتاء النووي' : 'Nuclear Winter'}
          </h2>
          <p className="text-text-secondary max-w-2xl">
            {isAr
              ? 'الأسلحة النووية لا تقتل فقط من هم في دائرة الانفجار — إنها تهدد الحضارة بأكملها من خلال تغيير مناخ الأرض.'
              : 'Nuclear weapons don\'t just kill those in the blast radius — they threaten all of civilization by altering Earth\'s climate.'
            }
          </p>
        </div>

        {/* The key insight */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-orange-500/30 bg-orange-950/20 p-6 space-y-2"
        >
          <p className="text-lg md:text-xl font-bold text-white">
            {isAr
              ? '💡 الجوع يقتل أكثر من القنابل'
              : '💡 The famine kills more than the bombs'
            }
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            {isAr
              ? 'حتى حرب نووية إقليمية صغيرة — 100 قنبلة فقط بين الهند وباكستان — يمكن أن تتسبب في موت أكثر من مليار شخص بسبب المجاعة الناجمة عن الشتاء النووي. لا أحد آمن بعيداً عن الانفجارات.'
              : 'Even a small regional nuclear war — just 100 warheads between India and Pakistan — could cause more than a billion deaths from famine caused by nuclear winter. Nobody is safe far from the blasts.'
            }
          </p>
        </motion.div>

        {/* Scenario selector */}
        <div className="grid grid-cols-3 gap-3">
          {SCENARIOS.map(s => (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              className="rounded-xl border-2 p-4 text-left transition-all space-y-1"
              style={{
                borderColor: selected.id === s.id ? s.color : 'rgba(255,255,255,0.08)',
                backgroundColor: selected.id === s.id ? s.color + '15' : 'rgba(255,255,255,0.02)',
              }}
            >
              <div className="font-bold text-sm text-text-primary">
                {isAr ? s.labelAr : s.labelEn}
              </div>
              <div className="text-xs text-text-muted">{isAr ? s.exampleAr : s.exampleEn}</div>
              <div className="text-xs font-mono mt-1" style={{ color: s.color }}>
                {s.warheads.toLocaleString()} {isAr ? 'رأس حربي' : 'warheads'}
              </div>
            </button>
          ))}
        </div>

        {/* Stats grid */}
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: isAr ? 'السخام في الغلاف الجوي' : 'Soot injected',       value: `${selected.sootMt} Mt`,      color: '#94a3b8' },
            { label: isAr ? 'انخفاض الحرارة العالمية' : 'Avg temp drop',       value: `−${selected.tempDropC}°C`,   color: '#3b82f6' },
            { label: isAr ? 'خسارة المحاصيل الزراعية' : 'Crop loss',           value: `${selected.cropLossPct}%`,   color: '#f97316' },
            { label: isAr ? 'وفيات الجوع المحتملة' : 'Famine deaths (est.)', value: `${(selected.famineDeathsM / 1000).toFixed(1)}B`, color: '#ef4444' },
          ].map(stat => (
            <div key={stat.label} className="bg-bg-secondary rounded-xl border border-border p-4 space-y-1">
              <div className="text-2xl md:text-3xl font-black font-mono" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs text-text-muted leading-snug">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Calculation transparency */}
        <details className="group">
          <summary className="text-xs text-text-muted cursor-pointer hover:text-text-secondary transition-colors list-none flex items-center gap-1">
            <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
            {isAr ? 'كيف حسبنا هذا؟' : 'How we calculated this'}
          </summary>
          <div className="mt-3 space-y-2 text-xs text-text-muted border-t border-border pt-3">
            <p><span className="text-text-secondary font-mono">Soot injection:</span> Based on Robock et al. (2007) parametric study</p>
            <p><span className="text-text-secondary font-mono">Temperature drop:</span> Toon et al. (2019) climate model outputs</p>
            <p><span className="text-text-secondary font-mono">Crop loss:</span> Xia et al. (2022) agricultural impact modeling</p>
            <p><span className="text-text-secondary font-mono">Famine deaths:</span> Helfand (2013), IPPNW report</p>
            <p className="italic">These are representative values from peer-reviewed literature, not predictions.</p>
          </div>
        </details>

        {/* Temperature drop visualization */}
        <div className="bg-bg-secondary rounded-2xl border border-border p-5 space-y-4">
          <h3 className="font-bold text-text-primary text-sm">
            {isAr ? 'انخفاض درجة الحرارة السطحية بمرور الوقت' : 'Surface Temperature Drop Over Time'}
          </h3>
          <div className="relative h-24">
            <div className="absolute inset-0 flex items-end gap-1">
              {[0, ...Array.from({ length: 24 }, (_, i) => {
                const month = i + 1
                const peak = month <= 3 ? selected.tempDropC * (month / 3) : selected.tempDropC * Math.exp(-(month - 3) / 18)
                return peak
              })].map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t transition-all duration-500"
                  style={{
                    height: `${(v / selected.tempDropC) * 100}%`,
                    backgroundColor: `rgba(59,130,246,${0.3 + (v / selected.tempDropC) * 0.7})`,
                    minHeight: i === 0 ? '2px' : undefined,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between text-xs text-text-muted">
            <span>{isAr ? 'اليوم 0' : 'Day 0'}</span>
            <span>{isAr ? 'السنة الثانية' : 'Year 2'}</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          <h3 className="font-bold text-text-primary">
            {isAr ? 'ماذا يحدث بعد الانفجار' : 'What Happens After the Blast'}
          </h3>
          {timeline.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: isAr ? 20 : -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 items-start"
            >
              <div className="flex-shrink-0 text-xl">{step.icon}</div>
              <div>
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{step.time} — </span>
                <span className="text-sm text-text-secondary">{step.text}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-text-muted">
          {isAr
            ? 'المصدر: Robock et al. (2007), Toon et al. (2019). بيانات تعليمية مبنية على نماذج مناخية.'
            : 'Sources: Robock et al. (2007), Toon et al. (2019). Educational estimates based on climate models.'
          }
        </p>
      </div>
    </SectionWrapper>
  )
}
