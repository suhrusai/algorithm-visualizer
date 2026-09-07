import type { SortAlgorithm, SortStep } from '@/types/sorting'

const pseudocode = [
  'procedure mergeSort(A, lo, hi)',
  '  if hi - lo <= 1',
  '    return',
  '  mid ← (lo + hi) / 2',
  '  mergeSort(A, lo, mid)',
  '  mergeSort(A, mid, hi)',
  '  merge(A, lo, mid, hi)',
  '',
  'procedure merge(A, lo, mid, hi)',
  '  L ← A[lo..mid), R ← A[mid..hi)',
  '  i ← 0, j ← 0, k ← lo',
  '  while i < len(L) and j < len(R)',
  '    if L[i] <= R[j]: A[k++] ← L[i++]',
  '    else: A[k++] ← R[j++]',
  '  copy remaining L, R into A',
]

function run(input: number[]): SortStep[] {
  const a = [...input]
  const n = a.length
  const steps: SortStep[] = []

  steps.push({ array: [...a], line: 0, message: 'Start merge sort (divide and conquer).' })

  function mergeSort(lo: number, hi: number) {
    if (hi - lo <= 1) {
      steps.push({
        array: [...a],
        active: Array.from({ length: hi - lo }, (_, k) => lo + k),
        line: 2,
        message: `Range [${lo}, ${hi}) has ${hi - lo} element(s) — already sorted.`,
      })
      return
    }
    const mid = Math.floor((lo + hi) / 2)
    steps.push({
      array: [...a],
      active: Array.from({ length: hi - lo }, (_, k) => lo + k),
      line: 3,
      message: `Split range [${lo}, ${hi}) at midpoint ${mid}.`,
    })
    mergeSort(lo, mid)
    mergeSort(mid, hi)
    merge(lo, mid, hi)
  }

  function merge(lo: number, mid: number, hi: number) {
    const L = a.slice(lo, mid)
    const R = a.slice(mid, hi)
    steps.push({
      array: [...a],
      active: Array.from({ length: hi - lo }, (_, k) => lo + k),
      line: 8,
      message: `Merge sorted halves [${lo}, ${mid}) and [${mid}, ${hi}).`,
    })

    let i = 0
    let j = 0
    let k = lo

    while (i < L.length && j < R.length) {
      steps.push({
        array: [...a],
        comparing: [lo + i, mid + j],
        active: Array.from({ length: hi - lo }, (_, x) => lo + x),
        line: 11,
        message: `Compare L[${i}]=${L[i]} with R[${j}]=${R[j]}.`,
      })
      if (L[i] <= R[j]) {
        a[k] = L[i]
        steps.push({ array: [...a], swapping: [k], line: 12, message: `Write ${L[i]} into A[${k}] from left half.` })
        i++
      } else {
        a[k] = R[j]
        steps.push({ array: [...a], swapping: [k], line: 13, message: `Write ${R[j]} into A[${k}] from right half.` })
        j++
      }
      k++
    }

    while (i < L.length) {
      a[k] = L[i]
      steps.push({ array: [...a], swapping: [k], line: 14, message: `Copy remaining left value ${L[i]} into A[${k}].` })
      i++
      k++
    }
    while (j < R.length) {
      a[k] = R[j]
      steps.push({ array: [...a], swapping: [k], line: 14, message: `Copy remaining right value ${R[j]} into A[${k}].` })
      j++
      k++
    }
  }

  mergeSort(0, n)

  const all = Array.from({ length: n }, (_, idx) => idx)
  steps.push({ array: [...a], sorted: all, line: 7, message: 'Array is fully sorted.' })

  return steps
}

export const mergeSort: SortAlgorithm = {
  id: 'merge-sort',
  name: 'Merge Sort',
  description:
    'A divide-and-conquer algorithm that splits the array in half, recursively sorts each half, and merges the two sorted halves back together.',
  timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
  spaceComplexity: 'O(n)',
  stable: true,
  pseudocode,
  run,
}
