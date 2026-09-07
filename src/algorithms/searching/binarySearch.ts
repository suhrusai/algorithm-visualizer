import type { SearchAlgorithm, SearchStep } from '@/types/searching'

const pseudocode = [
  'procedure binarySearch(A, n, target)',
  '  lo ← 0; hi ← n - 1',
  '  while lo ≤ hi',
  '    mid ← ⌊(lo + hi) / 2⌋',
  '    if A[mid] = target',
  '      return mid',
  '    else if A[mid] < target',
  '      lo ← mid + 1',
  '    else',
  '      hi ← mid - 1',
  '  return NOT_FOUND',
]

function run(input: number[], target: number): SearchStep[] {
  const a = [...input]
  const steps: SearchStep[] = []
  const eliminated: number[] = []
  let lo = 0
  let hi = a.length - 1

  steps.push({ array: a, target, lo, hi, line: 1, message: `Search the whole array for ${target}.` })

  while (lo <= hi) {
    steps.push({ array: a, target, lo, hi, eliminated: [...eliminated], line: 2, message: `Window is [${lo}, ${hi}].` })
    const mid = Math.floor((lo + hi) / 2)
    steps.push({
      array: a,
      target,
      lo,
      hi,
      probe: mid,
      eliminated: [...eliminated],
      line: 3,
      message: `Check the middle: A[${mid}] = ${a[mid]}.`,
    })

    if (a[mid] === target) {
      steps.push({
        array: a,
        target,
        found: mid,
        eliminated: [...eliminated],
        done: true,
        line: 5,
        message: `A[${mid}] = ${target}. Found it at index ${mid}.`,
      })
      return steps
    }

    if (a[mid] < target) {
      for (let k = lo; k <= mid; k++) eliminated.push(k)
      lo = mid + 1
      steps.push({
        array: a,
        target,
        lo,
        hi,
        eliminated: [...eliminated],
        line: 7,
        message: `${a[mid]} < ${target}, so discard the left half. lo ← ${lo}.`,
      })
    } else {
      for (let k = mid; k <= hi; k++) eliminated.push(k)
      hi = mid - 1
      steps.push({
        array: a,
        target,
        lo,
        hi,
        eliminated: [...eliminated],
        line: 9,
        message: `${a[mid]} > ${target}, so discard the right half. hi ← ${hi}.`,
      })
    }
  }

  steps.push({
    array: a,
    target,
    eliminated: [...eliminated],
    done: true,
    line: 10,
    message: `Window is empty. ${target} is not in the array.`,
  })
  return steps
}

export const binarySearch: SearchAlgorithm = {
  id: 'binary-search',
  name: 'Binary Search',
  description:
    'Repeatedly halves a sorted array: compare the target with the middle element and discard the half that cannot contain it. Requires the array to be sorted.',
  timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
  spaceComplexity: 'O(1)',
  requiresSorted: true,
  pseudocode,
  run,
}
