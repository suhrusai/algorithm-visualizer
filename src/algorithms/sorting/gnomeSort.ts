import type { SortAlgorithm, SortStep } from '@/types/sorting'

const pseudocode = [
  'procedure gnomeSort(A, n)',
  '  i ← 0',
  '  while i < n',
  '    if i = 0 or A[i - 1] ≤ A[i]',
  '      i ← i + 1',
  '    else',
  '      swap(A[i - 1], A[i]); i ← i - 1',
]

function run(input: number[]): SortStep[] {
  const a = [...input]
  const n = a.length
  const steps: SortStep[] = []

  steps.push({ array: [...a], line: 0, message: 'Gnome sort: step forward when in order, step back and swap when not.' })

  let i = 0
  while (i < n) {
    if (i === 0) {
      i++
      continue
    }
    steps.push({ array: [...a], comparing: [i - 1, i], active: [i], line: 3, message: `At index ${i}: is A[${i - 1}]=${a[i - 1]} ≤ A[${i}]=${a[i]}?` })
    if (a[i - 1] <= a[i]) {
      i++
      steps.push({ array: [...a], active: [Math.min(i, n - 1)], line: 4, message: `In order — step forward to index ${i}.` })
    } else {
      ;[a[i - 1], a[i]] = [a[i], a[i - 1]]
      steps.push({ array: [...a], swapping: [i - 1, i], line: 6, message: `Out of order — swap and step back to index ${i - 1}.` })
      i--
    }
  }

  steps.push({ array: [...a], sorted: a.map((_, k) => k), line: 2, message: 'Walked off the end in order — array is sorted.' })
  return steps
}

export const gnomeSort: SortAlgorithm = {
  id: 'gnome-sort',
  name: 'Gnome Sort',
  description:
    'A single pointer walks the array: if the current pair is in order it moves forward, otherwise it swaps and moves back one. Equivalent to insertion sort with the shifts done by swapping. Tiny to state, no nested loops.',
  timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: true,
  pseudocode,
  run,
}
