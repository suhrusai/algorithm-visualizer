import type { DpAlgorithm, DpStep } from '@/types/dp'
import { clone, emptyGrid, parseNumbers } from './util'

const pseudocode = [
  'procedure knapsack(weights, values, W)',
  '  for w from 0 to W: dp[0][w] ← 0',
  '  for i from 1 to n',
  '    for w from 0 to W',
  '      dp[i][w] ← dp[i-1][w]           // skip item i',
  '      if weights[i-1] ≤ w',
  '        take ← values[i-1] + dp[i-1][w - weights[i-1]]',
  '        dp[i][w] ← max(dp[i][w], take)',
  '  return dp[n][W]',
]

function run(values: Record<string, string>): DpStep[] {
  const wts = parseNumbers(values.weights ?? '', 8).map((n) => Math.max(0, Math.round(n)))
  const vals = parseNumbers(values.values ?? '', 8).map((n) => Math.round(n))
  const W = Math.max(0, Math.min(20, Math.round(Number(values.capacity ?? 0))))
  const n = Math.min(wts.length, vals.length)
  const R = n + 1
  const C = W + 1
  const grid = emptyGrid(R, C)
  const steps: DpStep[] = []

  for (let w = 0; w < C; w++) grid[0][w] = 0
  steps.push({ grid: clone(grid), cursor: [0, 0], line: 1, message: `Row 0 (no items) is all zeros.` })

  for (let i = 1; i < R; i++) {
    for (let w = 0; w < C; w++) {
      const skip = grid[i - 1][w] as number
      let best = skip
      const from: [number, number][] = [[i - 1, w]]
      let msg = `Item ${i} (w=${wts[i - 1]}, v=${vals[i - 1]}), capacity ${w}: skip → ${skip}`
      if (wts[i - 1] <= w) {
        const take = vals[i - 1] + (grid[i - 1][w - wts[i - 1]] as number)
        from.push([i - 1, w - wts[i - 1]])
        if (take > best) {
          best = take
          msg += `; take → ${vals[i - 1]} + dp[${i - 1}][${w - wts[i - 1]}] = ${take} ✓`
        } else {
          msg += `; take → ${take}`
        }
      }
      grid[i][w] = best
      steps.push({ grid: clone(grid), cursor: [i, w], from, line: wts[i - 1] <= w ? 7 : 4, message: msg + `.` })
    }
  }

  // reconstruct chosen items
  const path: [number, number][] = []
  const chosen: number[] = []
  let w = W
  for (let i = n; i > 0; i--) {
    path.push([i, w])
    if (grid[i][w] !== grid[i - 1][w]) {
      chosen.unshift(i)
      w -= wts[i - 1]
    }
  }

  const answer = grid[n][W]
  steps.push({
    grid: clone(grid),
    path,
    line: 8,
    message: `Best value ${answer}, taking item(s) ${chosen.join(', ') || 'none'}.`,
    result: `Max value = ${answer} (items: ${chosen.join(', ') || 'none'})`,
  })
  return steps
}

export const knapsack: DpAlgorithm = {
  id: 'knapsack',
  name: '0/1 Knapsack',
  description:
    'dp[i][w] is the best value achievable from the first i items within capacity w. For each item, compare skipping it against taking it (its value plus the best for the remaining capacity).',
  timeComplexity: 'O(n·W)',
  spaceComplexity: 'O(n·W)',
  pseudocode,
  inputs: [
    { key: 'weights', label: 'Weights', placeholder: '2, 3, 4, 5', kind: 'numbers' },
    { key: 'values', label: 'Values', placeholder: '3, 4, 5, 6', kind: 'numbers' },
    { key: 'capacity', label: 'Capacity', placeholder: '8', kind: 'number' },
  ],
  defaults: { weights: '2, 3, 4, 5', values: '3, 4, 5, 6', capacity: '8' },
  rowLabels: (v) => {
    const wts = parseNumbers(v.weights ?? '', 8)
    return ['∅', ...wts.map((_, i) => `item ${i + 1}`)]
  },
  colLabels: (v) => {
    const W = Math.max(0, Math.min(20, Math.round(Number(v.capacity ?? 0))))
    return Array.from({ length: W + 1 }, (_, w) => String(w))
  },
  run,
}
