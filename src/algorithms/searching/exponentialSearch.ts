import type { SearchAlgorithm, SearchStep } from '@/types/searching'

const pseudocode = [
  'procedure exponentialSearch(A, n, target)',
  '  if A[0] = target: return 0',
  '  bound ← 1',
  '  while bound < n and A[bound] < target',
  '    bound ← bound · 2',
  '  lo ← bound / 2; hi ← min(bound, n - 1)',
  '  binary search A[lo..hi] for target',
]

function run(input: number[], target: number): SearchStep[] {
  const a = [...input]
  const n = a.length
  const steps: SearchStep[] = []
  const eliminated: number[] = []

  if (n === 0) {
    steps.push({ array: a, target, done: true, line: 0, message: 'The array is empty.' })
    return steps
  }

  steps.push({ array: a, target, probe: 0, line: 1, message: `Is A[0] = ${a[0]} the target ${target}?` })
  if (a[0] === target) {
    steps.push({ array: a, target, found: 0, done: true, line: 1, message: `Found ${target} at index 0.` })
    return steps
  }

  let bound = 1
  while (bound < n && a[bound] < target) {
    steps.push({
      array: a,
      target,
      probe: bound,
      eliminated: [...eliminated],
      line: 3,
      message: `A[${bound}] = ${a[bound]} < ${target}. Double the bound.`,
    })
    for (let k = 0; k <= bound; k++) eliminated.push(k)
    bound *= 2
  }

  const lo = Math.floor(bound / 2)
  let hi = Math.min(bound, n - 1)
  for (let k = 0; k < lo; k++) eliminated.push(k)

  steps.push({
    array: a,
    target,
    lo,
    hi,
    eliminated: [...eliminated],
    line: 5,
    message: `Target lies in A[${lo}..${hi}]. Binary search that window.`,
  })

  let l = lo
  while (l <= hi) {
    const mid = (l + hi) >> 1
    steps.push({ array: a, target, lo: l, hi, probe: mid, eliminated: [...eliminated], line: 6, message: `Probe the midpoint A[${mid}] = ${a[mid]}.` })
    if (a[mid] === target) {
      steps.push({ array: a, target, found: mid, eliminated: [...eliminated], done: true, line: 6, message: `Found ${target} at index ${mid}.` })
      return steps
    }
    if (a[mid] < target) {
      for (let k = l; k <= mid; k++) eliminated.push(k)
      l = mid + 1
    } else {
      for (let k = mid; k <= hi; k++) eliminated.push(k)
      hi = mid - 1
    }
  }

  steps.push({ array: a, target, eliminated: [...eliminated], done: true, line: 6, message: `${target} is not in the array.` })
  return steps
}

export const exponentialSearch: SearchAlgorithm = {
  id: 'exponential-search',
  name: 'Exponential Search',
  description:
    'Doubles an index bound until it passes the target, then binary searches the last doubling window. Reaches an element near position i in O(log i) time, so it beats plain binary search when the target sits near the front of a huge or unbounded sorted list.',
  timeComplexity: { best: 'O(1)', average: 'O(log i)', worst: 'O(log n)' },
  spaceComplexity: 'O(1)',
  requiresSorted: true,
  pseudocode,
  run,
}
