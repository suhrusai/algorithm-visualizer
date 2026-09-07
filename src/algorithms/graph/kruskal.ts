import type { Graph, GraphAlgorithm, GraphStep } from '@/types/graph'

const pseudocode = [
  'procedure Kruskal(graph)',
  '  sort edges by weight ascending',
  '  makeSet(v) for every vertex',
  '  for each edge (u, v, w) in order',
  '    if find(u) ≠ find(v)      // no cycle',
  '      union(u, v)',
  '      add (u, v) to the MST',
  '  return MST',
]

function run(graph: Graph): GraphStep[] {
  const steps: GraphStep[] = []
  const parent: Record<string, string> = {}
  for (const n of graph.nodes) parent[n.id] = n.id
  const find = (x: string): string => (parent[x] === x ? x : (parent[x] = find(parent[x])))
  const union = (a: string, b: string) => {
    parent[find(a)] = find(b)
  }

  const edges = [...graph.edges].sort((a, b) => a.weight - b.weight)
  const mst: [string, string][] = []
  let total = 0

  steps.push({
    visited: [],
    frontier: [],
    mstEdges: [],
    line: 1,
    message: `Sort edges by weight: ${edges.map((e) => `${e.source}${e.target}(${e.weight})`).join(', ')}.`,
  })

  for (const e of edges) {
    const cycle = find(e.source) === find(e.target)
    steps.push({
      visited: mst.flat(),
      frontier: [],
      activeEdge: [e.source, e.target],
      mstEdges: [...mst],
      line: 4,
      message: cycle
        ? `${e.source}–${e.target} (${e.weight}): endpoints already connected — skip, it would make a cycle.`
        : `${e.source}–${e.target} (${e.weight}): different components — take it.`,
    })
    if (!cycle) {
      union(e.source, e.target)
      mst.push([e.source, e.target])
      total += e.weight
      steps.push({
        visited: mst.flat(),
        frontier: [],
        mstEdges: [...mst],
        line: 6,
        message: `Union the two components. MST weight so far ${total}.`,
      })
    }
    if (mst.length === graph.nodes.length - 1) break
  }

  steps.push({
    visited: graph.nodes.map((n) => n.id),
    frontier: [],
    mstEdges: [...mst],
    line: 7,
    message: `Minimum spanning tree complete — ${mst.length} edges, total weight ${total}.`,
  })
  return steps
}

export const kruskal: GraphAlgorithm = {
  id: 'kruskal',
  name: "Kruskal's MST",
  description:
    'Builds a minimum spanning tree by considering edges cheapest-first and keeping each one unless it would form a cycle. Cycle checks use a union-find (disjoint set) structure.',
  timeComplexity: { best: 'O(E log E)', average: 'O(E log E)', worst: 'O(E log E)' },
  spaceComplexity: 'O(V)',
  weighted: true,
  frontierLabel: 'Edges, cheapest first',
  usesGoal: false,
  pseudocode,
  run,
}
