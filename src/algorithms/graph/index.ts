import { bfs } from './bfs'
import { dfs } from './dfs'
import { dijkstra } from './dijkstra'
import { astar } from './astar'
import { bellmanFord } from './bellmanFord'
import { prim } from './prim'
import { kruskal } from './kruskal'
import type { GraphAlgorithm } from '@/types/graph'

export { sampleGraph } from './sampleGraph'

export const graphAlgorithms: GraphAlgorithm[] = [bfs, dfs, dijkstra, astar, bellmanFord, prim, kruskal]

export const graphAlgorithmsById: Record<string, GraphAlgorithm> = Object.fromEntries(
  graphAlgorithms.map((algo) => [algo.id, algo]),
)
