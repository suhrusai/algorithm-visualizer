import type { DpAlgorithm, DpStep } from '@/types/dp'
import { clone, emptyGrid, parseText } from './util'

const pseudocode = [
  'procedure editDistance(A, B)',
  '  for i from 0 to |A|: dp[i][0] ← i',
  '  for j from 0 to |B|: dp[0][j] ← j',
  '  for i from 1 to |A|',
  '    for j from 1 to |B|',
  '      if A[i-1] = B[j-1]',
  '        dp[i][j] ← dp[i-1][j-1]',
  '      else',
  '        dp[i][j] ← 1 + min(delete dp[i-1][j],',
  '                           insert dp[i][j-1],',
  '                           replace dp[i-1][j-1])',
  '  return dp[|A|][|B|]',
]

function run(values: Record<string, string>): DpStep[] {
  const a = parseText(values.a ?? '')
  const b = parseText(values.b ?? '')
  const R = a.length + 1
  const C = b.length + 1
  const grid = emptyGrid(R, C)
  const steps: DpStep[] = []

  for (let i = 0; i < R; i++) {
    grid[i][0] = i
    steps.push({ grid: clone(grid), cursor: [i, 0], line: 1, message: `Turn "${a.slice(0, i)}" into "" with ${i} deletion(s).` })
  }
  for (let j = 1; j < C; j++) {
    grid[0][j] = j
    steps.push({ grid: clone(grid), cursor: [0, j], line: 2, message: `Turn "" into "${b.slice(0, j)}" with ${j} insertion(s).` })
  }

  for (let i = 1; i < R; i++) {
    for (let j = 1; j < C; j++) {
      if (a[i - 1] === b[j - 1]) {
        grid[i][j] = grid[i - 1][j - 1] as number
        steps.push({
          grid: clone(grid),
          cursor: [i, j],
          from: [[i - 1, j - 1]],
          line: 6,
          message: `'${a[i - 1]}' = '${b[j - 1]}' → free, carry the diagonal ${grid[i][j]}.`,
        })
      } else {
        const del = grid[i - 1][j] as number
        const ins = grid[i][j - 1] as number
        const rep = grid[i - 1][j - 1] as number
        grid[i][j] = 1 + Math.min(del, ins, rep)
        steps.push({
          grid: clone(grid),
          cursor: [i, j],
          from: [[i - 1, j], [i, j - 1], [i - 1, j - 1]],
          line: 8,
          message: `'${a[i - 1]}' ≠ '${b[j - 1]}' → 1 + min(del ${del}, ins ${ins}, rep ${rep}) = ${grid[i][j]}.`,
        })
      }
    }
  }

  // reconstruct an edit path
  const path: [number, number][] = []
  let i = a.length
  let j = b.length
  while (i > 0 || j > 0) {
    path.push([i, j])
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      i--
      j--
    } else {
      const rep = i > 0 && j > 0 ? (grid[i - 1][j - 1] as number) : Infinity
      const del = i > 0 ? (grid[i - 1][j] as number) : Infinity
      const ins = j > 0 ? (grid[i][j - 1] as number) : Infinity
      const best = Math.min(rep, del, ins)
      if (best === rep) {
        i--
        j--
      } else if (best === del) i--
      else j--
    }
  }
  path.push([0, 0])

  const answer = grid[a.length][b.length]
  steps.push({
    grid: clone(grid),
    path,
    line: 11,
    message: `Minimum edit distance is ${answer}.`,
    result: `Edit distance = ${answer}`,
  })
  return steps
}

export const editDistance: DpAlgorithm = {
  id: 'edit-distance',
  name: 'Edit Distance (Levenshtein)',
  description:
    'dp[i][j] is the fewest single-character insertions, deletions, or substitutions to turn the first i characters of A into the first j of B. Matching characters are free; otherwise take 1 + the cheapest neighbour.',
  timeComplexity: 'O(m·n)',
  spaceComplexity: 'O(m·n)',
  pseudocode,
  inputs: [
    { key: 'a', label: 'String A', placeholder: 'kitten', kind: 'text' },
    { key: 'b', label: 'String B', placeholder: 'sitting', kind: 'text' },
  ],
  defaults: { a: 'kitten', b: 'sitting' },
  rowLabels: (v) => ['∅', ...parseText(v.a ?? '').split('')],
  colLabels: (v) => ['∅', ...parseText(v.b ?? '').split('')],
  run,
}
