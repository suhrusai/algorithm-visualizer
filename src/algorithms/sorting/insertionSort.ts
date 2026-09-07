import type { SortAlgorithm, SortStep } from '@/types/sorting'

const pseudocode = [
  'procedure insertionSort(A, n)',
  '  for i from 1 to n - 1',
  '    key ← A[i]',
  '    j ← i - 1',
  '    while j >= 0 and A[j] > key',
  '      A[j + 1] ← A[j]',
  '      j ← j - 1',
  '    A[j + 1] ← key',
  '  return A',
]

function run(input: number[]): SortStep[] {
  const a = [...input]
  const n = a.length
  const steps: SortStep[] = []

  steps.push({ array: [...a], line: 0, sorted: n > 0 ? [0] : [], message: 'Start insertion sort. The first element is trivially sorted.' })

  for (let i = 1; i < n; i++) {
    const key = a[i]
    let j = i - 1
    steps.push({
      array: [...a],
      active: [i],
      sorted: Array.from({ length: i }, (_, k) => k),
      line: 2,
      message: `Pick key A[${i}]=${key} to insert into the sorted prefix.`,
    })

    while (j >= 0 && a[j] > key) {
      steps.push({
        array: [...a],
        comparing: [j, j + 1],
        line: 4,
        message: `A[${j}]=${a[j]} > key(${key}), shift it right.`,
      })
      a[j + 1] = a[j]
      steps.push({
        array: [...a],
        swapping: [j + 1],
        line: 5,
        message: `Shifted A[${j}] into position ${j + 1}.`,
      })
      j--
    }

    a[j + 1] = key
    steps.push({
      array: [...a],
      swapping: [j + 1],
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      line: 7,
      message: `Place key(${key}) at index ${j + 1}.`,
    })
  }

  const all = Array.from({ length: n }, (_, idx) => idx)
  steps.push({ array: [...a], sorted: all, line: 8, message: 'Array is fully sorted.' })

  return steps
}

export const insertionSort: SortAlgorithm = {
  id: 'insertion-sort',
  name: 'Insertion Sort',
  description:
    'Builds the final sorted array one item at a time, taking each element and inserting it into its correct position among the already-sorted elements to its left.',
  timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: true,
  pseudocode,
  run,
}
