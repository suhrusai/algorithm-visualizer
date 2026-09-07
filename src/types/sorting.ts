export interface SortStep {
  array: number[]
  /** indices currently being compared */
  comparing?: number[]
  /** indices currently being swapped/overwritten */
  swapping?: number[]
  /** indices that are in their final sorted position */
  sorted?: number[]
  /** index of the current pivot, if applicable */
  pivot?: number
  /** indices belonging to the active sub-range being worked on */
  active?: number[]
  /** pseudocode line number (0-indexed) to highlight for this step */
  line: number
  /** short human-readable description of what's happening */
  message: string
}

export interface SortAlgorithm {
  id: string
  name: string
  description: string
  timeComplexity: {
    best: string
    average: string
    worst: string
  }
  spaceComplexity: string
  stable: boolean
  pseudocode: string[]
  run: (input: number[]) => SortStep[]
}
