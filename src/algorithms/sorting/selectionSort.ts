import type { SortAlgorithm, SortStep } from '@/types/sorting'

const pseudocode = [
  'procedure selectionSort(A, n)',
  '  for i from 0 to n - 2',
  '    minIndex ← i',
  '    for j from i + 1 to n - 1',
  '      if A[j] < A[minIndex]',
  '        minIndex ← j',
  '    if minIndex ≠ i',
  '      swap(A[i], A[minIndex])',
  '  return A',
]

function run(input: number[]): SortStep[] {
  const a = [...input]
  const n = a.length
  const steps: SortStep[] = []
  const sortedIdx: number[] = []

  steps.push({ array: [...a], line: 0, message: 'Start selection sort.' })

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i
    steps.push({
      array: [...a],
      sorted: [...sortedIdx],
      active: [i],
      line: 2,
      message: `Assume A[${i}]=${a[i]} is the minimum of the unsorted range.`,
    })

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...a],
        sorted: [...sortedIdx],
        comparing: [minIndex, j],
        line: 4,
        message: `Compare A[${j}]=${a[j]} with current min A[${minIndex}]=${a[minIndex]}.`,
      })

      if (a[j] < a[minIndex]) {
        minIndex = j
        steps.push({
          array: [...a],
          sorted: [...sortedIdx],
          active: [minIndex],
          line: 5,
          message: `New minimum found at index ${minIndex}.`,
        })
      }
    }

    if (minIndex !== i) {
      steps.push({
        array: [...a],
        sorted: [...sortedIdx],
        swapping: [i, minIndex],
        line: 7,
        message: `Swap A[${i}] and A[${minIndex}].`,
      })
      ;[a[i], a[minIndex]] = [a[minIndex], a[i]]
    }

    sortedIdx.push(i)
    steps.push({
      array: [...a],
      sorted: [...sortedIdx],
      line: 1,
      message: `Index ${i} is now in its final sorted position.`,
    })
  }

  const all = Array.from({ length: n }, (_, idx) => idx)
  steps.push({ array: [...a], sorted: all, line: 8, message: 'Array is fully sorted.' })

  return steps
}

export const selectionSort: SortAlgorithm = {
  id: 'selection-sort',
  name: 'Selection Sort',
  description:
    'Divides the list into a sorted and unsorted region, repeatedly selecting the smallest element from the unsorted region and moving it to the end of the sorted region.',
  timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: false,
  pseudocode,
  run,
}
