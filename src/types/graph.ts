export interface GraphNode {
  id: string
  /** layout coordinates in a 0–100 viewBox */
  x: number
  y: number
}

export interface GraphEdge {
  source: string
  target: string
  weight: number
}

export interface Graph {
  nodes: GraphNode[]
  edges: GraphEdge[]
  directed: boolean
}

export interface GraphStep {
  /** nodes whose processing is complete */
  visited: string[]
  /** nodes discovered and waiting in the queue / stack / priority queue */
  frontier: string[]
  /** node being processed right now */
  current?: string
  /** edge being relaxed / traversed right now, as [from, to] */
  activeEdge?: [string, string]
  /** best known distance from the start node, by node id */
  distances?: Record<string, number>
  /** node ids on the highlighted path */
  path?: string[]
  /** pseudocode line number (0-indexed) to highlight */
  line: number
  message: string
}

export interface GraphAlgorithm {
  id: string
  name: string
  description: string
  timeComplexity: {
    best: string
    average: string
    worst: string
  }
  spaceComplexity: string
  /** whether edge weights affect the result */
  weighted: boolean
  /** label for the frontier data structure, e.g. "Queue" */
  frontierLabel: string
  pseudocode: string[]
  run: (graph: Graph, start: string, goal: string) => GraphStep[]
}
