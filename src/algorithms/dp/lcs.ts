import type { DpAlgorithm, DpStep } from '@/types/dp'
import { clone, emptyGrid, parseText } from './util'

const pseudocode = [
  'procedure LCS(A, B)',
  '  for i from 0 to |A|',
  '    for j from 0 to |B|',
  '      if i = 0 or j = 0',
  '        dp[i][j] ← 0',
  '      else if A[i-1] = B[j-1]',
  '        dp[i][j] ← dp[i-1][j-1] + 1',
  '      else',
  '        dp[i][j] ← max(dp[i-1][j], dp[i][j-1])',
  '  return dp[|A|][|B|]',
]

function run(values: Record<string, string>): DpStep[] {
  const a = parseText(values.a ?? '')
  const b = parseText(values.b ?? '')
  const R = a.length + 1
  const C = b.length + 1
  const grid = emptyGrid(R, C)
  const steps: DpStep[] = []

  steps.push({ grid: clone(grid), line: 0, message: `Table is (${a.length}+1) × (${b.length}+1). Row/col 0 are the empty-prefix base case.` })

  for (let i = 0; i < R; i++) {
    for (let j = 0; j < C; j++) {
      if (i === 0 || j === 0) {
        grid[i][j] = 0
        steps.push({ grid: clone(grid), cursor: [i, j], line: 4, message: `Empty prefix → dp[${i}][${j}] = 0.` })
        continue
      }
      const matches = a[i - 1] === b[j - 1]
      if (matches) {
        grid[i][j] = (grid[i - 1][j - 1] as number) + 1
        steps.push({
          grid: clone(grid),
          cursor: [i, j],
          from: [[i - 1, j - 1]],
          line: 6,
          message: `A[${i - 1}]='${a[i - 1]}' = B[${j - 1}]='${b[j - 1]}' → dp[${i - 1}][${j - 1}] + 1 = ${grid[i][j]}.`,
        })
      } else {
        const up = grid[i - 1][j] as number
        const left = grid[i][j - 1] as number
        grid[i][j] = Math.max(up, left)
        steps.push({
          grid: clone(grid),
          cursor: [i, j],
          from: [[i - 1, j], [i, j - 1]],
          line: 8,
          message: `'${a[i - 1]}' ≠ '${b[j - 1]}' → max(up ${up}, left ${left}) = ${grid[i][j]}.`,
        })
      }
    }
  }

  // reconstruct
  const path: [number, number][] = []
  let i = a.length
  let j = b.length
  const lcs: string[] = []
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      path.push([i, j])
      lcs.unshift(a[i - 1])
      i--
      j--
    } else if ((grid[i - 1][j] as number) >= (grid[i][j - 1] as number)) {
      i--
    } else {
      j--
    }
  }

  steps.push({
    grid: clone(grid),
    path,
    line: 9,
    message: `Length ${grid[a.length][b.length]}. One LCS: "${lcs.join('')}".`,
    result: `LCS = "${lcs.join('')}" (length ${grid[a.length][b.length]})`,
  })
  return steps
}

export const lcs: DpAlgorithm = {
  id: 'lcs',
  name: 'Longest Common Subsequence',
  description:
    'Fills a table where dp[i][j] is the LCS length of the first i characters of A and first j of B. Each cell either extends a diagonal match or inherits the better of up/left.',
  timeComplexity: 'O(m·n)',
  spaceComplexity: 'O(m·n)',
  pseudocode,
  inputs: [
    { key: 'a', label: 'String A', placeholder: 'AGCAT', kind: 'text' },
    { key: 'b', label: 'String B', placeholder: 'GAC', kind: 'text' },
  ],
  defaults: { a: 'AGCAT', b: 'GAC' },
  rowLabels: (v) => ['∅', ...parseText(v.a ?? '').split('')],
  colLabels: (v) => ['∅', ...parseText(v.b ?? '').split('')],
  run,
}
