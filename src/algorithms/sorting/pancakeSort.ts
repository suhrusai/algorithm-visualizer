import type { SortAlgorithm, SortStep } from '@/types/sorting'

const pseudocode = [
  'procedure pancakeSort(A, n)',
  '  for curr ← n - 1 down to 1',
  '    m ← index of max in A[0..curr]',
  '    if m ≠ curr',
  '      flip(A, m)      ▷ bring the max to the front',
  '      flip(A, curr)   ▷ send it to its final spot',
]

function run(input: number[]): SortStep[] {
  const a = [...input]
  const n = a.length
  const steps: SortStep[] = []

  steps.push({ array: [...a], line: 0, message: 'Pancake sort: the only move allowed is flipping a prefix of the stack.' })

  const flip = (k: number, line: number, why: string) => {
    let lo = 0
    let hi = k
    while (lo < hi) {
      ;[a[lo], a[hi]] = [a[hi], a[lo]]
      steps.push({ array: [...a], swapping: [lo, hi], active: [0, k], line, message: why })
      lo++
      hi--
    }
  }

  for (let curr = n - 1; curr > 0; curr--) {
    let m = 0
    for (let i = 1; i <= curr; i++) {
      steps.push({ array: [...a], comparing: [i, m], active: [0, curr], line: 2, message: `Scanning A[0..${curr}] for the largest value.` })
      if (a[i] > a[m]) m = i
    }

    if (m !== curr) {
      if (m !== 0) flip(m, 4, `Flip the first ${m + 1} so the max (A[${m}] = ${a[m]}) lands at the front.`)
      flip(curr, 5, `Flip the first ${curr + 1} so the max drops into place at index ${curr}.`)
    }
    steps.push({ array: [...a], sorted: Array.from({ length: n - curr }, (_, k) => curr + k), line: 1, message: `A[${curr}] is now fixed.` })
  }

  steps.push({ array: [...a], sorted: a.map((_, k) => k), line: 1, message: 'Every plate is in place — the stack is sorted.' })
  return steps
}

export const pancakeSort: SortAlgorithm = {
  id: 'pancake-sort',
  name: 'Pancake Sort',
  description:
    'Sorts using only prefix reversals — like sorting a stack of pancakes by slipping a spatula in and flipping everything above it. Each pass flips the current largest value to the front, then flips it down to its final position. Minimises the number of flips, not comparisons.',
  timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: false,
  pseudocode,
  run,
}
