import { cn } from '@/lib/utils'
import type { TreeStep } from '@/types/tree'

interface TreeCanvasProps {
  step: TreeStep
}

export function TreeCanvas({ step }: TreeCanvasProps) {
  const { snapshot, current, visited = [], path = [] } = step
  const { nodes, edges, maxDepth } = snapshot
  const pos = new Map(nodes.map((n) => [n.id, n]))
  const height = 16 + maxDepth * 16
  const pathSet = new Set(path)

  return (
    <div className="rounded-lg border bg-muted/30 p-2">
      <svg
        viewBox={`0 0 100 ${Math.max(height, 24)}`}
        className="h-[20rem] w-full"
        role="img"
        aria-label="Binary search tree visualization"
      >
        {edges.map((edge) => {
          const a = pos.get(edge.parent)
          const b = pos.get(edge.child)
          if (!a || !b) return null
          const onPath = pathSet.has(edge.parent) && pathSet.has(edge.child)
          return (
            <line
              key={`${edge.parent}-${edge.child}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              className={cn('stroke-border', onPath && 'stroke-emerald-500')}
              strokeWidth={onPath ? 1 : 0.5}
            />
          )
        })}

        {nodes.map((node) => {
          const isCurrent = current === node.id
          const isVisited = visited.includes(node.id)
          const onPath = pathSet.has(node.id)
          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={4.4}
                strokeWidth={0.6}
                className={cn(
                  'stroke-background fill-muted',
                  isVisited && 'fill-emerald-500',
                  onPath && !isVisited && !isCurrent && 'fill-blue-400/70 dark:fill-blue-500/60',
                  isCurrent && 'fill-violet-500 dark:fill-violet-400',
                )}
              />
              <text
                x={node.x}
                y={node.y + 1.5}
                textAnchor="middle"
                fontSize={4}
                className={cn(
                  'fill-foreground font-semibold',
                  (isVisited || isCurrent) && 'fill-white',
                )}
              >
                {node.value}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
