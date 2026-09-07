import type { SearchAlgorithm, SearchStep } from '@/types/searching'

const pseudocode = [
  'procedure ternarySearch(A, lo, hi, target)',
  '  while lo ≤ hi',
  '    m1 ← lo + (hi - lo) / 3',
  '    m2 ← hi - (hi - lo) / 3',
  '    if A[m1] = target: return m1',
  '    if A[m2] = target: return m2',
  '    if target < A[m1]: hi ← m1 - 1',
  '    else if target > A[m2]: lo ← m2 + 1',
  '    else: lo ← m1 + 1; hi ← m2 - 1',
  '  return NOT_FOUND',
]

function run(input: number[], target: number): SearchStep[] {
  const a = [...input]
  const steps: SearchStep[] = []
  const eliminated: number[] = []
  let lo = 0
  let hi = a.length - 1

  steps.push({ array: a, target, lo, hi, line: 0, message: `Search the whole array for ${target}.` })

  while (lo <= hi) {
    const third = Math.floor((hi - lo) / 3)
    const m1 = lo + third
    const m2 = hi - third

    steps.push({ array: a, target, lo, hi, probe: m1, eliminated: [...eliminated], line: 2, message: `First third boundary: A[${m1}] = ${a[m1]}.` })
    if (a[m1] === target) {
      steps.push({ array: a, target, found: m1, eliminated: [...eliminated], done: true, line: 4, message: `Found ${target} at index ${m1}.` })
      return steps
    }

    steps.push({ array: a, target, lo, hi, probe: m2, eliminated: [...eliminated], line: 3, message: `Second third boundary: A[${m2}] = ${a[m2]}.` })
    if (a[m2] === target) {
      steps.push({ array: a, target, found: m2, eliminated: [...eliminated], done: true, line: 5, message: `Found ${target} at index ${m2}.` })
      return steps
    }

    if (target < a[m1]) {
      for (let k = m1; k <= hi; k++) eliminated.push(k)
      hi = m1 - 1
      steps.push({ array: a, target, lo, hi, eliminated: [...eliminated], line: 6, message: `${target} < ${a[m1]}, so keep the first third. hi ← ${hi}.` })
    } else if (target > a[m2]) {
      for (let k = lo; k <= m2; k++) eliminated.push(k)
      lo = m2 + 1
      steps.push({ array: a, target, lo, hi, eliminated: [...eliminated], line: 7, message: `${target} > ${a[m2]}, so keep the last third. lo ← ${lo}.` })
    } else {
      for (let k = lo; k <= m1; k++) eliminated.push(k)
      for (let k = m2; k <= hi; k++) eliminated.push(k)
      lo = m1 + 1
      hi = m2 - 1
      steps.push({ array: a, target, lo, hi, eliminated: [...eliminated], line: 8, message: `${target} sits between the boundaries — keep the middle third [${lo}, ${hi}].` })
    }
  }

  steps.push({ array: a, target, eliminated: [...eliminated], done: true, line: 9, message: `${target} is not in the array.` })
  return steps
}

export const ternarySearch: SearchAlgorithm = {
  id: 'ternary-search',
  name: 'Ternary Search',
  description:
    'Splits the sorted window into three parts using two probes each pass, then keeps the one third that can still contain the target. Does more comparisons per step than binary search but fewer iterations — the same family of ideas used to find the peak of a unimodal function.',
  timeComplexity: { best: 'O(1)', average: 'O(log₃ n)', worst: 'O(log₃ n)' },
  spaceComplexity: 'O(1)',
  requiresSorted: true,
  pseudocode,
  run,
}
