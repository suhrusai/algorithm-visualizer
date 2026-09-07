import type { Grid, PathStep } from '@/types/pathfinding'

export interface RaceLane {
  id: string
  name: string
  /** tailwind-ish hex trio: [visited tint, frontier, path] */
  colors: { visited: string; frontier: string; path: string }
  step: PathStep
}

interface Props {
  grid: Grid
  lanes: RaceLane[]
}

/**
 * All racers on one grid. Each cell is tinted by the racer(s) that have
 * reached it; cells reached by more than one racer are drawn darker
 * ("contested"). Each racer's path is stroked in its own colour.
 */
export function MultiGridCanvas({ grid, lanes }: Props) {
  const cols = grid.cols
  const cell = 100 / cols
  const rows = grid.rows

  // Per-cell: which lanes have visited / have in frontier / have on path.
  const visitedBy: number[][] = Array.from({ length: grid.terrain.length }, () => [])
  const frontierBy: number[][] = Array.from({ length: grid.terrain.length }, () => [])
  const pathBy: number[][] = Array.from({ length: grid.terrain.length }, () => [])
  lanes.forEach((lane, li) => {
    for (const i of lane.step.visited) visitedBy[i].push(li)
    for (const i of lane.step.frontier) frontierBy[i].push(li)
    for (const i of lane.step.path ?? []) pathBy[i].push(li)
  })

  return (
    <div className="overflow-x-auto rounded-lg border bg-muted/30 p-2">
      <svg
        viewBox={`0 0 100 ${(rows * 100) / cols}`}
        className="w-full"
        style={{ minWidth: cols * 14 }}
        role="img"
        aria-label="Pathfinding race grid"
      >
        {grid.terrain.map((t, i) => {
          const r = Math.floor(i / cols)
          const c = i % cols
          const x = c * cell
          const y = r * cell
          const isStart = i === grid.start
          const isGoal = i === grid.goal

          let fill = 'var(--card, #fff)'
          let opacity = 1
          if (t === 1) fill = 'rgba(120,120,130,0.9)'
          else if (t === 2) fill = 'rgba(251,146,60,0.25)'

          const vb = visitedBy[i]
          const fb = frontierBy[i]
          const pb = pathBy[i]
          if (t !== 1) {
            if (pb.length > 0) {
              fill = lanes[pb[0]].colors.path
            } else if (fb.length > 0) {
              fill = fb.length > 1 ? 'rgba(180,140,255,0.5)' : lanes[fb[0]].colors.frontier
            } else if (vb.length > 0) {
              fill = vb.length > 1 ? 'rgba(80,90,120,0.35)' : lanes[vb[0]].colors.visited
              opacity = vb.length > 1 ? 1 : 0.9
            }
          }
          if (isStart) fill = '#059669'
          if (isGoal) fill = '#e11d48'

          return (
            <rect
              key={i}
              x={x + 0.15}
              y={y + 0.15}
              width={cell - 0.3}
              height={cell - 0.3}
              rx={0.4}
              fill={fill}
              fillOpacity={opacity}
              stroke="rgba(0,0,0,0.06)"
              strokeWidth={0.1}
            />
          )
        })}
      </svg>
    </div>
  )
}
