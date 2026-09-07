import type { Graph, GraphAlgorithm, GraphStep } from '@/types/graph'
import { buildAdjacency } from './sampleGraph'

const pseudocode = [
  'procedure AStar(graph, start, goal)',
  '  g[start] ← 0;  open ← {start}',
  '  f[start] ← h(start, goal)',
  '  while open not empty',
  '    node ← argmin f over open',
  '    if node = goal: return reconstruct(goal)',
  '    for each (nb, w) of node',
  '      tentative ← g[node] + w',
  '      if tentative < g[nb]',
  '        g[nb] ← tentative',
  '        f[nb] ← tentative + h(nb, goal)',
  '        parent[nb] ← node;  open.add(nb)',
  '  return NO_PATH',
]

const INF = Number.POSITIVE_INFINITY

function run(graph: Graph, start: string, goal: string): GraphStep[] {
  const adj = buildAdjacency(graph)
  const pos = Object.fromEntries(graph.nodes.map((n) => [n.id, n]))
  // Straight-line distance, scaled well below the per-edge cost so it stays admissible.
  const h = (id: string) => {
    const a = pos[id]
    const b = pos[goal]
    return Math.round(Math.hypot(a.x - b.x, a.y - b.y) * 0.12)
  }

  const steps: GraphStep[] = []
  const g: Record<string, number> = {}
  const parent: Record<string, string | null> = {}
  const done = new Set<string>()
  for (const n of graph.nodes) {
    g[n.id] = INF
    parent[n.id] = null
  }
  g[start] = 0
  const open = new Set<string>([start])

  const f = (id: string) => g[id] + h(id)
  const frontier = () => [...open].sort((a, b) => f(a) - f(b))

  const reconstruct = (end: string): string[] => {
    const path: string[] = []
    let cur: string | null = end
    while (cur != null) {
      path.unshift(cur)
      cur = parent[cur]
    }
    return path
  }

  steps.push({
    visited: [],
    frontier: [start],
    distances: { ...g },
    line: 1,
    message: `Start at ${start}. f = g + h, where h is the straight-line distance to ${goal}.`,
  })

  while (open.size > 0) {
    const node = frontier()[0]
    open.delete(node)
    done.add(node)
    steps.push({
      visited: [...done],
      frontier: frontier(),
      current: node,
      distances: { ...g },
      line: 4,
      message: `Lowest f in the open set is ${node} (g=${g[node]}, h=${h(node)}, f=${f(node)}).`,
    })

    if (node === goal) {
      const path = reconstruct(node)
      steps.push({
        visited: [...done],
        frontier: frontier(),
        current: node,
        path,
        distances: { ...g },
        line: 5,
        message: `Reached ${goal}. Shortest distance ${g[goal]}, path ${path.join(' → ')}.`,
      })
      return steps
    }

    for (const { to, weight } of adj[node]) {
      if (done.has(to)) continue
      const tentative = g[node] + weight
      steps.push({
        visited: [...done],
        frontier: frontier(),
        current: node,
        activeEdge: [node, to],
        distances: { ...g },
        line: 7,
        message: `Edge ${node}→${to}: g would be ${g[node]} + ${weight} = ${tentative}.`,
      })
      if (tentative < g[to]) {
        g[to] = tentative
        parent[to] = node
        open.add(to)
        steps.push({
          visited: [...done],
          frontier: frontier(),
          current: node,
          activeEdge: [node, to],
          distances: { ...g },
          line: 9,
          message: `Better — g[${to}] ← ${tentative}, f[${to}] = ${tentative + h(to)}.`,
        })
      }
    }
  }

  steps.push({ visited: [...done], frontier: [], distances: { ...g }, line: 12, message: `${goal} is unreachable.` })
  return steps
}

export const astar: GraphAlgorithm = {
  id: 'astar',
  name: 'A* Search',
  description:
    "Like Dijkstra, but orders the open set by g + h, where h is an optimistic estimate of the distance still to go. With an admissible heuristic it finds the shortest path while exploring toward the goal instead of in all directions.",
  timeComplexity: { best: 'O(E)', average: 'O(E)', worst: 'O(E + V log V)' },
  spaceComplexity: 'O(V)',
  weighted: true,
  frontierLabel: 'Open set (by f = g + h)',
  pseudocode,
  run,
}
