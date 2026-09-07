import { useCallback, useEffect, useRef, useState } from 'react'

export function useStepPlayer(stepCount: number, initialSpeed = 1) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(initialSpeed)
  const timeoutRef = useRef<number | null>(null)

  const clampedStepCount = Math.max(stepCount, 1)

  const clear = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!playing) return
    if (index >= clampedStepCount - 1) {
      setPlaying(false)
      return
    }
    // Below ~25x, one step per tick with a shrinking delay. Above that the
    // delay floors out, so advance several steps per tick instead.
    const baseDelay = 500
    const stepsPerTick = speed <= 25 ? 1 : Math.ceil(speed / 25)
    const delay = Math.max(16, (baseDelay / speed) * stepsPerTick)
    timeoutRef.current = window.setTimeout(() => {
      setIndex((i) => Math.min(i + stepsPerTick, clampedStepCount - 1))
    }, delay)
    return clear
  }, [playing, index, speed, clampedStepCount, clear])

  const play = useCallback(() => {
    if (index >= clampedStepCount - 1) setIndex(0)
    setPlaying(true)
  }, [index, clampedStepCount])

  const pause = useCallback(() => setPlaying(false), [])

  const toggle = useCallback(() => {
    setPlaying((p) => {
      if (!p && index >= clampedStepCount - 1) setIndex(0)
      return !p
    })
  }, [index, clampedStepCount])

  const stepForward = useCallback(() => {
    setPlaying(false)
    setIndex((i) => Math.min(i + 1, clampedStepCount - 1))
  }, [clampedStepCount])

  const stepBackward = useCallback(() => {
    setPlaying(false)
    setIndex((i) => Math.max(i - 1, 0))
  }, [])

  const reset = useCallback(() => {
    setPlaying(false)
    setIndex(0)
  }, [])

  const seek = useCallback(
    (value: number) => {
      setPlaying(false)
      setIndex(Math.min(Math.max(value, 0), clampedStepCount - 1))
    },
    [clampedStepCount],
  )

  return {
    index,
    playing,
    speed,
    setSpeed,
    play,
    pause,
    toggle,
    stepForward,
    stepBackward,
    reset,
    seek,
    isFirst: index === 0,
    isLast: index >= clampedStepCount - 1,
  }
}
