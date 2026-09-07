import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import type { SortStep } from '@/types/sorting'

interface SortBarsProps {
  step: SortStep
}

/**
 * Assign every position a stable identity of the form `${value}#${occurrence}`.
 * Sorting only ever permutes the same multiset of values, so a given
 * (value, occurrence) pair exists in every step — just at a different index.
 * Keying the bars by that identity lets React move the same DOM node between
 * positions, so the bars physically slide instead of snapping to new values.
 */
function identities(array: number[]): string[] {
  const seen = new Map<number, number>()
  return array.map((value) => {
    const n = seen.get(value) ?? 0
    seen.set(value, n + 1)
    return `${value}#${n}`
  })
}

export function SortBars({ step }: SortBarsProps) {
  const { array, comparing = [], swapping = [], sorted = [], pivot, active = [] } = step
  const max = Math.max(...array, 1)
  const n = array.length

  const ids = useMemo(() => identities(array), [array])
  const showLabels = n <= 30

  // Render bars in a key-stable order so React reuses each node across steps.
  const bars = ids
    .map((id, idx) => ({ id, idx, value: array[idx] }))
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))

  return (
    <div className="relative h-64 w-full rounded-lg border bg-muted/30 p-3">
      <div className="relative h-full w-full">
        {bars.map(({ id, idx, value }) => {
          const isComparing = comparing.includes(idx)
          const isSwapping = swapping.includes(idx)
          const isSorted = sorted.includes(idx)
          const isPivot = pivot === idx
          const isActive = active.includes(idx)

          return (
            <div
              key={id}
              className="absolute bottom-0 flex flex-col items-center justify-end transition-all duration-300 ease-out"
              style={{
                left: `${(idx * 100) / n}%`,
                width: `${100 / n}%`,
                height: '100%',
                paddingInline: n > 40 ? '0.5px' : '1.5px',
              }}
            >
              <div
                className={cn(
                  'w-full rounded-t-sm transition-[height,background-color] duration-300 ease-out',
                  'bg-primary/40',
                  isActive && 'bg-blue-400/70 dark:bg-blue-500/60',
                  isComparing && 'bg-amber-400 dark:bg-amber-500',
                  isSwapping && 'bg-rose-500 dark:bg-rose-500',
                  isPivot && 'bg-violet-500 dark:bg-violet-400',
                  isSorted && 'bg-emerald-500 dark:bg-emerald-500',
                )}
                style={{ height: `${(value / max) * 100}%` }}
                title={`${value}`}
              />
              {showLabels && (
                <span className="mt-1 text-[10px] leading-none text-muted-foreground tabular-nums">
                  {value}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
