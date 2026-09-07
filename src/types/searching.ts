export interface SearchStep {
  array: number[]
  target: number
  /** lower bound of the active search window, if applicable */
  lo?: number
  /** upper bound of the active search window, if applicable */
  hi?: number
  /** index currently being probed / compared against the target */
  probe?: number
  /** indices that have been ruled out */
  eliminated?: number[]
  /** index where the target was found */
  found?: number
  /** search finished (whether or not the target was found) */
  done?: boolean
  /** pseudocode line number (0-indexed) to highlight for this step */
  line: number
  /** short human-readable description of what's happening */
  message: string
}

export interface SearchAlgorithm {
  id: string
  name: string
  description: string
  timeComplexity: {
    best: string
    average: string
    worst: string
  }
  spaceComplexity: string
  /** whether the input array must be sorted for the algorithm to work */
  requiresSorted: boolean
  pseudocode: string[]
  run: (input: number[], target: number) => SearchStep[]
}
