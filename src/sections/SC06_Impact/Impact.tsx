import { motion } from 'framer-motion'
import { SectionWrapper } from '../../components/layout/SectionWrapper'
import { useTranslation } from '../../hooks/useTranslation'

export default function Impact() {
  const t = useTranslation()
  const i = t.impact

  return (
    <SectionWrapper id="c-impact" fullHeight={false}>
      <div className="space-y-14">
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-5xl font-black">{i.title}</h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">{i.subtitle}</p>
        </div>

        {/* Historical */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-text-primary border-b border-border pb-2">{i.historicalContext}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {i.historical.map((h) => (
              <motion.div
                key={h.city}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border p-6 space-y-4"
                style={{ borderColor: h.color + '40', backgroundColor: h.color + '08' }}
              >
                <div>
                  <h4 className="text-2xl font-black" style={{ color: h.color }}>{h.city}</h4>
                  <p className="text-text-muted text-sm">{h.date} · {h.yield}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-3xl font-black text-text-primary">{h.instant}</div>
                    <div className="text-xs text-text-muted mt-1">{i.killedInstantly}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-text-primary">{h.total}</div>
                    <div className="text-xs text-text-muted mt-1">{i.deadByDecember}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-0.5 pt-2 opacity-60">
                  {Array.from({ length: Math.min(140, parseInt(h.total.replace(/[^0-9]/g, '')) / 1000) }).map((_, idx) => (
                    <div key={idx} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: h.color }} />
                  ))}
                  <span className="text-[10px] text-text-muted ml-1 self-center">{i.eachDot}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Modern Arsenal */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-text-primary border-b border-border pb-2">{i.modernArsenal}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {i.scaleCards.map((card) => (
              <motion.div
                key={card.value}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="rounded-2xl border p-6 space-y-2"
                style={{ borderColor: card.color + '30', backgroundColor: card.color + '08' }}
              >
                <div className="text-4xl md:text-5xl font-black" style={{ color: card.color }}>{card.value}</div>
                <p className="text-text-secondary text-sm leading-relaxed">{card.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* If Used Today */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-text-primary border-b border-border pb-2">{i.ifUsedToday}</h3>
          <p className="text-text-muted text-sm">{i.ifUsedTodaySubtitle}</p>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-secondary border-b border-border">
                  <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider">{i.tableHeaders.city}</th>
                  <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider">{i.tableHeaders.weapon}</th>
                  <th className="text-right px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider">{i.tableHeaders.deaths}</th>
                </tr>
              </thead>
              <tbody>
                {i.cityCasualties.map((row, idx) => (
                  <tr key={row.city} className={`border-b border-border last:border-0 ${idx % 2 === 0 ? 'bg-transparent' : 'bg-bg-secondary/40'}`}>
                    <td className="px-4 py-3 font-semibold text-text-primary">{row.city}</td>
                    <td className="px-4 py-3 text-text-muted text-xs">{row.warhead}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-red-400">{row.deaths}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-text-muted text-xs">{i.ifUsedTodayDisclaimer}</p>
        </div>

        {/* The Thin Line */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-text-primary border-b border-border pb-2">{i.thinLine}</h3>
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-950/10 p-6 text-center">
            <p
              className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed [&_b]:text-yellow-400 [&_b]:font-bold"
              dangerouslySetInnerHTML={{ __html: i.thinLineParagraph }}
            />
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider">{i.closeCallsTitle}</h4>
            <div className="relative ps-8">
              <div className="absolute start-3 top-0 bottom-0 w-px bg-border" />
              {i.closeCallsList.map((cc, idx) => (
                <motion.div
                  key={cc.year + cc.event}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative mb-6 last:mb-0"
                >
                  <div className="absolute -start-5 top-1 w-3 h-3 rounded-full bg-red-500 border-2 border-bg-primary" />
                  <div className="text-xs text-red-400 font-mono font-bold mb-0.5">{cc.year}</div>
                  <div className="font-bold text-text-primary text-sm">{cc.event}</div>
                  <p className="text-text-muted text-xs mt-1 leading-relaxed">{cc.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
