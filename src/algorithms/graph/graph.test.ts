import { describe, expect, it } from 'vitest'
import { graphAlgorithmsById, sampleGraph } from './index'

describe('graph algorithms', () => {
  it('BFS / DFS / Dijkstra / A* all reach the goal', () => {
    for (const id of ['bfs', 'dfs', 'dijkstra', 'astar']) {
      const last = graphAlgorithmsById[id].run(sampleGraph, 'A', 'I').at(-1)!
      expect(last.path?.[0]).toBe('A')
      expect(last.path?.at(-1)).toBe('I')
    }
  })

  it('Dijkstra and A* agree on the shortest distance', () => {
    const d = graphAlgorithmsById.dijkstra.run(sampleGraph, 'A', 'I').at(-1)!
    const a = graphAlgorithmsById.astar.run(sampleGraph, 'A', 'I').at(-1)!
    expect(a.distances!.I).toBe(d.distances!.I)
  })

  it('Prim and Kruskal produce a spanning tree of the same weight', () => {
    const weight = (edges: [string, string][]) =>
      edges.reduce((s, [x, y]) => {
        const e = sampleGraph.edges.find(
          (ed) => (ed.source === x && ed.target === y) || (ed.source === y && ed.target === x),
        )!
        return s + e.weight
      }, 0)
    const prim = graphAlgorithmsById.prim.run(sampleGraph, 'A', 'A').at(-1)!.mstEdges!
    const kruskal = graphAlgorithmsById.kruskal.run(sampleGraph, 'A', 'A').at(-1)!.mstEdges!
    expect(prim).toHaveLength(sampleGraph.nodes.length - 1)
    expect(kruskal).toHaveLength(sampleGraph.nodes.length - 1)
    expect(weight(prim)).toBe(weight(kruskal))
  })

  it('Bellman–Ford matches Dijkstra on non-negative weights', () => {
    const bf = graphAlgorithmsById['bellman-ford'].run(sampleGraph, 'A', 'A').at(-1)!.distances!
    const dj = graphAlgorithmsById.dijkstra.run(sampleGraph, 'A', 'I').at(-1)!.distances!
    for (const n of sampleGraph.nodes) expect(bf[n.id]).toBe(dj[n.id])
  })
})
