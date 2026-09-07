import type { Graph, GraphAlgorithm, GraphStep } from '@/types/graph'
import { buildAdjacency } from './sampleGraph'

const pseudocode = [
  'procedure BFS(graph, start, goal)',
  '  queue ← [start]; visited ← {start}',
  '  parent ← {}',
  '  while queue not empty',
  '    node ← queue.dequeue()',
  '    if node = goal: return reconstruct(parent, goal)',
  '    for each neighbour of node',
  '      if neighbour not in visited',
  '        visited.add(neighbour)',
  '        parent[neighbour] ← node',
  '        queue.enqueue(neighbour)',
  '  return NO_PATH',
]

function run(graph: Graph, start: string, goal: string): GraphStep[] {
  const adj = buildAdjacency(graph)
  const steps: GraphStep[] = []
  const visited = new Set<string>([start])
  const parent: Record<string, string | null> = { [start]: null }
  const queue: string[] = [start]

  const reconstruct = (end: string): string[] => {
    const path: string[] = []
    let cur: string | null = end
    while (cur !== null && cur !== undefined) {
      path.unshift(cur)
      cur = parent[cur] ?? null
    }
    return path
  }

  steps.push({ visited: [start], frontier: [start], line: 1, message: `Start BFS from ${start}. Queue: [${start}].` })

  while (queue.length > 0) {
    const node = queue.shift() as string
    steps.push({
      visited: [...visited],
      frontier: [...queue],
      current: node,
      line: 4,
      message: `Dequeue ${node}.`,
    })

    if (node === goal) {
      const path = reconstruct(node)
      steps.push({
        visited: [...visited],
        frontier: [...queue],
        current: node,
        path,
        line: 5,
        message: `Reached the goal ${goal}. Path: ${path.join(' → ')}.`,
      })
      return steps
    }

    for (const { to } of adj[node]) {
      steps.push({
        visited: [...visited],
        frontier: [...queue],
        current: node,
        activeEdge: [node, to],
        line: 6,
        message: `Look at neighbour ${to} of ${node}.`,
      })
      if (!visited.has(to)) {
        visited.add(to)
        parent[to] = node
        queue.push(to)
        steps.push({
          visited: [...visited],
          frontier: [...queue],
          current: node,
          activeEdge: [node, to],
          line: 10,
          message: `${to} is new — mark it visited and enqueue it. Queue: [${queue.join(', ')}].`,
        })
      } else {
        steps.push({
          visited: [...visited],
          frontier: [...queue],
          current: node,
          activeEdge: [node, to],
          line: 7,
          message: `${to} is already visited — skip it.`,
        })
      }
    }
  }

  steps.push({ visited: [...visited], frontier: [], line: 11, message: `Queue is empty. No path to ${goal}.` })
  return steps
}

export const bfs: GraphAlgorithm = {
  id: 'bfs',
  name: 'Breadth-First Search',
  description:
    'Explores the graph level by level using a FIFO queue, visiting all nodes one hop away before any node two hops away. Finds the path with the fewest edges (ignoring weights).',
  timeComplexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
  spaceComplexity: 'O(V)',
  weighted: false,
  frontierLabel: 'Queue (FIFO)',
  pseudocode,
  run,
}
