import type { DpAlgorithm, DpStep } from '@/types/dp'
import { clone, emptyGrid, parseNumbers } from './util'

const pseudocode = [
  'procedure LIS(nums)',
  '  for i from 0 to n-1: dp[i] ← 1',
  '  for i from 1 to n-1',
  '    for j from 0 to i-1',
  '      if nums[j] < nums[i] and dp[j] + 1 > dp[i]',
  '        dp[i] ← dp[j] + 1',
  '  return max(dp)',
]

function run(values: Record<string, string>): DpStep[] {
  const nums = parseNumbers(values.nums ?? '', 14)
  const n = nums.length
  const grid = emptyGrid(1, n)
  const steps: DpStep[] = []

  for (let i = 0; i < n; i++) grid[0][i] = 1
  steps.push({ grid: clone(grid), cursor: [0, 0], line: 1, message: `Every element is an increasing subsequence of length 1 on its own.` })

  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      const better = nums[j] < nums[i] && (grid[0][j] as number) + 1 > (grid[0][i] as number)
      if (better) {
        grid[0][i] = (grid[0][j] as number) + 1
        steps.push({
          grid: clone(grid),
          cursor: [0, i],
          from: [[0, j]],
          line: 5,
          message: `nums[${j}]=${nums[j]} < nums[${i}]=${nums[i]} → extend: dp[${i}] = dp[${j}] + 1 = ${grid[0][i]}.`,
        })
      } else {
        steps.push({
          grid: clone(grid),
          cursor: [0, i],
          from: [[0, j]],
          line: 4,
          message: `nums[${j}]=${nums[j]} vs nums[${i}]=${nums[i]}: no improvement.`,
        })
      }
    }
  }

  // reconstruct one LIS
  let end = 0
  for (let i = 1; i < n; i++) if ((grid[0][i] as number) > (grid[0][end] as number)) end = i
  const path: [number, number][] = []
  const seq: number[] = []
  let need = grid[0][end] as number
  for (let i = end; i >= 0 && need > 0; i--) {
    if ((grid[0][i] as number) === need && (seq.length === 0 || nums[i] < seq[0])) {
      path.push([0, i])
      seq.unshift(nums[i])
      need--
    }
  }

  const answer = n > 0 ? Math.max(...(grid[0] as number[])) : 0
  steps.push({
    grid: clone(grid),
    path,
    line: 6,
    message: `Longest increasing subsequence has length ${answer}: [${seq.join(', ')}].`,
    result: `LIS length ${answer} — [${seq.join(', ')}]`,
  })
  return steps
}

export const lis: DpAlgorithm = {
  id: 'lis',
  name: 'Longest Increasing Subsequence',
  description:
    'dp[i] is the length of the longest strictly increasing subsequence ending at index i. Each element looks back at every earlier element it can extend.',
  timeComplexity: 'O(n²)',
  spaceComplexity: 'O(n)',
  pseudocode,
  inputs: [{ key: 'nums', label: 'Numbers', placeholder: '10, 9, 2, 5, 3, 7, 101, 18', kind: 'numbers' }],
  defaults: { nums: '10, 9, 2, 5, 3, 7, 101, 18' },
  rowLabels: () => ['dp'],
  colLabels: (v) => parseNumbers(v.nums ?? '', 14).map(String),
  run,
}
