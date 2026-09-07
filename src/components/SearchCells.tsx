import { cn } from '@/lib/utils'
import type { SearchStep } from '@/types/searching'

interface SearchCellsProps {
  step: SearchStep
}

export function SearchCells({ step }: SearchCellsProps) {
  const { array, lo, hi, probe, eliminated = [], found } = step
  const hasWindow = lo !== undefined && hi !== undefined

  return (
    <div className="overflow-x-auto rounded-lg border bg-muted/30 p-4">
      <div className="flex min-w-max gap-1">
        {array.map((value, idx) => {
          const inWindow = hasWindow && idx >= lo && idx <= hi
          const isProbe = probe === idx
          const isFound = found === idx
          const isEliminated = eliminated.includes(idx) && !isFound

          return (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-md border text-sm font-medium tabular-nums transition-colors duration-150',
                  'bg-card text-foreground',
                  hasWindow && !inWindow && 'opacity-40',
                  isEliminated && 'bg-muted text-muted-foreground line-through opacity-50',
                  inWindow && !isProbe && !isFound && 'border-blue-400/70 bg-blue-400/10 dark:border-blue-500/60',
                  isProbe && !isFound && 'border-amber-400 bg-amber-400/20 dark:border-amber-500',
                  isFound && 'border-emerald-500 bg-emerald-500/20 text-foreground',
                )}
              >
                {value}
              </div>
              <span className="text-[10px] leading-none text-muted-foreground tabular-nums">{idx}</span>
              <div className="flex h-3 items-center text-[10px] font-medium leading-none">
                {lo === idx && <span className="text-blue-500 dark:text-blue-400">lo</span>}
                {probe === idx && <span className="ml-0.5 text-amber-600 dark:text-amber-400">▲</span>}
                {hi === idx && <span className="ml-0.5 text-blue-500 dark:text-blue-400">hi</span>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
