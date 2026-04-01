import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { useAppStore } from '../../hooks/useAppStore'

// ─── Incident data ────────────────────────────────────────────────────────────
const INCIDENTS = [
  {
    id: 'petrov',
    year: 1983,
    title: 'Stanislav Petrov Saves the World',
    titleAr: 'ستانيسلاف بيتروف ينقذ العالم',
    country: '🇷🇺 USSR',
    severity: 5,
    summary: 'Soviet early-warning satellite showed 5 US Minuteman missiles incoming. Protocol demanded immediate retaliation. Lt. Col. Petrov decided — alone — it was a false alarm. He was right. A malfunction in the satellite software.',
    summaryAr: 'أظهر قمر صناعي سوفيتي للإنذار المبكر 5 صواريخ أمريكية قادمة. كان البروتوكول يستوجب الرد الفوري. قرر المقدم بيتروف — وحده — أنه إنذار كاذب. كان محقاً. كان عطلاً في برنامج القمر الصناعي.',
    consequence: 'If Petrov had followed orders, the USSR would have launched. US would have retaliated. ~1 billion dead.',
    consequenceAr: 'لو اتبع بيتروف الأوامر، لأطلق الاتحاد السوفيتي صواريخه. ولردّت الولايات المتحدة. ~مليار شخص يموتون.',
    detail: 'The satellite reported missiles over Wyoming. Petrov had 4 minutes to decide. He reported it as a system error to his superiors. He was later reprimanded for "improper filing of paperwork."',
    detailAr: 'أفاد القمر الصناعي بوجود صواريخ فوق وايومنغ. كان أمام بيتروف 4 دقائق ليقرر. أبلغ رؤساءه بأنه خطأ في النظام. عوقب لاحقاً بسبب "تسجيل الأوراق بشكل غير صحيح".',
    color: '#ef4444',
  },
  {
    id: 'able_archer',
    year: 1983,
    title: 'Able Archer 83',
    titleAr: 'أبل آرتشر 83',
    country: '🇺🇸 NATO vs 🇷🇺 USSR',
    severity: 5,
    summary: 'NATO war exercise so realistic the USSR thought it was actual preparation for a first strike. Soviet nuclear forces went on unprecedented alert. Some bombers were loaded with nuclear weapons.',
    summaryAr: 'تمرين حربي لحلف الناتو بدا واقعياً لدرجة أن الاتحاد السوفيتي اعتقد أنه إعداد فعلي لضربة أولى. وضعت القوات النووية السوفيتية في حالة تأهب غير مسبوقة.',
    consequence: 'KGB agent Oleg Gordievsky (double agent for UK) warned MI6 in time. Reagan was reportedly shaken when he learned how close it came.',
    consequenceAr: 'حذّر عميل الـ KGB أوليغ غورديفسكي (عميل مزدوج للمملكة المتحدة) MI6 في الوقت المناسب. يُقال إن ريغان كان مصدوماً عندما علم بمدى الاقتراب.',
    detail: "The exercise simulated a DEFCON 1 nuclear release. Soviet leadership was already paranoid about a US first strike after Reagan's \"Evil Empire\" speech and the Korean Air 007 shootdown weeks earlier.",
    detailAr: 'محاكاة التمرين لإطلاق نووي DEFCON 1. كانت القيادة السوفيتية مصابة بجنون العظمة تجاه ضربة أمريكية أولى بعد خطاب "الإمبراطورية الشريرة" وإسقاط الطائرة الكورية.',
    color: '#f97316',
  },
  {
    id: 'vasili',
    year: 1962,
    title: 'Vasili Arkhipov Prevents Nuclear War (Cuban Missile Crisis)',
    titleAr: 'فاسيلي أرخيبوف يمنع الحرب النووية (أزمة الصواريخ الكوبية)',
    country: '🇷🇺 USSR / 🇨🇺 Cuba',
    severity: 5,
    summary: 'October 27, 1962. USS Beale dropped depth charges on Soviet submarine B-59, which had lost communication and thought war had started. The captain ordered nuclear torpedo launch. Required unanimous approval from 3 officers.',
    summaryAr: '27 أكتوبر 1962. أسقطت USS Beale قنابل عمق على الغواصة السوفيتية B-59 التي فقدت الاتصال واعتقد قائدها أن الحرب بدأت. أمر القائد بإطلاق طوربيد نووي. يتطلب موافقة بالإجماع من 3 ضباط.',
    consequence: 'Captain Savitsky: YES. Political officer Ivan Maslennikov: YES. Flotilla commander Arkhipov: NO. One man stopped the launch.',
    consequenceAr: 'القائد سافيتسكي: نعم. الضابط السياسي ماسلينيكوف: نعم. قائد الأسطول أرخيبوف: لا. رجل واحد أوقف الإطلاق.',
    detail: 'The torpedo was armed with a 15kt warhead. Launch would likely have triggered full nuclear exchange. Thomas Blanton of the National Security Archive called Arkhipov "the man who saved the world."',
    detailAr: 'كان الطوربيد مسلحاً برأس حربي 15 كيلوطن. كان الإطلاق سيؤدي على الأرجح إلى تبادل نووي كامل.',
    color: '#ef4444',
  },
  {
    id: 'norwegian',
    year: 1995,
    title: 'The Norwegian Rocket Incident',
    titleAr: 'حادثة الصاروخ النرويجي',
    country: '🇷🇺 Russia',
    severity: 4,
    summary: 'Norway launched a scientific rocket to study northern lights. It matched the profile of a US Trident SLBM. Russian radar operators alerted Yeltsin, who had the nuclear briefcase activated — for the first and only time.',
    summaryAr: 'أطلقت النرويج صاروخاً علمياً لدراسة الأضواء الشمالية. طابق مسار صاروخ Trident SLBM الأمريكي. أبلغ مشغلو الرادار الروسي يلتسين، الذي فعّل الحقيبة النووية للمرة الأولى والوحيدة.',
    consequence: 'Yeltsin had 10 minutes to decide. The rocket veered off toward the ocean. Russia had been notified of the launch in advance — but the memo never reached radar operators.',
    consequenceAr: 'كان أمام يلتسين 10 دقائق ليقرر. انحرف الصاروخ نحو المحيط. كانت روسيا قد أُخطرت بالإطلاق مسبقاً — لكن المذكرة لم تصل إلى مشغلي الرادار.',
    detail: "Boris Yeltsin's nuclear briefcase (the \"Cheget\") was the first time it had ever been activated in a real scenario. The 10-minute window matched an SLBM flight time from the Norwegian Sea.",
    detailAr: 'كانت الحقيبة النووية ليلتسين أول مرة تُفعَّل في سيناريو حقيقي. مطابقة نافذة 10 دقائق لوقت طيران SLBM من البحر النرويجي.',
    color: '#f59e0b',
  },
  {
    id: 'broken_arrow',
    year: 1961,
    title: 'Goldsboro B-52 Crash — Two Bombs Nearly Detonated',
    titleAr: 'تحطم B-52 في غولدسبورو — كادت قنبلتان تنفجران',
    country: '🇺🇸 USA',
    severity: 4,
    summary: 'A US Air Force B-52 broke apart over North Carolina. Two 3.8-megaton hydrogen bombs fell to earth. One bomb went through 5 of its 6 arming steps. A single low-voltage switch prevented detonation.',
    summaryAr: 'تفككت طائرة B-52 أمريكية فوق كارولينا الشمالية. سقطت قنبلتان هيدروجينيتان بقوة 3.8 ميغاطن. مرت إحدى القنابل بـ 5 من أصل 6 خطوات تسليح. منع مفتاح منخفض الجهد الانفجار.',
    consequence: 'A 3.8 Mt detonation in North Carolina would have rendered much of the US East Coast uninhabitable. The fallout would have reached Washington D.C. and New York.',
    consequenceAr: 'كان انفجار 3.8 ميغاطن في كارولينا الشمالية سيجعل معظم الساحل الشرقي الأمريكي غير صالح للسكن.',
    detail: 'Secretary of Defense Robert McNamara later confirmed: "By the slightest margin of chance, literally the failure of two wires to cross, a nuclear explosion was averted."',
    detailAr: 'أكد وزير الدفاع روبرت ماكنامارا لاحقاً: "بأضيق هامش من الحظ، بالفشل الحرفي لسلكين في التقاطع، تم تفادي انفجار نووي."',
    color: '#f97316',
  },
  {
    id: 'damascus',
    year: 1980,
    title: 'Damascus Titan II Missile Explosion',
    titleAr: 'انفجار صاروخ تيتان II في دمشق، أركنساس',
    country: '🇺🇸 USA',
    severity: 3,
    summary: "A technician dropped a wrench socket in an Arkansas Titan II missile silo. It punctured the rocket's fuel tank. The rocket exploded, launching the 9-megaton warhead 200 yards from the silo. No nuclear detonation — but the warhead was found in a ditch.",
    summaryAr: 'أسقط فني مقبس مفتاح ربط في صومعة صاروخ تيتان II في أركنساس. أحدث ثقباً في خزان الوقود. انفجر الصاروخ وقذف رأساً حربياً بقوة 9 ميغاطن على بعد 200 ياردة. لم ينفجر نووياً — لكن الرأس الحربي وُجد في خندق.',
    consequence: 'A 9 Mt detonation over Arkansas would have been visible from 7 states. The nuclear yield: 600× the Hiroshima bomb.',
    consequenceAr: 'كان انفجار 9 ميغاطن فوق أركنساس مرئياً من 7 ولايات. القوة النووية: 600× قنبلة هيروشيما.',
    detail: 'The warhead was recovered nearly intact. The Air Force classified the incident. It was only fully declassified decades later.',
    detailAr: 'استُعيد الرأس الحربي شبه سليم. صنّفت القوات الجوية الحادثة سرياً. لم يُرفع السرية عنها بالكامل إلا بعد عقود.',
    color: '#eab308',
  },
]

// ─── Severity dots component ──────────────────────────────────────────────────
function SeverityDots({ level }: { level: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="w-2.5 h-2.5 rounded-full"
          style={{
            backgroundColor: i < level ? '#ef4444' : '#1e293b',
            boxShadow: i < level ? '0 0 4px rgba(239,68,68,0.6)' : 'none',
          }}
        />
      ))}
    </div>
  )
}

// ─── Single incident card ─────────────────────────────────────────────────────
function IncidentCard({ incident, isAr }: { incident: typeof INCIDENTS[0], isAr: boolean }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
      className="relative flex gap-0 rounded-xl overflow-hidden border border-border bg-bg-secondary"
    >
      {/* Left color accent */}
      <div
        className="w-1.5 shrink-0"
        style={{ backgroundColor: incident.color }}
      />

      {/* Content */}
      <div className="flex-1 p-5 md:p-6 space-y-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Year badge */}
              <span
                className="font-mono text-xs font-bold px-2 py-0.5 rounded"
                style={{
                  backgroundColor: incident.color + '22',
                  color: incident.color,
                  border: `1px solid ${incident.color}44`,
                }}
              >
                {incident.year}
              </span>
              <span className="text-text-muted text-sm">{incident.country}</span>
              <SeverityDots level={incident.severity} />
            </div>
            <h3 className="text-lg font-bold text-text-primary leading-tight">
              {isAr ? incident.titleAr : incident.title}
            </h3>
          </div>
        </div>

        {/* Summary */}
        <p className="text-text-secondary text-sm leading-relaxed">
          {isAr ? incident.summaryAr : incident.summary}
        </p>

        {/* Consequence highlight */}
        <div
          className="rounded-lg px-4 py-3 text-sm font-medium"
          style={{
            backgroundColor: incident.color + '15',
            borderLeft: isAr ? 'none' : `3px solid ${incident.color}`,
            borderRight: isAr ? `3px solid ${incident.color}` : 'none',
            color: incident.color,
          }}
        >
          {isAr ? incident.consequenceAr : incident.consequence}
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-2 text-xs text-text-muted hover:text-text-secondary transition-colors group"
        >
          <motion.span
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            ▶
          </motion.span>
          <span className="group-hover:underline">
            {expanded
              ? (isAr ? 'إخفاء التفاصيل' : 'Hide details')
              : (isAr ? 'ماذا كان يمكن أن يحدث؟' : 'What almost happened?')}
          </span>
        </button>

        {/* Expanded detail */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="border-t border-border pt-4">
                <p className="text-text-muted text-sm leading-relaxed italic">
                  {isAr ? incident.detailAr : incident.detail}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function NearMiss() {
  const { language } = useAppStore()
  const isAr = language === 'ar'

  return (
    <SectionWrapper id="c-nearmiss" fullHeight={false}>
      <div className="space-y-8" dir={isAr ? 'rtl' : 'ltr'}>

        {/* Header */}
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-xs text-red-400 font-mono uppercase tracking-widest bg-red-950/30 border border-red-800/40 px-3 py-1.5 rounded-full"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {isAr ? 'أحداث موثقة' : 'Documented Incidents'}
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-black text-text-primary">
            {isAr ? 'كاد العالم أن ينتهي' : 'The World Almost Ended'}
          </h2>
          <p className="text-text-secondary max-w-2xl text-sm leading-relaxed">
            {isAr
              ? 'في كل حادثة من هذه الحوادث، أوقف شخص واحد أو خطأ واحد أو حظ ساذج حرباً نووية. وما نعرفه جزء بسيط مما رُفع عنه السرية.'
              : 'In each of these incidents, a single person, a single error, or dumb luck stopped a nuclear war. What we know is only what has been declassified.'}
          </p>
        </div>

        {/* Severity key */}
        <div className="flex items-center gap-4 text-xs text-text-muted flex-wrap">
          <span>{isAr ? 'مستوى الخطورة:' : 'Severity:'}</span>
          {[3, 4, 5].map(lvl => (
            <div key={lvl} className="flex items-center gap-1.5">
              <SeverityDots level={lvl} />
              <span>
                {lvl === 3 ? (isAr ? 'عالٍ' : 'High') : lvl === 4 ? (isAr ? 'بالغ' : 'Critical') : (isAr ? 'كارثي' : 'Catastrophic')}
              </span>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="space-y-5">
          {INCIDENTS.map(incident => (
            <IncidentCard key={incident.id} incident={incident} isAr={isAr} />
          ))}
        </div>

        {/* Closing */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border border-red-900/30 bg-red-950/10 rounded-xl p-5 text-center space-y-2"
        >
          <div className="text-red-400 font-bold text-sm">
            {isAr ? 'هذا ما نعرفه.' : 'This is what we know.'}
          </div>
          <p className="text-text-muted text-xs max-w-xl mx-auto">
            {isAr
              ? 'معظم الحوادث النووية لا تزال سرية. ما فات أكثر بكثير مما وصلنا.'
              : 'The majority of nuclear incidents remain classified. What escaped is far less than what happened.'}
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  )
}
