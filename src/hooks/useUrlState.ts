import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

type ParamShape = Record<string, number | string>

/**
 * Sync a small bag of primitive state to the URL query string so a
 * visualization can be linked and restored. Values are read on every render
 * from the URL (the URL is the source of truth); `set` merges and replaces.
 */
export function useUrlState<T extends ParamShape>(defaults: T) {
  const [params, setParams] = useSearchParams()

  const state = useMemo(() => {
    const result = { ...defaults }
    for (const key of Object.keys(defaults) as (keyof T)[]) {
      const raw = params.get(key as string)
      if (raw === null) continue
      if (typeof defaults[key] === 'number') {
        const n = Number(raw)
        if (Number.isFinite(n)) result[key] = n as T[keyof T]
      } else {
        result[key] = raw as T[keyof T]
      }
    }
    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const set = useCallback(
    (patch: Partial<T>) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          for (const [key, value] of Object.entries(patch)) {
            if (value === undefined || value === null || value === defaults[key]) {
              next.delete(key)
            } else {
              next.set(key, String(value))
            }
          }
          return next
        },
        { replace: true },
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setParams],
  )

  return [state, set] as const
}
