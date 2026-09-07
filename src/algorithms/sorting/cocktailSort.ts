import type { SortAlgorithm, SortStep } from '@/types/sorting'

const pseudocode = [
  'procedure cocktailSort(A, n)',
  '  lo ← 0; hi ← n - 1; swapped ← true',
  '  while swapped',
  '    swapped ← false',
  '    for i from lo to hi - 1        // forward pass',
  '      if A[i] > A[i + 1]: swap; swapped ← true',
  '    hi ← hi - 1',
  '    for i from hi down to lo + 1   // backward pass',
  '      if A[i - 1] > A[i]: swap; swapped ← true',
  '    lo ← lo + 1',
]

function run(input: number[]): SortStep[] {
  const a = [...input]
  const n = a.length
  const steps: SortStep[] = []
  const sorted = new Set<number>()

  steps.push({ array: [...a], line: 0, message: 'Cocktail shaker sort: bubble sort that alternates direction each pass.' })

  let lo = 0
  let hi = n - 1
  let swapped = true
  while (swapped) {
    swapped = false
    steps.push({ array: [...a], sorted: [...sorted], line: 4, message: `Forward pass over [${lo}, ${hi}] — push the largest to the right.` })
    for (let i = lo; i < hi; i++) {
      steps.push({ array: [...a], sorted: [...sorted], comparing: [i, i + 1], line: 5, message: `Compare A[${i}]=${a[i]} and A[${i + 1}]=${a[i + 1]}.` })
      if (a[i] > a[i + 1]) {
        ;[a[i], a[i + 1]] = [a[i + 1], a[i]]
        swapped = true
        steps.push({ array: [...a], sorted: [...sorted], swapping: [i, i + 1], line: 5, message: `Swap.` })
      }
    }
    sorted.add(hi)
    hi--
    if (!swapped) break
    swapped = false
    steps.push({ array: [...a], sorted: [...sorted], line: 7, message: `Backward pass over [${lo}, ${hi}] — pull the smallest to the left.` })
    for (let i = hi; i > lo; i--) {
      steps.push({ array: [...a], sorted: [...sorted], comparing: [i - 1, i], line: 8, message: `Compare A[${i - 1}]=${a[i - 1]} and A[${i}]=${a[i]}.` })
      if (a[i - 1] > a[i]) {
        ;[a[i - 1], a[i]] = [a[i], a[i - 1]]
        swapped = true
        steps.push({ array: [...a], sorted: [...sorted], swapping: [i - 1, i], line: 8, message: `Swap.` })
      }
    }
    sorted.add(lo)
    lo++
  }

  steps.push({ array: [...a], sorted: a.map((_, i) => i), line: 2, message: 'A full pass with no swaps — array is sorted.' })
  return steps
}

export const cocktailSort: SortAlgorithm = {
  id: 'cocktail-sort',
  name: 'Cocktail Shaker Sort',
  description:
    'A bidirectional bubble sort: each round bubbles the largest element to the right, then the smallest to the left. This clears "turtles" (small values near the end) faster than plain bubble sort.',
  timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: true,
  pseudocode,
  run,
}
