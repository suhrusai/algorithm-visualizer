import type { Graph, GraphAlgorithm, GraphStep } from '@/types/graph'

const pseudocode = [
  'procedure BellmanFord(graph, start)',
  '  dist[start] ← 0; dist[others] ← ∞',
  '  repeat |V| − 1 times',
  '    for each edge (u, v, w)',
  '      if dist[u] + w < dist[v]',
  '        dist[v] ← dist[u] + w',
  '  // one more pass ⇒ negative cycle',
]

const INF = Number.POSITIVE_INFINITY

function run(graph: Graph, start: string): GraphStep[] {
  const steps: GraphStep[] = []
  const dist: Record<string, number> = {}
  for (const n of graph.nodes) dist[n.id] = INF
  dist[start] = 0

  // undirected → relax both directions
  const edges = graph.edges.flatMap((e) => [
    { u: e.source, v: e.target, w: e.weight },
    { u: e.target, v: e.source, w: e.weight },
  ])

  const relaxed = new Set<string>([start])
  steps.push({ visited: [start], frontier: [], distances: { ...dist }, line: 1, message: `dist[${start}] = 0, everything else ∞.` })

  const V = graph.nodes.length
  for (let pass = 1; pass <= V - 1; pass++) {
    let changed = false
    steps.push({
      visited: [...relaxed],
      frontier: [],
      distances: { ...dist },
      line: 2,
      message: `Pass ${pass} of ${V - 1}: try to relax every edge.`,
    })
    for (const { u, v, w } of edges) {
      if (dist[u] === INF) continue
      const cand = dist[u] + w
      if (cand < dist[v]) {
        dist[v] = cand
        relaxed.add(v)
        changed = true
        steps.push({
          visited: [...relaxed],
          frontier: [],
          current: v,
          activeEdge: [u, v],
          distances: { ...dist },
          line: 5,
          message: `Relax ${u}→${v}: ${dist[u]} + ${w} = ${cand} < old dist[${v}].`,
        })
      }
    }
    if (!changed) {
      steps.push({
        visited: [...relaxed],
        frontier: [],
        distances: { ...dist },
        line: 2,
        message: `Pass ${pass} changed nothing — distances have converged, stop early.`,
      })
      break
    }
  }

  steps.push({
    visited: graph.nodes.map((n) => n.id),
    frontier: [],
    distances: { ...dist },
    line: 6,
    message: `Done. These are the shortest distances from ${start} (works even with negative edges, unlike Dijkstra).`,
  })
  return steps
}

export const bellmanFord: GraphAlgorithm = {
  id: 'bellman-ford',
  name: 'Bellman–Ford',
  description:
    'Relaxes every edge, |V| − 1 times over. Slower than Dijkstra but tolerates negative edge weights and can report a negative cycle if a further pass still improves a distance.',
  timeComplexity: { best: 'O(E)', average: 'O(V·E)', worst: 'O(V·E)' },
  spaceComplexity: 'O(V)',
  weighted: true,
  frontierLabel: 'No frontier — every edge, every pass',
  usesGoal: false,
  pseudocode,
  run,
}
