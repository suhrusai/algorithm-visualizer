import type { Graph } from '@/types/graph'

/** A small undirected weighted graph used by every graph visualization. */
export const sampleGraph: Graph = {
  directed: false,
  nodes: [
    { id: 'A', x: 12, y: 22 },
    { id: 'B', x: 38, y: 10 },
    { id: 'C', x: 66, y: 16 },
    { id: 'D', x: 88, y: 34 },
    { id: 'E', x: 30, y: 44 },
    { id: 'F', x: 58, y: 48 },
    { id: 'G', x: 20, y: 78 },
    { id: 'H', x: 50, y: 82 },
    { id: 'I', x: 80, y: 70 },
  ],
  edges: [
    { source: 'A', target: 'B', weight: 4 },
    { source: 'A', target: 'E', weight: 2 },
    { source: 'B', target: 'C', weight: 6 },
    { source: 'B', target: 'E', weight: 3 },
    { source: 'C', target: 'D', weight: 2 },
    { source: 'C', target: 'F', weight: 5 },
    { source: 'D', target: 'I', weight: 7 },
    { source: 'E', target: 'F', weight: 4 },
    { source: 'E', target: 'G', weight: 5 },
    { source: 'F', target: 'H', weight: 3 },
    { source: 'F', target: 'I', weight: 6 },
    { source: 'G', target: 'H', weight: 2 },
    { source: 'H', target: 'I', weight: 4 },
  ],
}

export interface AdjEntry {
  to: string
  weight: number
}

export function buildAdjacency(graph: Graph): Record<string, AdjEntry[]> {
  const adj: Record<string, AdjEntry[]> = {}
  for (const node of graph.nodes) adj[node.id] = []
  for (const edge of graph.edges) {
    adj[edge.source].push({ to: edge.target, weight: edge.weight })
    if (!graph.directed) adj[edge.target].push({ to: edge.source, weight: edge.weight })
  }
  for (const id of Object.keys(adj)) {
    adj[id].sort((a, b) => a.to.localeCompare(b.to))
  }
  return adj
}
