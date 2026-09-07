import type { SortAlgorithm, SortStep } from '@/types/sorting'

const pseudocode = [
  'procedure combSort(A, n)',
  '  gap ← n; sorted ← false',
  '  while gap > 1 or not sorted',
  '    gap ← max(1, floor(gap / 1.3))',
  '    sorted ← true',
  '    for i from 0 to n - gap - 1',
  '      if A[i] > A[i + gap]',
  '        swap(A[i], A[i + gap]); sorted ← false',
]

function run(input: number[]): SortStep[] {
  const a = [...input]
  const n = a.length
  const steps: SortStep[] = []

  steps.push({ array: [...a], line: 0, message: 'Comb sort: bubble sort with a shrinking gap (÷1.3 each pass).' })

  let gap = n
  let sorted = false
  while (gap > 1 || !sorted) {
    gap = Math.max(1, Math.floor(gap / 1.3))
    sorted = true
    steps.push({ array: [...a], line: 3, message: `Gap = ${gap}.` })
    for (let i = 0; i + gap < n; i++) {
      steps.push({ array: [...a], comparing: [i, i + gap], line: 6, message: `Compare A[${i}]=${a[i]} and A[${i + gap}]=${a[i + gap]}.` })
      if (a[i] > a[i + gap]) {
        ;[a[i], a[i + gap]] = [a[i + gap], a[i]]
        sorted = false
        steps.push({ array: [...a], swapping: [i, i + gap], line: 7, message: `Out of order — swap.` })
      }
    }
  }

  steps.push({ array: [...a], sorted: a.map((_, i) => i), line: 2, message: 'Gap is 1 and a pass made no swaps — array is sorted.' })
  return steps
}

export const combSort: SortAlgorithm = {
  id: 'comb-sort',
  name: 'Comb Sort',
  description:
    'Improves bubble sort by comparing elements a large gap apart first and shrinking the gap by a factor of ~1.3 each pass. Large gaps kill "turtles" quickly; the final gap-1 pass is a cheap bubble sort.',
  timeComplexity: { best: 'O(n log n)', average: 'O(n² / 2^p)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: false,
  pseudocode,
  run,
}
