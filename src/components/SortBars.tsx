import { cn } from '@/lib/utils'
import type { SortStep } from '@/types/sorting'

interface SortBarsProps {
  step: SortStep
}

export function SortBars({ step }: SortBarsProps) {
  const { array, comparing = [], swapping = [], sorted = [], pivot, active = [] } = step
  const max = Math.max(...array, 1)

  return (
    <div className="flex h-64 w-full items-end gap-[2px] rounded-lg border bg-muted/30 p-3 sm:gap-1">
      {array.map((value, idx) => {
        const isComparing = comparing.includes(idx)
        const isSwapping = swapping.includes(idx)
        const isSorted = sorted.includes(idx)
        const isPivot = pivot === idx
        const isActive = active.includes(idx)

        return (
          <div
            key={idx}
            className="flex flex-1 flex-col items-center justify-end"
            style={{ height: '100%' }}
          >
            <div
              className={cn(
                'w-full rounded-t-sm transition-all duration-150 ease-out',
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
            {array.length <= 30 && (
              <span className="mt-1 text-[10px] leading-none text-muted-foreground tabular-nums">
                {value}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
