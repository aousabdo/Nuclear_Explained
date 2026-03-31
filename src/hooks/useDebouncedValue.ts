import { useDebouncedCallback } from 'use-debounce'
import { useState, useEffect } from 'react'

export function useDebouncedValue<T>(value: T, delay = 150): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  const debounced = useDebouncedCallback((val: T) => {
    setDebouncedValue(val)
  }, delay)

  useEffect(() => {
    debounced(value)
  }, [value, debounced])

  return debouncedValue
}
