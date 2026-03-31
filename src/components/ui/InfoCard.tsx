import { AnimatedNumber } from './AnimatedNumber'

interface InfoCardProps {
  label: string
  value: number
  unit?: string
  accentColor?: string
  formatValue?: (v: number) => string
  icon?: React.ReactNode
}

export function InfoCard({ label, value, unit, accentColor = '#3b82f6', formatValue, icon }: InfoCardProps) {
  return (
    <div
      className="bg-bg-card rounded-lg p-3 border-l-3"
      style={{ borderLeftColor: accentColor }}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-lg">{icon}</span>}
        <span className="text-text-muted text-xs uppercase tracking-wider font-medium">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <AnimatedNumber value={value} formatValue={formatValue} />
        {unit && <span className="text-text-secondary text-sm">{unit}</span>}
      </div>
    </div>
  )
}
