import type { Graph, GraphAlgorithm, GraphStep } from '@/types/graph'
import { buildAdjacency } from './sampleGraph'

const pseudocode = [
  'procedure DFS(graph, start, goal)',
  '  stack ← [start]; visited ← {}',
  '  parent ← {}',
  '  while stack not empty',
  '    node ← stack.pop()',
  '    if node in visited: continue',
  '    visited.add(node)',
  '    if node = goal: return reconstruct(parent, goal)',
  '    for each neighbour of node (reverse order)',
  '      if neighbour not in visited',
  '        parent[neighbour] ← node',
  '        stack.push(neighbour)',
  '  return NO_PATH',
]

function run(graph: Graph, start: string, goal: string): GraphStep[] {
  const adj = buildAdjacency(graph)
  const steps: GraphStep[] = []
  const visited = new Set<string>()
  const parent: Record<string, string | null> = { [start]: null }
  const stack: string[] = [start]

  const reconstruct = (end: string): string[] => {
    const path: string[] = []
    let cur: string | null = end
    while (cur !== null && cur !== undefined) {
      path.unshift(cur)
      cur = parent[cur] ?? null
    }
    return path
  }

  steps.push({ visited: [], frontier: [start], line: 1, message: `Start DFS from ${start}. Stack: [${start}].` })

  while (stack.length > 0) {
    const node = stack.pop() as string
    steps.push({ visited: [...visited], frontier: [...stack], current: node, line: 4, message: `Pop ${node}.` })

    if (visited.has(node)) {
      steps.push({ visited: [...visited], frontier: [...stack], current: node, line: 5, message: `${node} already visited — skip.` })
      continue
    }

    visited.add(node)
    steps.push({ visited: [...visited], frontier: [...stack], current: node, line: 6, message: `Mark ${node} visited.` })

    if (node === goal) {
      const path = reconstruct(node)
      steps.push({
        visited: [...visited],
        frontier: [...stack],
        current: node,
        path,
        line: 7,
        message: `Reached the goal ${goal}. Path: ${path.join(' → ')}.`,
      })
      return steps
    }

    const neighbours = [...adj[node]].reverse()
    for (const { to } of neighbours) {
      steps.push({
        visited: [...visited],
        frontier: [...stack],
        current: node,
        activeEdge: [node, to],
        line: 8,
        message: `Look at neighbour ${to} of ${node}.`,
      })
      if (!visited.has(to)) {
        parent[to] = node
        stack.push(to)
        steps.push({
          visited: [...visited],
          frontier: [...stack],
          current: node,
          activeEdge: [node, to],
          line: 11,
          message: `Push ${to}. Stack: [${stack.join(', ')}].`,
        })
      }
    }
  }

  steps.push({ visited: [...visited], frontier: [], line: 12, message: `Stack is empty. No path to ${goal}.` })
  return steps
}

export const dfs: GraphAlgorithm = {
  id: 'dfs',
  name: 'Depth-First Search',
  description:
    'Follows one branch as deep as possible before backtracking, using a LIFO stack. Visits every reachable node but does not guarantee the shortest path.',
  timeComplexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
  spaceComplexity: 'O(V)',
  weighted: false,
  frontierLabel: 'Stack (LIFO)',
  pseudocode,
  run,
}
