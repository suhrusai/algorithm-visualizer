import type { DpAlgorithm, DpStep } from '@/types/dp'
import { clone, emptyGrid, parseNumbers } from './util'

const INF = 9999

const pseudocode = [
  'procedure coinChange(coins, amount)',
  '  dp[0] ← 0; dp[1..amount] ← ∞',
  '  for a from 1 to amount',
  '    for each coin c',
  '      if c ≤ a and dp[a - c] + 1 < dp[a]',
  '        dp[a] ← dp[a - c] + 1',
  '  return dp[amount]  (∞ ⇒ impossible)',
]

function run(values: Record<string, string>): DpStep[] {
  const coins = parseNumbers(values.coins ?? '', 6)
    .map((n) => Math.round(n))
    .filter((n) => n > 0)
  const amount = Math.max(0, Math.min(30, Math.round(Number(values.amount ?? 0))))
  const grid = emptyGrid(1, amount + 1)
  const steps: DpStep[] = []

  grid[0][0] = 0
  for (let a = 1; a <= amount; a++) grid[0][a] = INF
  steps.push({ grid: clone(grid), cursor: [0, 0], line: 1, message: `dp[0] = 0 coins; everything else starts at ∞.` })

  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a) {
        const cand = (grid[0][a - c] as number) + 1
        if (cand < (grid[0][a] as number)) {
          grid[0][a] = cand
          steps.push({
            grid: clone(grid),
            cursor: [0, a],
            from: [[0, a - c]],
            line: 5,
            message: `amount ${a}: use coin ${c} → dp[${a - c}] + 1 = ${cand}.`,
          })
        } else {
          steps.push({
            grid: clone(grid),
            cursor: [0, a],
            from: [[0, a - c]],
            line: 4,
            message: `amount ${a}: coin ${c} gives ${cand}, not better than ${grid[0][a]}.`,
          })
        }
      }
    }
  }

  // reconstruct
  const path: [number, number][] = []
  const used: number[] = []
  let a = amount
  while (a > 0 && (grid[0][a] as number) < INF) {
    path.push([0, a])
    const c = coins.find((coin) => coin <= a && (grid[0][a - coin] as number) + 1 === grid[0][a])
    if (c === undefined) break
    used.push(c)
    a -= c
  }
  if (grid[0][amount] !== null && (grid[0][amount] as number) < INF) path.push([0, 0])

  const answer = grid[0][amount] as number
  steps.push({
    grid: clone(grid),
    path,
    line: 6,
    message:
      answer >= INF
        ? `Amount ${amount} can't be made from {${coins.join(', ')}}.`
        : `Fewest coins: ${answer} (${used.sort((x, y) => x - y).join(' + ')}).`,
    result: answer >= INF ? 'Impossible' : `${answer} coins (${used.sort((x, y) => x - y).join(' + ')})`,
  })
  return steps
}

export const coinChange: DpAlgorithm = {
  id: 'coin-change',
  name: 'Coin Change (fewest coins)',
  description:
    'A 1-D table where dp[a] is the minimum number of coins that sum to a. Each amount tries every coin, taking one plus the best solution for the remainder.',
  timeComplexity: 'O(amount · #coins)',
  spaceComplexity: 'O(amount)',
  pseudocode,
  inputs: [
    { key: 'coins', label: 'Coins', placeholder: '1, 3, 4', kind: 'numbers' },
    { key: 'amount', label: 'Amount', placeholder: '6', kind: 'number' },
  ],
  defaults: { coins: '1, 3, 4', amount: '6' },
  rowLabels: () => ['dp'],
  colLabels: (v) => {
    const amount = Math.max(0, Math.min(30, Math.round(Number(v.amount ?? 0))))
    return Array.from({ length: amount + 1 }, (_, a) => String(a))
  },
  run,
}
