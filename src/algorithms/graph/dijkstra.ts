import type { Graph, GraphAlgorithm, GraphStep } from '@/types/graph'
import { buildAdjacency } from './sampleGraph'

const pseudocode = [
  'procedure Dijkstra(graph, start, goal)',
  '  dist[v] ← ∞ for all v; dist[start] ← 0',
  '  PQ ← all nodes keyed by dist',
  '  while PQ not empty',
  '    node ← PQ.extractMin()',
  '    if node = goal: return dist[goal]',
  '    for each (neighbour, w) of node',
  '      if dist[node] + w < dist[neighbour]',
  '        dist[neighbour] ← dist[node] + w',
  '        parent[neighbour] ← node',
  '  return dist',
]

const INF = Number.POSITIVE_INFINITY

function run(graph: Graph, start: string, goal: string): GraphStep[] {
  const adj = buildAdjacency(graph)
  const steps: GraphStep[] = []
  const dist: Record<string, number> = {}
  const parent: Record<string, string | null> = {}
  const done = new Set<string>()

  for (const node of graph.nodes) {
    dist[node.id] = INF
    parent[node.id] = null
  }
  dist[start] = 0

  const remaining = () => graph.nodes.map((n) => n.id).filter((id) => !done.has(id))

  const frontierByDist = () =>
    remaining()
      .filter((id) => dist[id] < INF)
      .sort((a, b) => dist[a] - dist[b])

  const reconstruct = (end: string): string[] => {
    const path: string[] = []
    let cur: string | null = end
    while (cur !== null && cur !== undefined) {
      path.unshift(cur)
      cur = parent[cur] ?? null
    }
    return path
  }

  steps.push({
    visited: [],
    frontier: frontierByDist(),
    distances: { ...dist },
    line: 1,
    message: `All distances are ∞ except ${start}, which is 0.`,
  })

  while (true) {
    const pool = frontierByDist()
    if (pool.length === 0) break
    const node = pool[0]
    done.add(node)

    steps.push({
      visited: [...done],
      frontier: frontierByDist(),
      current: node,
      distances: { ...dist },
      line: 4,
      message: `Closest unfinished node is ${node} at distance ${dist[node]}. Finalize it.`,
    })

    if (node === goal) {
      const path = reconstruct(node)
      steps.push({
        visited: [...done],
        frontier: frontierByDist(),
        current: node,
        path,
        distances: { ...dist },
        line: 5,
        message: `Reached the goal ${goal}: shortest distance ${dist[goal]}. Path: ${path.join(' → ')}.`,
      })
      return steps
    }

    for (const { to, weight } of adj[node]) {
      if (done.has(to)) continue
      const candidate = dist[node] + weight
      steps.push({
        visited: [...done],
        frontier: frontierByDist(),
        current: node,
        activeEdge: [node, to],
        distances: { ...dist },
        line: 7,
        message: `Relax ${node} → ${to}: ${dist[node]} + ${weight} = ${candidate} vs current ${dist[to] === INF ? '∞' : dist[to]}.`,
      })
      if (candidate < dist[to]) {
        dist[to] = candidate
        parent[to] = node
        steps.push({
          visited: [...done],
          frontier: frontierByDist(),
          current: node,
          activeEdge: [node, to],
          distances: { ...dist },
          line: 8,
          message: `Better path found. dist[${to}] ← ${candidate}.`,
        })
      }
    }
  }

  const path = reconstruct(goal)
  steps.push({
    visited: [...done],
    frontier: [],
    distances: { ...dist },
    path: dist[goal] < INF ? path : undefined,
    line: 10,
    message:
      dist[goal] < INF
        ? `Done. Shortest distance to ${goal} is ${dist[goal]}.`
        : `Done. ${goal} is unreachable from ${start}.`,
  })
  return steps
}

export const dijkstra: GraphAlgorithm = {
  id: 'dijkstra',
  name: "Dijkstra's Algorithm",
  description:
    'Grows a set of finalized nodes outward from the start, always finalizing the closest remaining node and relaxing its edges. Finds shortest paths on graphs with non-negative edge weights.',
  timeComplexity: { best: 'O(E + V log V)', average: 'O(E + V log V)', worst: 'O(E + V log V)' },
  spaceComplexity: 'O(V)',
  weighted: true,
  frontierLabel: 'Priority queue (by distance)',
  pseudocode,
  run,
}
