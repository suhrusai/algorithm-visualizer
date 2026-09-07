import { cn } from '@/lib/utils'
import type { Graph, GraphStep } from '@/types/graph'

interface GraphCanvasProps {
  graph: Graph
  step: GraphStep
  start: string
  goal: string
  showWeights: boolean
  showGoal?: boolean
}

function edgeKey(a: string, b: string) {
  return [a, b].sort().join('-')
}

export function GraphCanvas({ graph, step, start, goal, showWeights, showGoal = true }: GraphCanvasProps) {
  const { visited = [], frontier = [], current, activeEdge, path = [], mstEdges = [] } = step
  const pos = Object.fromEntries(graph.nodes.map((n) => [n.id, n]))

  const pathEdges = new Set<string>()
  for (let i = 0; i < path.length - 1; i++) {
    pathEdges.add(edgeKey(path[i], path[i + 1]))
  }
  const treeEdges = new Set<string>(mstEdges.map(([a, b]) => edgeKey(a, b)))
  const activeKey = activeEdge ? edgeKey(activeEdge[0], activeEdge[1]) : null

  return (
    <div className="rounded-lg border bg-muted/30 p-2">
      <svg viewBox="0 0 100 92" className="h-[22rem] w-full" role="img" aria-label="Graph visualization">
        {graph.edges.map((edge) => {
          const a = pos[edge.source]
          const b = pos[edge.target]
          const key = edgeKey(edge.source, edge.target)
          const onPath = pathEdges.has(key) || treeEdges.has(key)
          const isActive = activeKey === key
          return (
            <g key={key}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                className={cn(
                  'stroke-border',
                  onPath && 'stroke-emerald-500',
                  isActive && 'stroke-amber-500',
                )}
                strokeWidth={onPath || isActive ? 1.1 : 0.5}
              />
              {showWeights && (
                <text
                  x={(a.x + b.x) / 2}
                  y={(a.y + b.y) / 2 - 1}
                  className="fill-muted-foreground"
                  fontSize={3}
                  textAnchor="middle"
                >
                  {edge.weight}
                </text>
              )}
            </g>
          )
        })}

        {graph.nodes.map((node) => {
          const isVisited = visited.includes(node.id)
          const isFrontier = frontier.includes(node.id)
          const isCurrent = current === node.id
          const onPath = path.includes(node.id)
          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={4.2}
                className={cn(
                  'stroke-background',
                  'fill-muted',
                  isVisited && 'fill-emerald-500',
                  isFrontier && !isVisited && 'fill-amber-400 dark:fill-amber-500',
                  isCurrent && 'fill-violet-500 dark:fill-violet-400',
                  onPath && 'fill-emerald-600',
                )}
                strokeWidth={0.6}
              />
              <text
                x={node.x}
                y={node.y + 1.4}
                textAnchor="middle"
                fontSize={4}
                className={cn(
                  'fill-foreground font-semibold',
                  (isVisited || isCurrent || isFrontier) && 'fill-white',
                )}
              >
                {node.id}
              </text>
              {(node.id === start || (showGoal && node.id === goal)) && (
                <text
                  x={node.x}
                  y={node.y - 6}
                  textAnchor="middle"
                  fontSize={3}
                  className="fill-muted-foreground"
                >
                  {node.id === start ? 'start' : 'goal'}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
