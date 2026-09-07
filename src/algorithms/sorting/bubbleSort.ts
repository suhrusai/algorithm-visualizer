import type { SortAlgorithm, SortStep } from '@/types/sorting'

const pseudocode = [
  'procedure bubbleSort(A, n)',
  '  for i from 0 to n - 2',
  '    swapped ← false',
  '    for j from 0 to n - i - 2',
  '      if A[j] > A[j + 1]',
  '        swap(A[j], A[j + 1])',
  '        swapped ← true',
  '    if not swapped',
  '      break',
  '  return A',
]

function run(input: number[]): SortStep[] {
  const a = [...input]
  const n = a.length
  const steps: SortStep[] = []
  const sortedIdx: number[] = []

  steps.push({ array: [...a], line: 0, message: 'Start bubble sort.' })

  for (let i = 0; i < n - 1; i++) {
    steps.push({ array: [...a], line: 1, sorted: [...sortedIdx], message: `Pass ${i + 1}: bubble the largest remaining value to the end.` })
    let swapped = false
    steps.push({ array: [...a], line: 2, sorted: [...sortedIdx], message: 'Reset swapped flag.' })

    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...a],
        comparing: [j, j + 1],
        sorted: [...sortedIdx],
        line: 4,
        message: `Compare A[${j}]=${a[j]} and A[${j + 1}]=${a[j + 1]}.`,
      })

      if (a[j] > a[j + 1]) {
        steps.push({
          array: [...a],
          swapping: [j, j + 1],
          sorted: [...sortedIdx],
          line: 5,
          message: `Swap A[${j}] and A[${j + 1}] since A[${j}] > A[${j + 1}].`,
        })
        ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
        swapped = true
        steps.push({
          array: [...a],
          swapping: [j, j + 1],
          sorted: [...sortedIdx],
          line: 6,
          message: 'Mark swapped ← true.',
        })
      }
    }

    sortedIdx.unshift(n - i - 1)

    if (!swapped) {
      steps.push({
        array: [...a],
        sorted: [...sortedIdx],
        line: 8,
        message: 'No swaps this pass — array is sorted. Breaking early.',
      })
      break
    }
  }

  const all = Array.from({ length: n }, (_, idx) => idx)
  steps.push({ array: [...a], sorted: all, line: 9, message: 'Array is fully sorted.' })

  return steps
}

export const bubbleSort: SortAlgorithm = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  description:
    'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The largest unsorted element "bubbles" to its correct position each pass.',
  timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: true,
  pseudocode,
  run,
}
