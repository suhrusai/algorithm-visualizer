export interface StringTable {
  label: string
  values: (number | string)[]
  /** index of the cell to highlight */
  highlight?: number
  /** the string each column aligns under (pattern by default) */
  under: 'pattern' | 'text'
}

export interface StringStep {
  /** where the pattern's left edge sits against the text */
  offset: number
  /** text index currently under comparison (absolute) */
  textIndex?: number
  /** pattern index currently under comparison */
  patIndex?: number
  /** text indices matched so far in this alignment (absolute) */
  matched?: number[]
  /** text index where a mismatch just occurred */
  mismatch?: number
  /** confirmed full-match offsets */
  found?: number[]
  /** auxiliary table to render below (LPS, Z-array, last-occurrence, hashes) */
  table?: StringTable
  line: number
  message: string
}

export interface StringAlgorithm {
  id: string
  name: string
  description: string
  timeComplexity: string
  spaceComplexity: string
  pseudocode: string[]
  defaults: { text: string; pattern: string }
  run: (text: string, pattern: string) => StringStep[]
}
