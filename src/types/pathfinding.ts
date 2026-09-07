export type Terrain = 0 | 1 | 2 // 0 = open, 1 = wall, 2 = weighted (costly) tile

export interface Grid {
  rows: number
  cols: number
  /** length rows*cols, indexed by r * cols + c */
  terrain: Terrain[]
  start: number
  goal: number
}

export interface PathStep {
  /** cell indices whose expansion is complete */
  visited: number[]
  /** cell indices discovered and waiting to be expanded */
  frontier: number[]
  /** cell being expanded right now */
  current?: number
  /** reconstructed path from start to the current cell (or the final path) */
  path?: number[]
  line: number
  message: string
}

export interface PathAlgorithm {
  id: string
  name: string
  description: string
  /** does the algorithm take tile weights into account? */
  weighted: boolean
  /** does it use a goal-distance heuristic? */
  heuristic: boolean
  timeComplexity: string
  spaceComplexity: string
  pseudocode: string[]
  run: (grid: Grid) => PathStep[]
}

export const WEIGHT_COST = 5
