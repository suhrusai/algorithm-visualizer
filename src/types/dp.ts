export interface DpStep {
  /** the DP table as filled so far; null = not computed yet */
  grid: (number | null)[][]
  /** cell being computed right now, as [row, col] */
  cursor?: [number, number]
  /** cells the recurrence reads to fill the cursor */
  from?: [number, number][]
  /** cells on the reconstructed answer path */
  path?: [number, number][]
  /** pseudocode line (0-indexed) */
  line: number
  message: string
  /** final answer, shown once the run completes */
  result?: string
}

export interface DpInputField {
  key: string
  label: string
  placeholder: string
  kind: 'text' | 'numbers' | 'number'
}

export interface DpAlgorithm {
  id: string
  name: string
  description: string
  timeComplexity: string
  spaceComplexity: string
  pseudocode: string[]
  inputs: DpInputField[]
  defaults: Record<string, string>
  /** row header labels, given the parsed inputs (length = grid rows) */
  rowLabels: (values: Record<string, string>) => string[]
  colLabels: (values: Record<string, string>) => string[]
  run: (values: Record<string, string>) => DpStep[]
}
