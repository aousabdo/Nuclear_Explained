import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { useAppStore } from '../../hooks/useAppStore'

const QUESTIONS = [
  {
    q: 'How many nuclear warheads exist worldwide today?',
    qAr: 'كم عدد الرؤوس الحربية النووية الموجودة في العالم اليوم؟',
    options: ['~500', '~4,000', '~12,500', '~50,000'],
    optionsAr: ['~500', '~4,000', '~12,500', '~50,000'],
    correct: 2,
    explanation: 'As of 2024, approximately 12,500 nuclear warheads exist globally — down from a peak of ~70,000 in 1986.',
    explanationAr: 'اعتباراً من عام 2024، يوجد حوالي 12,500 رأس حربي نووي على مستوى العالم — انخفاضاً من ذروة ~70,000 عام 1986.',
  },
  {
    q: 'The Hiroshima bomb had a yield of approximately:',
    qAr: 'بلغ ناتج قنبلة هيروشيما تقريباً:',
    options: ['0.5 kilotons', '15 kilotons', '100 kilotons', '1 megaton'],
    optionsAr: ['0.5 كيلوطن', '15 كيلوطن', '100 كيلوطن', '1 ميغاطن'],
    correct: 1,
    explanation: '"Little Boy" had a yield of ~15 kt. Modern warheads average 200–750 kt — 13–50 times more powerful.',
    explanationAr: '"Little Boy" كان له ناتج ~15 كيلوطن. المتوسط الحديث للرؤوس الحربية 200–750 كيلوطن — أقوى بـ13–50 مرة.',
  },
  {
    q: 'How long does it take a US Minuteman III ICBM to reach Moscow from its silo?',
    qAr: 'كم من الوقت يستغرق صاروخ Minuteman III للوصول إلى موسكو من صومعته؟',
    options: ['2 minutes', '8 minutes', '28 minutes', '2 hours'],
    optionsAr: ['2 دقيقة', '8 دقائق', '28 دقيقة', 'ساعتين'],
    correct: 2,
    explanation: 'An ICBM travels at ~7 km/s. The US-to-Russia distance is ~9,000 km, giving a flight time of ~28 minutes.',
    explanationAr: 'يسافر الصاروخ العابر للقارات بسرعة ~7 كم/ث. المسافة الأمريكية-الروسية ~9,000 كم، مما يعطي وقت طيران ~28 دقيقة.',
  },
  {
    q: 'What is the "Tsar Bomba" and what was its yield?',
    qAr: 'ما هي "تسار بومبا" وما كان ناتجها؟',
    options: ['Russian ICBM, 100 kt', 'Largest nuclear bomb ever detonated, 50 Mt', 'Soviet nuclear submarine, 10 Mt', 'US hydrogen bomb, 15 Mt'],
    optionsAr: ['صاروخ روسي عابر للقارات، 100 كيلوطن', 'أكبر قنبلة نووية انفجرت على الإطلاق، 50 ميغاطن', 'غواصة نووية سوفيتية، 10 ميغاطن', 'قنبلة هيدروجينية أمريكية، 15 ميغاطن'],
    correct: 1,
    explanation: 'The AN602 "Tsar Bomba" (1961) yielded 50 Mt — 3,800× Hiroshima. Its fireball was 8 km wide. Windows broke 900 km away.',
    explanationAr: '"تسار بومبا" (1961) ناتجها 50 ميغاطن — 3,800× هيروشيما. كرة اللهب كانت 8 كم. تكسّرت النوافذ على بُعد 900 كم.',
  },
  {
    q: 'The Doomsday Clock is currently set to:',
    qAr: 'تم ضبط ساعة يوم القيامة حالياً على:',
    options: ['5 minutes to midnight', '3 minutes to midnight', '90 seconds to midnight', '30 seconds to midnight'],
    optionsAr: ['5 دقائق قبل منتصف الليل', '3 دقائق قبل منتصف الليل', '90 ثانية قبل منتصف الليل', '30 ثانية قبل منتصف الليل'],
    correct: 2,
    explanation: "In January 2023, the Bulletin of Atomic Scientists moved it to 90 seconds — the closest to midnight in the clock's 77-year history.",
    explanationAr: 'في يناير 2023، نقلت نشرة علماء الذرة الساعة إلى 90 ثانية — أقرب إلى منتصف الليل في تاريخ الساعة الممتد 77 عاماً.',
  },
  {
    q: 'Which country has a formal "No First Use" nuclear policy?',
    qAr: 'أي دولة لديها سياسة رسمية "عدم الاستخدام الأول" للأسلحة النووية؟',
    options: ['United States', 'Russia', 'China', 'All nuclear states'],
    optionsAr: ['الولايات المتحدة', 'روسيا', 'الصين', 'جميع الدول النووية'],
    correct: 2,
    explanation: 'China and India have official No First Use pledges. The US, Russia, UK, France, Israel, Pakistan, and North Korea all maintain ambiguous or first-use doctrines.',
    explanationAr: 'الصين والهند لديهما تعهدات رسمية بعدم الاستخدام الأول. الولايات المتحدة وروسيا والمملكة المتحدة وفرنسا وإسرائيل وباكستان وكوريا الشمالية تحتفظ بعقائد غامضة أو استخدام أول.',
  },
  {
    q: 'In 1983, Soviet officer Stanislav Petrov received an alarm showing incoming US missiles. What did he do?',
    qAr: 'في عام 1983، تلقى الضابط السوفيتي ستانيسلاف بيتروف إنذاراً يُظهر صواريخ أمريكية قادمة. ماذا فعل؟',
    options: ['Launched a retaliatory strike', 'Reported it as a false alarm', 'Evacuated Moscow', 'Called the US President directly'],
    optionsAr: ['أطلق ضربة انتقامية', 'أبلغ عنه باعتباره إنذاراً كاذباً', 'أخلى موسكو', 'اتصل مباشرة بالرئيس الأمريكي'],
    correct: 1,
    explanation: 'Petrov decided — alone, against protocol — it was a system error. He was right. If he had followed orders, nuclear war would likely have started.',
    explanationAr: 'قرر بيتروف — وحده، خلافاً للبروتوكول — أنه خطأ في النظام. كان محقاً. لو اتبع الأوامر، كانت الحرب النووية ستبدأ على الأرجح.',
  },
  {
    q: 'Nuclear fallout from a 1-megaton surface burst becomes safe enough to leave shelter after approximately:',
    qAr: 'يصبح التساقط النووي من انفجار سطحي بقوة 1 ميغاطن آمناً بما يكفي لمغادرة الملجأ بعد تقريباً:',
    options: ['1–3 hours', '24–48 hours', '2 weeks', '6 months'],
    optionsAr: ['1–3 ساعات', '24–48 ساعة', 'أسبوعان', '6 أشهر'],
    correct: 1,
    explanation: 'The 7-10 rule: radiation decreases 10× every 7× increase in time. After 48hrs, most acute fallout has decayed to safer levels. Staying sheltered for 24–48hrs saves lives.',
    explanationAr: 'قاعدة 7-10: الإشعاع ينخفض 10× مع كل 7× زيادة في الوقت. بعد 48 ساعة، يتحلل معظم التساقط الحاد إلى مستويات أكثر أماناً.',
  },
  {
    q: 'How many nuclear tests have been conducted since 1945?',
    qAr: 'كم عدد الاختبارات النووية التي أُجريت منذ عام 1945؟',
    options: ['~200', '~500', '~1,000', '~2,056'],
    optionsAr: ['~200', '~500', '~1,000', '~2,056'],
    correct: 3,
    explanation: 'Approximately 2,056 nuclear tests have been conducted — mostly by the US (1,032) and USSR (727). The radioactive isotopes are detectable in every human alive today.',
    explanationAr: 'أُجري ما يقارب 2,056 اختباراً نووياً — معظمها من قبل الولايات المتحدة (1,032) والاتحاد السوفيتي (727). النظائر المشعة قابلة للكشف في كل إنسان حي اليوم.',
  },
  {
    q: "What percentage of North Korea's GDP is estimated to be spent on its nuclear program?",
    qAr: 'ما النسبة المئوية المقدرة لإنفاق كوريا الشمالية من ناتجها المحلي الإجمالي على برنامجها النووي؟',
    options: ['1–2%', '5–8%', '15–25%', '~50%'],
    optionsAr: ['1–2٪', '5–8٪', '15–25٪', '~50٪'],
    correct: 2,
    explanation: 'North Korea is estimated to spend 15–25% of GDP on its military/nuclear program — while millions face food insecurity.',
    explanationAr: 'تُقدَّر إنفاق كوريا الشمالية بنسبة 15–25٪ من الناتج المحلي الإجمالي على برنامجها العسكري/النووي — بينما يعاني الملايين من انعدام الأمن الغذائي.',
  },
]

function getScoreMessage(score: number, isAr: boolean): string {
  if (score >= 9) return isAr ? 'مستوى فيزيائي نووي — شارك نتيجتك!' : 'Nuclear Physicist Level — Share your score!'
  if (score >= 6) return isAr ? 'على دراية جيدة — معظم الناس يسجلون 3–4' : 'Well-informed — Most people score 3–4'
  if (score >= 3) return isAr ? 'متوسط — معظم الناس لا يعرفون هذه المعلومات' : 'Average — Most people don\'t know this stuff'
  return isAr ? 'ابدأ من جديد — الرهانات أعلى من أن تظل غير مُطَّلع' : 'Start over — The stakes are too high to stay uninformed'
}

function getScoreColor(score: number): string {
  if (score >= 9) return '#22c55e'
  if (score >= 6) return '#3b82f6'
  if (score >= 3) return '#f59e0b'
  return '#ef4444'
}

export default function NuclearQuiz() {
  const { language } = useAppStore()
  const isAr = language === 'ar'

  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [done, setDone] = useState(false)
  const [copied, setCopied] = useState(false)

  const question = QUESTIONS[currentQ]
  const isAnswered = selected !== null

  const handleSelect = (idx: number) => {
    if (isAnswered) return
    setSelected(idx)
    const correct = idx === question.correct
    if (correct) setScore(s => s + 1)
    setAnswers(a => [...a, correct])
  }

  const handleNext = () => {
    if (currentQ + 1 >= QUESTIONS.length) {
      setDone(true)
    } else {
      setCurrentQ(q => q + 1)
      setSelected(null)
    }
  }

  const handleRestart = () => {
    setCurrentQ(0)
    setSelected(null)
    setScore(0)
    setAnswers([])
    setDone(false)
    setCopied(false)
  }

  const handleShare = () => {
    const text = isAr
      ? `سجّلت ${score}/10 في اختبار الذكاء النووي. هل يمكنك التفوق عليّ؟ nukes.analyticadss.com`
      : `I scored ${score}/10 on the Nuclear Weapons IQ Test. Can you beat me? nukes.analyticadss.com`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <SectionWrapper id="c-quiz" fullHeight={false}>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-black">
            {isAr ? 'اختبار المعرفة النووية' : 'Nuclear Knowledge Quiz'}
          </h2>
          <p className="text-text-secondary max-w-2xl">
            {isAr
              ? '10 أسئلة تغطي الفيزياء والتاريخ والدبلوماسية. كم تعرف حقاً؟'
              : '10 questions covering physics, history, and diplomacy. How much do you actually know?'
            }
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={`q-${currentQ}`}
              initial={{ opacity: 0, x: isAr ? -24 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isAr ? 24 : -24 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-text-muted">
                  <span>{isAr ? `السؤال ${currentQ + 1} من ${QUESTIONS.length}` : `Question ${currentQ + 1} of ${QUESTIONS.length}`}</span>
                  <span className="font-mono">{score} {isAr ? 'صحيح' : 'correct'}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                  <motion.div
                    animate={{ width: `${((currentQ) / QUESTIONS.length) * 100}%` }}
                    transition={{ duration: 0.4 }}
                    className="h-full rounded-full bg-blue-500"
                  />
                </div>
                {/* Micro-dots */}
                <div className="flex gap-1.5">
                  {QUESTIONS.map((_, i) => (
                    <div
                      key={i}
                      className="h-1.5 flex-1 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor:
                          i < answers.length
                            ? answers[i] ? '#22c55e' : '#ef4444'
                            : i === currentQ
                            ? '#3b82f6'
                            : 'rgba(255,255,255,0.12)',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Question */}
              <div
                className="rounded-2xl border border-border p-6 space-y-5"
                style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
              >
                <h3 className="text-lg md:text-xl font-bold text-white leading-relaxed">
                  {isAr ? question.qAr : question.q}
                </h3>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(isAr ? question.optionsAr : question.options).map((opt, idx) => {
                    let bgColor = 'rgba(255,255,255,0.04)'
                    let borderColor = 'rgba(255,255,255,0.1)'
                    let textColor = 'rgba(255,255,255,0.75)'

                    if (isAnswered) {
                      if (idx === question.correct) {
                        bgColor = 'rgba(34,197,94,0.12)'
                        borderColor = '#22c55e'
                        textColor = '#22c55e'
                      } else if (idx === selected && idx !== question.correct) {
                        bgColor = 'rgba(239,68,68,0.12)'
                        borderColor = '#ef4444'
                        textColor = '#ef4444'
                      }
                    } else if (selected === idx) {
                      bgColor = 'rgba(59,130,246,0.12)'
                      borderColor = '#3b82f6'
                      textColor = '#3b82f6'
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        disabled={isAnswered}
                        className="flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all text-sm font-medium"
                        style={{
                          backgroundColor: bgColor,
                          borderColor,
                          color: textColor,
                          cursor: isAnswered ? 'default' : 'pointer',
                        }}
                      >
                        <span
                          className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-black"
                          style={{ borderColor, color: textColor }}
                        >
                          {isAnswered && idx === question.correct ? '✓' : isAnswered && idx === selected && idx !== question.correct ? '✗' : String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-snug">{opt}</span>
                      </button>
                    )
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="rounded-xl border p-4 mt-2"
                        style={{
                          borderColor: selected === question.correct ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
                          backgroundColor: selected === question.correct ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                        }}
                      >
                        <p className="text-xs font-bold mb-1.5" style={{ color: selected === question.correct ? '#22c55e' : '#ef4444' }}>
                          {selected === question.correct
                            ? (isAr ? '✓ صحيح!' : '✓ Correct!')
                            : (isAr ? '✗ خطأ' : '✗ Incorrect')
                          }
                        </p>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {isAr ? question.explanationAr : question.explanation}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Next button */}
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                  >
                    {currentQ + 1 >= QUESTIONS.length
                      ? (isAr ? 'عرض النتيجة ←' : 'See Results →')
                      : (isAr ? 'السؤال التالي ←' : 'Next Question →')
                    }
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* Score screen */
            <motion.div
              key="score"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              <div
                className="rounded-2xl border-2 p-8 text-center space-y-4"
                style={{
                  borderColor: getScoreColor(score) + '60',
                  backgroundColor: getScoreColor(score) + '0d',
                  boxShadow: `0 0 40px ${getScoreColor(score)}18`,
                }}
              >
                <div
                  className="text-7xl font-black font-mono"
                  style={{ color: getScoreColor(score) }}
                >
                  {score}<span className="text-4xl text-text-muted">/10</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {getScoreMessage(score, isAr)}
                </p>

                {/* Mini bar chart */}
                <div className="flex gap-1 justify-center mt-4">
                  {answers.map((correct, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold"
                      style={{
                        backgroundColor: correct ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                        color: correct ? '#22c55e' : '#ef4444',
                      }}
                    >
                      {correct ? '✓' : '✗'}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all"
                  style={{
                    backgroundColor: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.08)',
                    border: `1.5px solid ${copied ? '#22c55e' : 'rgba(255,255,255,0.15)'}`,
                    color: copied ? '#22c55e' : 'rgba(255,255,255,0.8)',
                  }}
                >
                  {copied ? (isAr ? '✓ تم النسخ!' : '✓ Copied!') : (isAr ? '↗ مشاركة نتيجتي' : '↗ Share my score')}
                </button>
                <button
                  onClick={handleRestart}
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                >
                  {isAr ? '↺ إعادة الاختبار' : '↺ Try Again'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  )
}
