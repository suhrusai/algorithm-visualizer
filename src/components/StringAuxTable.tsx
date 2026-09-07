import { cn } from '@/lib/utils'
import type { StringTable } from '@/types/stringmatch'

export function StringAuxTable({ table, pattern }: { table: StringTable; pattern: string }) {
  const showChars = table.under === 'pattern' && table.values.length === pattern.length

  return (
    <div className="overflow-x-auto rounded-lg border bg-card p-3">
      <div className="mb-2 text-xs font-semibold text-muted-foreground">{table.label}</div>
      <div className="inline-flex gap-1 font-mono text-sm">
        {table.values.map((v, i) => (
          <div key={i} className="flex flex-col items-center">
            {showChars && (
              <span className="text-[10px] leading-none text-muted-foreground">{pattern[i]}</span>
            )}
            <div
              className={cn(
                'mt-0.5 flex h-7 min-w-7 items-center justify-center rounded border bg-background px-1 text-xs',
                table.highlight === i && 'border-amber-400 bg-amber-400/25 font-semibold dark:border-amber-500',
              )}
            >
              {v}
            </div>
            <span className="mt-0.5 text-[9px] leading-none text-muted-foreground tabular-nums">{i}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
