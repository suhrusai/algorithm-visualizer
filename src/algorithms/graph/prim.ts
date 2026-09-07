import type { Graph, GraphAlgorithm, GraphStep } from '@/types/graph'
import { buildAdjacency } from './sampleGraph'

const pseudocode = [
  'procedure Prim(graph, start)',
  '  tree ← {start};  edges gone through = ∅',
  '  while tree ≠ all vertices',
  '    pick the cheapest edge (u, v)',
  '      with u in tree and v not in tree',
  '    add v to tree; add (u, v) to the MST',
  '  return MST',
]

function run(graph: Graph, start: string): GraphStep[] {
  const adj = buildAdjacency(graph)
  const steps: GraphStep[] = []
  const inTree = new Set<string>([start])
  const mst: [string, string][] = []
  let total = 0

  const crossing = () => {
    const out: { u: string; v: string; w: number }[] = []
    for (const u of inTree) {
      for (const { to, weight } of adj[u]) {
        if (!inTree.has(to)) out.push({ u, v: to, w: weight })
      }
    }
    return out.sort((a, b) => a.w - b.w)
  }

  steps.push({
    visited: [start],
    frontier: [],
    mstEdges: [],
    line: 1,
    message: `Grow a tree out from ${start}, always taking the cheapest edge that reaches a new vertex.`,
  })

  while (inTree.size < graph.nodes.length) {
    const options = crossing()
    if (options.length === 0) break
    const best = options[0]
    steps.push({
      visited: [...inTree],
      frontier: options.slice(0, 4).map((o) => o.v),
      activeEdge: [best.u, best.v],
      mstEdges: [...mst],
      line: 3,
      message: `Cheapest edge leaving the tree is ${best.u}–${best.v} (weight ${best.w}).`,
    })
    inTree.add(best.v)
    mst.push([best.u, best.v])
    total += best.w
    steps.push({
      visited: [...inTree],
      frontier: [],
      mstEdges: [...mst],
      line: 5,
      message: `Add ${best.v}. MST weight so far ${total}.`,
    })
  }

  steps.push({
    visited: [...inTree],
    frontier: [],
    mstEdges: [...mst],
    line: 6,
    message: `Minimum spanning tree complete — total weight ${total}.`,
  })
  return steps
}

export const prim: GraphAlgorithm = {
  id: 'prim',
  name: "Prim's MST",
  description:
    'Builds a minimum spanning tree by growing one connected tree: repeatedly add the cheapest edge that connects a new vertex to the tree.',
  timeComplexity: { best: 'O(E log V)', average: 'O(E log V)', worst: 'O(E log V)' },
  spaceComplexity: 'O(V)',
  weighted: true,
  frontierLabel: 'Cheapest crossing edges',
  usesGoal: false,
  pseudocode,
  run,
}
