import { useEffect, useRef, useState } from 'react'

interface AnimatedNumberProps {
  value: number
  duration?: number
  formatValue?: (v: number) => string
  className?: string
}

export function AnimatedNumber({
  value,
  duration = 400,
  formatValue,
  className = 'text-xl font-semibold text-text-primary tabular-nums font-mono',
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const prevValue = useRef(value)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const start = prevValue.current
    const end = value
    const startTime = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(start + (end - start) * eased)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        prevValue.current = end
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [value, duration])

  const formatted = formatValue
    ? formatValue(displayValue)
    : displayValue < 0.01
      ? displayValue.toExponential(2)
      : displayValue < 10
        ? displayValue.toFixed(2)
        : Math.round(displayValue).toLocaleString()

  return <span className={className}>{formatted}</span>
}
