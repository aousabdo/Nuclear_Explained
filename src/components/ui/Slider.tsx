import { useCallback, useMemo } from 'react'

interface SliderProps {
  min: number
  max: number
  value: number
  onChange: (value: number) => void
  label: string
  unit?: string
  accentColor?: string
  logarithmic?: boolean
  step?: number
  formatValue?: (value: number) => string
}

export function Slider({
  min, max, value, onChange, label, unit = '',
  accentColor = '#3b82f6', logarithmic = false,
  step, formatValue,
}: SliderProps) {
  // For logarithmic sliders, map internal 0-1000 range to exponential output
  const internalValue = useMemo(() => {
    if (!logarithmic) return value
    if (value <= 0) return 0
    const logMin = Math.log10(Math.max(min, 0.001))
    const logMax = Math.log10(max)
    return ((Math.log10(value) - logMin) / (logMax - logMin)) * 1000
  }, [value, min, max, logarithmic])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseFloat(e.target.value)
    if (logarithmic) {
      const logMin = Math.log10(Math.max(min, 0.001))
      const logMax = Math.log10(max)
      const logValue = logMin + (raw / 1000) * (logMax - logMin)
      onChange(Math.pow(10, logValue))
    } else {
      onChange(raw)
    }
  }, [logarithmic, min, max, onChange])

  const displayValue = formatValue
    ? formatValue(value)
    : `${value < 10 ? value.toFixed(1) : Math.round(value).toLocaleString()} ${unit}`

  const percentage = logarithmic
    ? (internalValue / 1000) * 100
    : ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-sm">
        <span className="text-text-secondary font-medium">{label}</span>
        <span className="text-text-primary font-mono text-sm tabular-nums">{displayValue}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={logarithmic ? 0 : min}
          max={logarithmic ? 1000 : max}
          step={logarithmic ? 1 : (step ?? (max - min) / 1000)}
          value={internalValue}
          onChange={handleChange}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${percentage}%, #1e293b ${percentage}%, #1e293b 100%)`,
            // WebKit thumb styling
            WebkitAppearance: 'none',
          }}
        />
      </div>
    </div>
  )
}
