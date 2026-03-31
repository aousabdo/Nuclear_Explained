import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { useTranslation } from '../../hooks/useTranslation'

type Tab = 'fission' | 'fusion'

export default function Basics() {
  const [activeTab, setActiveTab] = useState<Tab>('fission')
  const t = useTranslation()
  const tb = t.expert.basics

  return (
    <SectionWrapper id="basics" fullHeight={false}>
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">
            {tb.title}
          </h2>
          <p className="text-text-secondary max-w-3xl">
            {tb.subtitle}
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex gap-2">
          {(['fission', 'fusion'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? tab === 'fission'
                    ? 'bg-radiation/20 text-radiation border border-radiation/30'
                    : 'bg-blast/20 text-blast border border-blast/30'
                  : 'bg-bg-card text-text-secondary border border-border hover:text-text-primary'
              }`}
            >
              {tab === 'fission' ? tb.tabFission : tb.tabFusion}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'fission' ? (
            <motion.div
              key="fission"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Fission Diagram */}
              <div className="bg-bg-secondary rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-radiation mb-4">{tb.fission.diagramTitle}</h3>
                <svg viewBox="0 0 400 300" className="w-full">
                  {/* Incoming neutron */}
                  <motion.circle cx={60} cy={150} r={6} fill="#22c55e"
                    animate={{ cx: [20, 100] }} transition={{ duration: 2, repeat: Infinity }} />
                  <text x={20} y={135} fill="#94a3b8" fontSize={10} fontFamily="Inter">neutron</text>

                  {/* U-235 nucleus */}
                  <circle cx={150} cy={150} r={30} fill="rgba(34, 197, 94, 0.15)" stroke="#22c55e" strokeWidth={2} />
                  <text x={150} y={155} fill="#22c55e" fontSize={12} textAnchor="middle" fontFamily="Inter" fontWeight={600}>U-235</text>

                  {/* Fission products */}
                  <motion.g animate={{ x: [0, 40], y: [0, -30] }} transition={{ duration: 2, delay: 1, repeat: Infinity }}>
                    <circle cx={230} cy={130} r={18} fill="rgba(239, 68, 68, 0.15)" stroke="#ef4444" strokeWidth={1.5} />
                    <text x={230} y={134} fill="#ef4444" fontSize={9} textAnchor="middle" fontFamily="Inter">Ba-141</text>
                  </motion.g>
                  <motion.g animate={{ x: [0, 40], y: [0, 30] }} transition={{ duration: 2, delay: 1, repeat: Infinity }}>
                    <circle cx={230} cy={170} r={15} fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth={1.5} />
                    <text x={230} y={174} fill="#f59e0b" fontSize={9} textAnchor="middle" fontFamily="Inter">Kr-92</text>
                  </motion.g>

                  {/* Released neutrons */}
                  {[{ dx: 50, dy: -50 }, { dx: 60, dy: 0 }, { dx: 50, dy: 50 }].map((n, i) => (
                    <motion.circle
                      key={i} cx={200} cy={150} r={4} fill="#22c55e"
                      animate={{ cx: 200 + n.dx * 2, cy: 150 + n.dy * 2, opacity: [0, 1, 0.5] }}
                      transition={{ duration: 2, delay: 1.2 + i * 0.2, repeat: Infinity }}
                    />
                  ))}

                  {/* Energy label */}
                  <text x={200} y={260} fill="#f59e0b" fontSize={14} textAnchor="middle" fontFamily="Inter" fontWeight={700}>
                    ~200 MeV per fission
                  </text>
                  <text x={200} y={280} fill="#94a3b8" fontSize={10} textAnchor="middle" fontFamily="Inter">
                    + 2-3 neutrons → chain reaction
                  </text>
                </svg>
              </div>

              {/* Fission explanation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">{tb.fission.sectionTitle}</h3>
                <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
                  <p>{tb.fission.body1}</p>
                  <p>
                    {tb.fission.body2.split('chain reaction').length > 1 ? (
                      <>
                        {tb.fission.body2.split('chain reaction')[0]}
                        <span className="text-radiation font-medium">
                          {t.expert.basics.tabFission === 'Fission' ? 'chain reaction' : 'تفاعل متسلسل'}
                        </span>
                        {tb.fission.body2.split('chain reaction')[1]}
                      </>
                    ) : tb.fission.body2}
                  </p>

                  <div className="bg-bg-card rounded p-3 border border-border space-y-2">
                    <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">{tb.fission.assemblyTitle}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-medium text-thermal">{tb.fission.gunType}</p>
                        <p className="text-xs text-text-muted">{tb.fission.gunTypeDesc}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-blast">{tb.fission.implosion}</p>
                        <p className="text-xs text-text-muted">{tb.fission.implosionDesc}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-bg-card rounded p-3 border border-border">
                    <p className="text-xs text-text-muted">
                      <span className="text-text-primary font-medium">{tb.fission.keyStat} </span>
                      {tb.fission.keyStatText}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="fusion"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Fusion Diagram */}
              <div className="bg-bg-secondary rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-blast mb-4">{tb.fusion.diagramTitle}</h3>
                <svg viewBox="0 0 400 300" className="w-full">
                  {/* Deuterium */}
                  <motion.circle cx={100} cy={130} r={20} fill="rgba(59, 130, 246, 0.15)" stroke="#3b82f6" strokeWidth={2}
                    animate={{ cx: [80, 160] }} transition={{ duration: 2, repeat: Infinity }} />
                  <text x={80} y={100} fill="#3b82f6" fontSize={11} fontFamily="Inter" fontWeight={600}>Deuterium</text>

                  {/* Tritium */}
                  <motion.circle cx={260} cy={170} r={22} fill="rgba(168, 85, 247, 0.15)" stroke="#a855f7" strokeWidth={2}
                    animate={{ cx: [280, 200] }} transition={{ duration: 2, repeat: Infinity }} />
                  <text x={270} y={205} fill="#a855f7" fontSize={11} fontFamily="Inter" fontWeight={600}>Tritium</text>

                  {/* Products */}
                  <motion.circle cx={200} cy={150} r={25} fill="rgba(251, 191, 36, 0.15)" stroke="#fbbf24" strokeWidth={2}
                    animate={{ scale: [0, 1], opacity: [0, 1] }}
                    transition={{ duration: 0.5, delay: 1.5, repeat: Infinity, repeatDelay: 1.5 }} />
                  <motion.text x={200} y={155} fill="#fbbf24" fontSize={11} textAnchor="middle" fontFamily="Inter" fontWeight={600}
                    animate={{ opacity: [0, 1] }} transition={{ delay: 1.5, repeat: Infinity, repeatDelay: 1.5 }}>
                    He-4
                  </motion.text>

                  {/* Neutron */}
                  <motion.circle cx={200} cy={150} r={6} fill="#22c55e"
                    animate={{ cx: [200, 350], cy: [150, 80], opacity: [0, 1, 0.5] }}
                    transition={{ duration: 1, delay: 1.8, repeat: Infinity, repeatDelay: 1 }} />

                  {/* Energy */}
                  <text x={200} y={260} fill="#f59e0b" fontSize={14} textAnchor="middle" fontFamily="Inter" fontWeight={700}>
                    17.6 MeV per reaction
                  </text>
                  <text x={200} y={280} fill="#94a3b8" fontSize={10} textAnchor="middle" fontFamily="Inter">
                    But much more fuel mass → much higher total yield
                  </text>
                </svg>
              </div>

              {/* Fusion explanation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">{tb.fusion.sectionTitle}</h3>
                <div className="space-y-3 text-text-secondary text-sm leading-relaxed">
                  <p>{tb.fusion.body1}</p>
                  <p>{tb.fusion.body2}</p>

                  <div className="bg-bg-card rounded p-3 border border-border space-y-2">
                    <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">{tb.fusion.tellerUlamTitle}</h4>
                    <p className="text-xs text-text-muted">
                      {tb.fusion.tellerUlamDesc}
                    </p>
                  </div>

                  <div className="bg-bg-card rounded p-3 border border-border">
                    <p className="text-xs text-text-muted">
                      <span className="text-text-primary font-medium">{tb.fusion.yieldComparison} </span>
                      {tb.fusion.yieldComparisonText}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  )
}
