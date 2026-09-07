import type { SortAlgorithm, SortStep } from '@/types/sorting'

const pseudocode = [
  'procedure heapSort(A, n)',
  '  buildMaxHeap(A, n)',
  '  for end from n - 1 downto 1',
  '    swap(A[0], A[end])',
  '    siftDown(A, 0, end)',
  '',
  'procedure siftDown(A, i, size)',
  '  largest ← i',
  '  l ← 2i + 1, r ← 2i + 2',
  '  if l < size and A[l] > A[largest]: largest ← l',
  '  if r < size and A[r] > A[largest]: largest ← r',
  '  if largest ≠ i',
  '    swap(A[i], A[largest])',
  '    siftDown(A, largest, size)',
]

function run(input: number[]): SortStep[] {
  const a = [...input]
  const n = a.length
  const steps: SortStep[] = []
  const sortedIdx: number[] = []

  steps.push({ array: [...a], line: 0, message: 'Start heap sort.' })

  function siftDown(i: number, size: number) {
    let largest = i
    const l = 2 * i + 1
    const r = 2 * i + 2

    steps.push({
      array: [...a],
      active: [i, l, r].filter((idx) => idx < size),
      sorted: [...sortedIdx],
      line: 7,
      message: `Sift down from index ${i}.`,
    })

    if (l < size) {
      steps.push({ array: [...a], comparing: [l, largest], sorted: [...sortedIdx], line: 9, message: `Compare left child A[${l}]=${a[l]} with A[${largest}]=${a[largest]}.` })
      if (a[l] > a[largest]) largest = l
    }
    if (r < size) {
      steps.push({ array: [...a], comparing: [r, largest], sorted: [...sortedIdx], line: 10, message: `Compare right child A[${r}]=${a[r]} with A[${largest}]=${a[largest]}.` })
      if (a[r] > a[largest]) largest = r
    }

    if (largest !== i) {
      steps.push({ array: [...a], swapping: [i, largest], sorted: [...sortedIdx], line: 12, message: `Swap A[${i}] and A[${largest}] to restore heap property.` })
      ;[a[i], a[largest]] = [a[largest], a[i]]
      siftDown(largest, size)
    }
  }

  steps.push({ array: [...a], line: 1, message: 'Build a max-heap from the array.' })
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    siftDown(i, n)
  }
  steps.push({ array: [...a], line: 1, message: 'Max-heap built. The largest element is now at the root.' })

  for (let end = n - 1; end > 0; end--) {
    steps.push({
      array: [...a],
      swapping: [0, end],
      sorted: [...sortedIdx],
      line: 3,
      message: `Swap root A[0]=${a[0]} (max) with A[${end}]=${a[end]}.`,
    })
    ;[a[0], a[end]] = [a[end], a[0]]
    sortedIdx.unshift(end)
    steps.push({ array: [...a], sorted: [...sortedIdx], line: 4, message: `Restore heap property on the remaining ${end} elements.` })
    siftDown(0, end)
  }

  sortedIdx.unshift(0)
  steps.push({ array: [...a], sorted: [...sortedIdx], line: 4, message: 'Array is fully sorted.' })

  return steps
}

export const heapSort: SortAlgorithm = {
  id: 'heap-sort',
  name: 'Heap Sort',
  description:
    'Builds a max-heap from the array, then repeatedly swaps the root (maximum) with the last unsorted element and restores the heap property.',
  timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
  spaceComplexity: 'O(1)',
  stable: false,
  pseudocode,
  run,
}
