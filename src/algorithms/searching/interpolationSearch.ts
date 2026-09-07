import type { SearchAlgorithm, SearchStep } from '@/types/searching'

const pseudocode = [
  'procedure interpolationSearch(A, n, target)',
  '  lo ← 0; hi ← n - 1',
  '  while lo ≤ hi and A[lo] ≤ target ≤ A[hi]',
  '    pos ← lo + (target - A[lo]) · (hi - lo) / (A[hi] - A[lo])',
  '    if A[pos] = target',
  '      return pos',
  '    else if A[pos] < target',
  '      lo ← pos + 1',
  '    else',
  '      hi ← pos - 1',
  '  return NOT_FOUND',
]

function run(input: number[], target: number): SearchStep[] {
  const a = [...input]
  const steps: SearchStep[] = []
  const eliminated: number[] = []
  let lo = 0
  let hi = a.length - 1

  steps.push({ array: a, target, lo, hi, line: 1, message: `Search the whole array for ${target}.` })

  while (lo <= hi && target >= a[lo] && target <= a[hi]) {
    let pos: number
    if (a[hi] === a[lo]) {
      pos = lo
    } else {
      pos = lo + Math.floor(((target - a[lo]) * (hi - lo)) / (a[hi] - a[lo]))
    }
    pos = Math.min(hi, Math.max(lo, pos))

    steps.push({
      array: a,
      target,
      lo,
      hi,
      probe: pos,
      eliminated: [...eliminated],
      line: 3,
      message: `Estimate the position from the values at the ends: pos = ${pos}. A[${pos}] = ${a[pos]}.`,
    })

    if (a[pos] === target) {
      steps.push({ array: a, target, found: pos, eliminated: [...eliminated], done: true, line: 5, message: `A[${pos}] = ${target}. Found it at index ${pos}.` })
      return steps
    }

    if (a[pos] < target) {
      for (let k = lo; k <= pos; k++) eliminated.push(k)
      lo = pos + 1
      steps.push({ array: a, target, lo, hi, eliminated: [...eliminated], line: 7, message: `${a[pos]} < ${target}, so look to the right. lo ← ${lo}.` })
    } else {
      for (let k = pos; k <= hi; k++) eliminated.push(k)
      hi = pos - 1
      steps.push({ array: a, target, lo, hi, eliminated: [...eliminated], line: 9, message: `${a[pos]} > ${target}, so look to the left. hi ← ${hi}.` })
    }
  }

  steps.push({ array: a, target, eliminated: [...eliminated], done: true, line: 10, message: `${target} is not in the array.` })
  return steps
}

export const interpolationSearch: SearchAlgorithm = {
  id: 'interpolation-search',
  name: 'Interpolation Search',
  description:
    'Like binary search, but instead of always probing the midpoint it estimates where the target should be based on the values at the ends of the window. Very fast on uniformly distributed sorted data.',
  timeComplexity: { best: 'O(1)', average: 'O(log log n)', worst: 'O(n)' },
  spaceComplexity: 'O(1)',
  requiresSorted: true,
  pseudocode,
  run,
}
