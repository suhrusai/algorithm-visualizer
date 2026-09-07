import { cn } from '@/lib/utils'
import type { DpStep } from '@/types/dp'

interface DpTableProps {
  step: DpStep
  rowLabels: string[]
  colLabels: string[]
}

const key = (r: number, c: number) => `${r},${c}`

export function DpTable({ step, rowLabels, colLabels }: DpTableProps) {
  const { grid, cursor, from = [], path = [] } = step
  const fromSet = new Set(from.map(([r, c]) => key(r, c)))
  const pathSet = new Set(path.map(([r, c]) => key(r, c)))
  const single = grid.length === 1

  return (
    <div className="overflow-x-auto rounded-lg border bg-muted/30 p-3">
      <table className="border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="w-10" />
            {colLabels.map((label, c) => (
              <th key={c} className="min-w-9 px-1 text-center text-[11px] font-medium text-muted-foreground">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.map((rowVals, r) => (
            <tr key={r}>
              {!single && (
                <th className="px-1 text-right text-[11px] font-medium text-muted-foreground">
                  {rowLabels[r] ?? r}
                </th>
              )}
              {single && <th className="px-1 text-right text-[11px] font-medium text-muted-foreground">{rowLabels[0]}</th>}
              {rowVals.map((v, c) => {
                const isCursor = cursor && cursor[0] === r && cursor[1] === c
                const isFrom = fromSet.has(key(r, c))
                const isPath = pathSet.has(key(r, c))
                const display = v === null ? '' : v >= 9999 ? '∞' : String(v)
                return (
                  <td
                    key={c}
                    className={cn(
                      'h-9 min-w-9 rounded-md border text-center text-sm tabular-nums transition-colors duration-150',
                      v === null ? 'bg-background/40 text-muted-foreground' : 'bg-card text-foreground',
                      isFrom && 'border-blue-400 bg-blue-400/15 dark:border-blue-500',
                      isPath && 'border-emerald-500 bg-emerald-500/20 font-semibold',
                      isCursor && 'border-amber-400 bg-amber-400/25 font-semibold dark:border-amber-500',
                    )}
                  >
                    {display}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
