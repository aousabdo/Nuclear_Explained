import { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { useAppStore } from '../../hooks/useAppStore'

const STEPS_EN = [
  {
    time: '0–5 min',
    icon: '⚡',
    title: 'The Flash',
    color: '#f59e0b',
    actions: [
      'If you see a blinding flash — DROP, cover your face, stay down for 30 seconds.',
      'Do NOT look toward the flash. Thermal radiation travels at the speed of light.',
      'Get below windows. The blast wave arrives 5–30 seconds after the flash.',
    ],
  },
  {
    time: '5–30 min',
    icon: '🏃',
    title: 'Immediate Response',
    color: '#f97316',
    actions: [
      'Get inside a solid building immediately. Any shielding is better than none.',
      'Go to the center of the building, away from windows. Underground is best.',
      'Do NOT get in your car. Traffic will be gridlocked and you\'re exposed.',
    ],
  },
  {
    time: '30 min – 24 hr',
    icon: '🏠',
    title: 'Shelter In Place',
    color: '#ef4444',
    actions: [
      'STAY INSIDE for at least 24 hours — fallout radiation is most intense in the first hours.',
      'Seal windows, doors, and vents with tape or wet towels if possible.',
      'The 7-10 rule: radiation decreases 10× for every 7-fold increase in time (7 hrs → 10%, 49 hrs → 1%).',
      'Tune to emergency broadcasts. Await official evacuation instructions.',
    ],
  },
  {
    time: '24 hr+',
    icon: '🚿',
    title: 'Decontamination',
    color: '#3b82f6',
    actions: [
      'If you were outside: remove and bag your outer clothing (removes ~80% of fallout).',
      'Shower with soap and water. Do NOT use conditioner — it binds radioactive particles to hair.',
      'Drink only stored water or sealed bottled water. Avoid tap water for 72+ hours.',
    ],
  },
  {
    time: 'Days–Weeks',
    icon: '📡',
    title: 'Recovery',
    color: '#22c55e',
    actions: [
      'Follow official guidance before leaving shelter. Wait for all-clear.',
      'Potassium Iodide (KI) pills block radioactive iodine from reaching the thyroid — only effective if taken before exposure.',
      'Food grown locally after a nuclear event may be contaminated. Rely on stored food.',
    ],
  },
]

const STEPS_AR = [
  {
    time: '0–5 دقائق',
    icon: '⚡',
    title: 'الوميض',
    color: '#f59e0b',
    actions: [
      'إذا رأيت ضوءاً أعمى — اسقط أرضاً، غطِّ وجهك، وابقَ ساجداً لمدة 30 ثانية.',
      'لا تنظر نحو الومضة. الإشعاع الحراري ينتقل بسرعة الضوء.',
      'ابتعد عن النوافذ. موجة الانفجار تصل بعد 5–30 ثانية من الومضة.',
    ],
  },
  {
    time: '5–30 دقيقة',
    icon: '🏃',
    title: 'الاستجابة الفورية',
    color: '#f97316',
    actions: [
      'ادخل مبنى صلباً فوراً. أي حماية أفضل من لا شيء.',
      'اذهب إلى وسط المبنى بعيداً عن النوافذ. الطوابق السفلية أفضل.',
      'لا تستقل سيارتك. الطرق ستكون مزدحمة وأنت معرّض للإشعاع.',
    ],
  },
  {
    time: '30 دقيقة – 24 ساعة',
    icon: '🏠',
    title: 'الإيواء في المكان',
    color: '#ef4444',
    actions: [
      'ابقَ في الداخل لمدة 24 ساعة على الأقل — الإشعاع الأشد في الساعات الأولى.',
      'أغلق النوافذ والأبواب والمنافذ بشريط لاصق أو مناشف مبللة.',
      'قاعدة 7-10: الإشعاع يتناقص 10 أضعاف مع كل زيادة 7 أضعاف في الوقت.',
      'استمع لبيانات الطوارئ وانتظر التعليمات الرسمية.',
    ],
  },
  {
    time: '24 ساعة فأكثر',
    icon: '🚿',
    title: 'إزالة التلوث',
    color: '#3b82f6',
    actions: [
      'إذا كنت في الخارج: اخلع ملابسك الخارجية وضعها في كيس (يزيل ~80٪ من الجسيمات المشعة).',
      'اغتسل بالصابون والماء. لا تستخدم البلسم — يربط الجسيمات المشعة بالشعر.',
      'اشرب فقط الماء المخزّن أو المعبأ. تجنب ماء الحنفية لمدة 72 ساعة.',
    ],
  },
  {
    time: 'أيام – أسابيع',
    icon: '📡',
    title: 'التعافي',
    color: '#22c55e',
    actions: [
      'اتبع التعليمات الرسمية قبل مغادرة المأوى.',
      'حبوب يوديد البوتاسيوم (KI) تحمي الغدة الدرقية من اليود المشع — فعّالة فقط قبل التعرض.',
      'الغذاء المزروع محلياً قد يكون ملوثاً. اعتمد على الطعام المخزن.',
    ],
  },
]

const MYTH_FACTS_EN = [
  { myth: '"Just get in your car and drive away"', fact: 'Roads will be gridlocked within minutes. Sheltering in a basement is 200× more protective than being outside.' },
  { myth: '"Nuclear bombs mean the end — no point surviving"', fact: 'Most people within a city survive the initial blast. Survival actions work. The Hiroshima survivors proved it.' },
  { myth: '"Fallout is immediately deadly everywhere"', fact: 'Radiation intensity drops 90% in the first 7 hours. Distance and shelter dramatically reduce exposure.' },
]

const MYTH_FACTS_AR = [
  { myth: '"فقط اركب سيارتك واهرب"', fact: 'الطرق ستكون مزدحمة خلال دقائق. الإيواء في الطابق السفلي أكثر فاعلية 200 مرة من البقاء في الخارج.' },
  { myth: '"القنبلة النووية تعني النهاية — لا فائدة من الإفلات"', fact: 'معظم سكان المدينة ينجون من الانفجار الأولي. إجراءات البقاء تنجح. ناجو هيروشيما أثبتوا ذلك.' },
  { myth: '"التساقط المشع قاتل فوراً في كل مكان"', fact: 'تنخفض شدة الإشعاع 90٪ في أول 7 ساعات. المسافة والمأوى يقللان التعرض بشكل كبير.' },
]

export default function Survival() {
  const { language } = useAppStore()
  const isAr = language === 'ar'
  const [openStep, setOpenStep] = useState<number | null>(0)
  const steps = isAr ? STEPS_AR : STEPS_EN
  const myths = isAr ? MYTH_FACTS_AR : MYTH_FACTS_EN

  return (
    <SectionWrapper id="c-survival" fullHeight={false}>
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-black">
            {isAr ? 'دليل البقاء' : 'Survival Guide'}
          </h2>
          <p className="text-text-secondary max-w-2xl">
            {isAr
              ? 'معظم الناجين من هيروشيما وناغازاكي كانوا يعرفون ما يجب فعله. الإجراءات الصحيحة في الدقائق الأولى تحدث فرقاً حاسماً.'
              : 'Most Hiroshima and Nagasaki survivors knew what to do. The right actions in the first minutes make a decisive difference.'
            }
          </p>
        </div>

        {/* Key rule banner */}
        <div className="rounded-2xl border border-green-500/30 bg-green-950/20 p-5">
          <p className="text-lg font-black text-white">
            {isAr ? '☢ القاعدة الأساسية: الداخل · الداخل · الداخل' : '☢ The Golden Rule: Inside · Inside · Inside'}
          </p>
          <p className="text-text-secondary text-sm mt-1">
            {isAr
              ? 'الدخول إلى أي مبنى صلب يقلل تعرضك للإشعاع بنسبة 90٪ أو أكثر.'
              : 'Getting inside any solid building reduces your radiation exposure by 90% or more.'
            }
          </p>
        </div>

        {/* Steps accordion */}
        <div className="space-y-3">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="rounded-xl border overflow-hidden"
              style={{ borderColor: openStep === i ? step.color + '50' : 'rgba(255,255,255,0.08)' }}
            >
              <button
                onClick={() => setOpenStep(openStep === i ? null : i)}
                className="w-full flex items-center gap-4 p-4 text-left"
                style={{ backgroundColor: openStep === i ? step.color + '10' : 'transparent' }}
              >
                <span className="text-2xl flex-shrink-0">{step.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-text-primary text-sm">{step.title}</div>
                  <div className="text-xs font-mono mt-0.5" style={{ color: step.color }}>{step.time}</div>
                </div>
                <motion.span
                  animate={{ rotate: openStep === i ? 180 : 0 }}
                  className="text-text-muted flex-shrink-0"
                >▾</motion.span>
              </button>

              <motion.div
                initial={false}
                animate={{ height: openStep === i ? 'auto' : 0, opacity: openStep === i ? 1 : 0 }}
                style={{ overflow: 'hidden' }}
              >
                <ul className="px-5 pb-4 space-y-2 border-t border-white/5 pt-3">
                  {step.actions.map((action, j) => (
                    <li key={j} className="flex gap-3 text-sm text-text-secondary">
                      <span style={{ color: step.color }} className="flex-shrink-0 mt-0.5">→</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* The 7-10 rule */}
        <div className="bg-bg-secondary rounded-2xl border border-border p-5 space-y-4">
          <h3 className="font-bold text-text-primary">
            {isAr ? 'قاعدة 7–10 للتساقط المشع' : 'The 7–10 Rule for Fallout'}
          </h3>
          <p className="text-sm text-text-secondary">
            {isAr
              ? 'لكل زيادة 7 أضعاف في الوقت، ينخفض مستوى الإشعاع 10 أضعاف:'
              : 'For every 7-fold increase in time, radiation drops by a factor of 10:'
            }
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { time: isAr ? '1 ساعة' : '1 hr',  pct: 100, note: isAr ? 'ذروة' : 'Peak' },
              { time: isAr ? '7 ساعات' : '7 hr',  pct: 10,  note: '10%' },
              { time: isAr ? '49 ساعة' : '49 hr', pct: 1,   note: '1%' },
              { time: isAr ? '2 أسابيع' : '2 wk', pct: 0.1, note: '0.1%' },
            ].map(r => (
              <div key={r.time} className="text-center space-y-1">
                <div className="rounded-lg bg-blue-950/40 border border-blue-900/30 py-2">
                  <div className="text-sm font-black text-blue-400 font-mono">{r.note}</div>
                  <div className="text-xs text-text-muted">{r.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Myth busters */}
        <div className="space-y-3">
          <h3 className="font-bold text-text-primary">
            {isAr ? 'أساطير يجب تجاهلها' : 'Myths to Ignore'}
          </h3>
          {myths.map((m, i) => (
            <div key={i} className="rounded-xl border border-border bg-bg-secondary p-4 space-y-2">
              <p className="text-sm font-semibold text-red-400/80">✗ {m.myth}</p>
              <p className="text-sm text-text-secondary">✓ {m.fact}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-text-muted">
          {isAr
            ? 'المصدر: FEMA, CDC, وكالة إدارة الطوارئ الفيدرالية الأمريكية، وأبحاث ناجو هيروشيما.'
            : 'Sources: FEMA, CDC, US Federal Emergency Management Agency, and Hiroshima survivor research.'
          }
        </p>
      </div>
    </SectionWrapper>
  )
}
