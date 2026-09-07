import type { SortAlgorithm, SortStep } from '@/types/sorting'

const pseudocode = [
  'procedure quickSort(A, lo, hi)',
  '  if lo < hi',
  '    p ← partition(A, lo, hi)',
  '    quickSort(A, lo, p - 1)',
  '    quickSort(A, p + 1, hi)',
  '',
  'procedure partition(A, lo, hi)',
  '  pivot ← A[hi]',
  '  i ← lo - 1',
  '  for j from lo to hi - 1',
  '    if A[j] < pivot',
  '      i ← i + 1',
  '      swap(A[i], A[j])',
  '  swap(A[i + 1], A[hi])',
  '  return i + 1',
]

function run(input: number[]): SortStep[] {
  const a = [...input]
  const n = a.length
  const steps: SortStep[] = []
  const sortedIdx = new Set<number>()

  steps.push({ array: [...a], line: 0, message: 'Start quick sort (divide and conquer with a pivot).' })

  function quickSort(lo: number, hi: number) {
    if (lo < hi) {
      steps.push({
        array: [...a],
        active: Array.from({ length: hi - lo + 1 }, (_, k) => lo + k),
        sorted: [...sortedIdx],
        line: 1,
        message: `Partition range [${lo}, ${hi}].`,
      })
      const p = partition(lo, hi)
      sortedIdx.add(p)
      quickSort(lo, p - 1)
      quickSort(p + 1, hi)
    } else if (lo === hi) {
      sortedIdx.add(lo)
      steps.push({ array: [...a], sorted: [...sortedIdx], line: 1, message: `Range [${lo}, ${hi}] has one element — sorted.` })
    }
  }

  function partition(lo: number, hi: number): number {
    const pivot = a[hi]
    steps.push({
      array: [...a],
      pivot: hi,
      active: Array.from({ length: hi - lo + 1 }, (_, k) => lo + k),
      sorted: [...sortedIdx],
      line: 7,
      message: `Choose pivot = A[${hi}] = ${pivot}.`,
    })

    let i = lo - 1
    for (let j = lo; j < hi; j++) {
      steps.push({
        array: [...a],
        pivot: hi,
        comparing: [j, hi],
        sorted: [...sortedIdx],
        line: 10,
        message: `Compare A[${j}]=${a[j]} with pivot ${pivot}.`,
      })
      if (a[j] < pivot) {
        i++
        if (i !== j) {
          steps.push({
            array: [...a],
            pivot: hi,
            swapping: [i, j],
            sorted: [...sortedIdx],
            line: 12,
            message: `A[${j}] < pivot, swap A[${i}] and A[${j}].`,
          })
          ;[a[i], a[j]] = [a[j], a[i]]
        }
      }
    }

    steps.push({
      array: [...a],
      pivot: hi,
      swapping: [i + 1, hi],
      sorted: [...sortedIdx],
      line: 13,
      message: `Place pivot in its final position at index ${i + 1}.`,
    })
    ;[a[i + 1], a[hi]] = [a[hi], a[i + 1]]

    return i + 1
  }

  quickSort(0, n - 1)

  const all = Array.from({ length: n }, (_, idx) => idx)
  steps.push({ array: [...a], sorted: all, line: 4, message: 'Array is fully sorted.' })

  return steps
}

export const quickSort: SortAlgorithm = {
  id: 'quick-sort',
  name: 'Quick Sort',
  description:
    'Picks a pivot element and partitions the array so smaller elements go left and larger go right, then recursively sorts the partitions.',
  timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
  spaceComplexity: 'O(log n)',
  stable: false,
  pseudocode,
  run,
}
