import { useRef } from 'react'
import { cn } from '@/lib/utils'
import type { Grid, PathStep } from '@/types/pathfinding'

export type PaintAction =
  | { kind: 'terrain'; index: number; value: 0 | 1 | 2 }
  | { kind: 'move'; endpoint: 'start' | 'goal'; index: number }

interface GridCanvasProps {
  grid: Grid
  step: PathStep
  editable: boolean
  brush: 'wall' | 'weight'
  onPaint: (action: PaintAction) => void
}

export function GridCanvas({ grid, step, editable, brush, onPaint }: GridCanvasProps) {
  const drag = useRef<null | { mode: 'draw' | 'erase' | 'start' | 'goal' }>(null)

  const visited = new Set(step.visited)
  const frontier = new Set(step.frontier)
  const path = new Set(step.path ?? [])

  const begin = (i: number) => {
    if (!editable) return
    if (i === grid.start) drag.current = { mode: 'start' }
    else if (i === grid.goal) drag.current = { mode: 'goal' }
    else if (grid.terrain[i] === 0) {
      drag.current = { mode: 'draw' }
      onPaint({ kind: 'terrain', index: i, value: brush === 'weight' ? 2 : 1 })
    } else {
      drag.current = { mode: 'erase' }
      onPaint({ kind: 'terrain', index: i, value: 0 })
    }
  }

  const enter = (i: number) => {
    if (!editable || !drag.current) return
    const m = drag.current.mode
    if (m === 'start' || m === 'goal') {
      if (i !== grid.start && i !== grid.goal && grid.terrain[i] !== 1) {
        onPaint({ kind: 'move', endpoint: m, index: i })
      }
    } else if (i !== grid.start && i !== grid.goal) {
      onPaint({ kind: 'terrain', index: i, value: m === 'draw' ? (brush === 'weight' ? 2 : 1) : 0 })
    }
  }

  const end = () => {
    drag.current = null
  }

  return (
    <div
      className="overflow-x-auto rounded-lg border bg-muted/30 p-2 select-none"
      onMouseLeave={end}
      onMouseUp={end}
    >
      <div
        className="grid gap-px"
        style={{ gridTemplateColumns: `repeat(${grid.cols}, minmax(0, 1fr))`, minWidth: grid.cols * 16 }}
      >
        {grid.terrain.map((t, i) => {
          const isStart = i === grid.start
          const isGoal = i === grid.goal
          const onPath = path.has(i)
          return (
            <div
              key={i}
              onMouseDown={() => begin(i)}
              onMouseEnter={() => enter(i)}
              className={cn(
                'aspect-square w-full rounded-[2px] transition-colors duration-150',
                'bg-card',
                t === 1 && 'bg-foreground/80',
                t === 2 && 'bg-orange-300/50 dark:bg-orange-400/30',
                visited.has(i) && t !== 1 && 'bg-sky-300/60 dark:bg-sky-500/40',
                frontier.has(i) && t !== 1 && 'bg-amber-300/70 dark:bg-amber-500/50',
                onPath && 'bg-emerald-400 dark:bg-emerald-500',
                isStart && 'bg-emerald-600 dark:bg-emerald-500',
                isGoal && 'bg-rose-500',
                editable && 'cursor-pointer',
              )}
              title={isStart ? 'start' : isGoal ? 'goal' : undefined}
            />
          )
        })}
      </div>
    </div>
  )
}
