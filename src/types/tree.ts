export interface TreeNodeView {
  id: number
  value: number
  x: number
  y: number
  depth: number
}

export interface TreeEdgeView {
  parent: number
  child: number
}

export interface TreeSnapshot {
  nodes: TreeNodeView[]
  edges: TreeEdgeView[]
  maxDepth: number
}

export interface TreeStep {
  /** the tree as it looks at this step (insertion grows it over time) */
  snapshot: TreeSnapshot
  /** node the algorithm is "standing on" right now */
  current?: number
  /** nodes already fully processed / emitted */
  visited?: number[]
  /** node ids on the path from the root to the current node */
  path?: number[]
  /** traversal output collected so far */
  output?: number[]
  /** pseudocode line number (0-indexed) to highlight */
  line: number
  message: string
}

export interface TreeAlgorithm {
  id: string
  name: string
  description: string
  timeComplexity: {
    best: string
    average: string
    worst: string
  }
  spaceComplexity: string
  /** true when this algorithm builds the tree itself instead of using a prebuilt one */
  buildsTree: boolean
  pseudocode: string[]
  run: (values: number[], target: number) => TreeStep[]
}
