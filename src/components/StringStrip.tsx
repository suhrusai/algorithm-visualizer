import { cn } from '@/lib/utils'
import type { StringStep } from '@/types/stringmatch'

interface StringStripProps {
  text: string
  pattern: string
  step: StringStep
}

export function StringStrip({ text, pattern, step }: StringStripProps) {
  const { offset, textIndex, patIndex, matched = [], mismatch, found = [] } = step
  const matchedSet = new Set(matched)
  const foundRanges = found.map((f) => [f, f + pattern.length - 1] as const)
  const inFound = (i: number) => foundRanges.some(([a, b]) => i >= a && i <= b)

  return (
    <div className="overflow-x-auto rounded-lg border bg-muted/30 p-4">
      <div className="inline-flex flex-col gap-1 font-mono">
        {/* text row */}
        <div className="flex gap-1">
          {text.split('').map((ch, i) => (
            <Cell
              key={i}
              ch={ch}
              index={i}
              className={cn(
                inFound(i) && 'border-emerald-500 bg-emerald-500/20',
                matchedSet.has(i) && 'border-emerald-400 bg-emerald-400/15',
                mismatch === i && 'border-rose-500 bg-rose-500/20',
                textIndex === i && 'border-amber-400 bg-amber-400/25 dark:border-amber-500',
              )}
            />
          ))}
        </div>
        {/* pattern row, shifted to the current offset */}
        <div className="flex gap-1" style={{ marginLeft: `calc(${offset} * (1.75rem + 0.25rem))` }}>
          {pattern.split('').map((ch, j) => (
            <Cell
              key={j}
              ch={ch}
              className={cn(
                'bg-card',
                j < (patIndex ?? -1) && 'border-emerald-400 bg-emerald-400/15',
                patIndex === j && 'border-amber-400 bg-amber-400/25 dark:border-amber-500',
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function Cell({ ch, index, className }: { ch: string; index?: number; className?: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded border bg-background text-sm transition-colors duration-150',
          className,
        )}
      >
        {ch}
      </div>
      {index !== undefined && (
        <span className="mt-0.5 text-[9px] leading-none text-muted-foreground tabular-nums">{index}</span>
      )}
    </div>
  )
}
