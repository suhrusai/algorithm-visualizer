import { bfs } from './bfs'
import { dfs } from './dfs'
import { dijkstra } from './dijkstra'
import type { GraphAlgorithm } from '@/types/graph'

export { sampleGraph } from './sampleGraph'

export const graphAlgorithms: GraphAlgorithm[] = [bfs, dfs, dijkstra]

export const graphAlgorithmsById: Record<string, GraphAlgorithm> = Object.fromEntries(
  graphAlgorithms.map((algo) => [algo.id, algo]),
)
