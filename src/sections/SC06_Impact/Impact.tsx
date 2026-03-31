import { motion } from 'framer-motion'
import { SectionWrapper } from '../../components/layout/SectionWrapper'

const HISTORICAL = [
  {
    city: 'Hiroshima',
    date: 'August 6, 1945',
    yield: '15 kt',
    instant: '70,000–80,000',
    total: '140,000',
    color: '#f59e0b',
  },
  {
    city: 'Nagasaki',
    date: 'August 9, 1945',
    yield: '21 kt',
    instant: '~40,000',
    total: '~80,000',
    color: '#ef4444',
  },
]

const SCALE_CARDS = [
  {
    value: '30×',
    label: 'A modern W88 warhead (475 kt) is 30× more powerful than Little Boy',
    color: '#f59e0b',
  },
  {
    value: '10',
    label: "Russia's SS-18 missile carries 10 warheads, each 500–800 kt",
    color: '#3b82f6',
  },
  {
    value: '~11,000',
    label: 'The US and Russia together currently possess roughly 11,000 nuclear warheads',
    color: '#ef4444',
  },
  {
    value: '5 billion',
    label: 'A full nuclear exchange would kill 5 billion people through nuclear winter',
    color: '#a855f7',
  },
]

const CITY_CASUALTIES = [
  { city: 'New York City', warhead: 'W88 (475 kt)', deaths: '~2.4 million' },
  { city: 'London', warhead: 'W88 (475 kt)', deaths: '~800,000' },
  { city: 'Tehran', warhead: 'W88 (475 kt)', deaths: '~700,000' },
  { city: 'Moscow', warhead: 'W88 (475 kt)', deaths: '~1.2 million' },
]

const CLOSE_CALLS = [
  { year: 1962, event: 'Cuban Missile Crisis', desc: 'The world came within hours of nuclear war as US and Soviet forces confronted each other over missiles in Cuba.' },
  { year: 1983, event: 'Able Archer 83', desc: 'A NATO exercise so realistic it convinced Soviet leadership that nuclear war was imminent. Soviet forces went to high alert.' },
  { year: 1983, event: 'Stanislav Petrov Incident', desc: 'A Soviet early-warning system falsely reported 5 US missiles inbound. Lt. Col. Petrov trusted his instincts and did not report it as an attack.' },
  { year: 1995, event: 'Norwegian Rocket Incident', desc: "A Norwegian scientific rocket was mistaken for a US Trident missile. Boris Yeltsin activated Russia's nuclear briefcase — the first time it was ever opened in a real scenario." },
]

export default function Impact() {
  return (
    <SectionWrapper id="c-impact" fullHeight={false}>
      <div className="space-y-14">
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-5xl font-black">The Human Cost</h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Numbers this large are hard to comprehend. These are real people.
          </p>
        </div>

        {/* Historical */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-text-primary border-b border-border pb-2">Historical Context</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HISTORICAL.map((h) => (
              <motion.div
                key={h.city}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl border p-6 space-y-4"
                style={{ borderColor: h.color + '40', backgroundColor: h.color + '08' }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-2xl font-black" style={{ color: h.color }}>{h.city}</h4>
                    <p className="text-text-muted text-sm">{h.date} · {h.yield}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-3xl font-black text-text-primary">{h.instant}</div>
                    <div className="text-xs text-text-muted mt-1">killed instantly</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-text-primary">{h.total}</div>
                    <div className="text-xs text-text-muted mt-1">dead by December 1945</div>
                  </div>
                </div>
                {/* Simple dot waffle */}
                <div className="flex flex-wrap gap-0.5 pt-2 opacity-60">
                  {Array.from({ length: Math.min(140, parseInt(h.total.replace(/[^0-9]/g, '')) / 1000) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: h.color }}
                    />
                  ))}
                  <span className="text-[10px] text-text-muted ml-1 self-center">each dot = 1,000 people</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scale comparison */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-text-primary border-b border-border pb-2">The Modern Arsenal</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SCALE_CARDS.map((card) => (
              <motion.div
                key={card.value}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="rounded-2xl border p-6 space-y-2"
                style={{ borderColor: card.color + '30', backgroundColor: card.color + '08' }}
              >
                <div className="text-4xl md:text-5xl font-black" style={{ color: card.color }}>
                  {card.value}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{card.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* If used today */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-text-primary border-b border-border pb-2">If Used Today...</h3>
          <p className="text-text-muted text-sm">
            Estimated immediate deaths from a single W88 warhead (475 kt) detonated over major cities.
          </p>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-secondary border-b border-border">
                  <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider">City</th>
                  <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider">Weapon</th>
                  <th className="text-right px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider">Immediate Deaths</th>
                </tr>
              </thead>
              <tbody>
                {CITY_CASUALTIES.map((row, i) => (
                  <tr
                    key={row.city}
                    className={`border-b border-border last:border-0 ${i % 2 === 0 ? 'bg-transparent' : 'bg-bg-secondary/40'}`}
                  >
                    <td className="px-4 py-3 font-semibold text-text-primary">{row.city}</td>
                    <td className="px-4 py-3 text-text-muted text-xs">{row.warhead}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-red-400">{row.deaths}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-text-muted text-xs">
            * Rough estimates based on blast zones × population density. Actual numbers depend on time of day, weather, and many other factors.
          </p>
        </div>

        {/* The Thin Line */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-text-primary border-b border-border pb-2">The Thin Line</h3>
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-950/10 p-6 text-center space-y-4">
            <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
              Since 1945, nuclear weapons have been used <span className="text-yellow-400 font-bold">twice</span>.
              There have been over <span className="text-yellow-400 font-bold">2,000</span> nuclear tests.
              <span className="text-yellow-400 font-bold"> 9</span> countries currently possess them.
              Multiple close calls nearly ended civilization.
              The "nuclear taboo" has held — but barely.
            </p>
          </div>

          {/* Close calls timeline */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Close Calls</h4>
            <div className="relative pl-8">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
              {CLOSE_CALLS.map((cc, i) => (
                <motion.div
                  key={cc.year + cc.event}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative mb-6 last:mb-0"
                >
                  <div className="absolute -left-5 top-1 w-3 h-3 rounded-full bg-red-500 border-2 border-bg-primary" />
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
