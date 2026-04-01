import { useRef, useCallback, useEffect, useState } from 'react'

/**
 * Generates a Geiger counter click using the Web Audio API.
 * No audio files needed — synthesized from scratch.
 */
function createGeigerClick(ctx: AudioContext) {
  const bufferSize = ctx.sampleRate * 0.04 // 40ms
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.008))
  }

  const source = ctx.createBufferSource()
  source.buffer = buffer

  // Band-pass filter to get that distinctive Geiger click tone
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 3000
  filter.Q.value = 0.5

  const gain = ctx.createGain()
  gain.gain.value = 0.4

  source.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  source.start()
}

export function useGeiger(enabled: boolean, ratePerSecond = 0.8) {
  const ctxRef = useRef<AudioContext | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    return ctxRef.current
  }, [])

  useEffect(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    if (!enabled) return

    // Poisson-distributed clicks for realism
    const scheduleNext = () => {
      const delay = -Math.log(1 - Math.random()) / ratePerSecond * 1000
      intervalRef.current = setTimeout(() => {
        try {
          const ctx = getCtx()
          if (ctx.state === 'suspended') ctx.resume()
          createGeigerClick(ctx)
        } catch { /* silently ignore */ }
        scheduleNext()
      }, delay)
    }
    scheduleNext()

    return () => { if (intervalRef.current) clearTimeout(intervalRef.current) }
  }, [enabled, ratePerSecond, getCtx])

  // Cleanup on unmount
  useEffect(() => () => {
    if (intervalRef.current) clearTimeout(intervalRef.current)
    ctxRef.current?.close()
  }, [])
}

/** Hook that returns a toggle function + enabled state for the Geiger sound */
export function useGeigerToggle(defaultRate = 1.0) {
  const [enabled, setEnabled] = useState(false)
  useGeiger(enabled, defaultRate)
  const toggle = useCallback(() => setEnabled(e => !e), [])
  return { enabled, toggle }
}
