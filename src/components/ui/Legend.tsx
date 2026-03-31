interface LegendItem {
  color: string
  label: string
  dashed?: boolean
}

interface LegendProps {
  items: LegendItem[]
  className?: string
}

export function Legend({ items, className = '' }: LegendProps) {
  return (
    <div className={`flex flex-wrap gap-x-4 gap-y-1.5 text-xs ${className}`}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span
            className="inline-block w-4 h-0.5 rounded"
            style={{
              backgroundColor: item.color,
              borderBottom: item.dashed ? `2px dashed ${item.color}` : undefined,
              height: item.dashed ? 0 : 2,
            }}
          />
          <span className="text-text-secondary">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
