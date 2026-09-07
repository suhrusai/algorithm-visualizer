import type { SearchAlgorithm, SearchStep } from '@/types/searching'

const pseudocode = [
  'procedure linearSearch(A, n, target)',
  '  for i from 0 to n - 1',
  '    if A[i] = target',
  '      return i',
  '  return NOT_FOUND',
]

function run(input: number[], target: number): SearchStep[] {
  const a = [...input]
  const n = a.length
  const steps: SearchStep[] = []
  const eliminated: number[] = []

  steps.push({ array: a, target, line: 0, message: `Scan the array left to right for ${target}.` })

  for (let i = 0; i < n; i++) {
    steps.push({
      array: a,
      target,
      probe: i,
      eliminated: [...eliminated],
      line: 2,
      message: `Is A[${i}] = ${a[i]} equal to ${target}?`,
    })

    if (a[i] === target) {
      steps.push({
        array: a,
        target,
        found: i,
        eliminated: [...eliminated],
        done: true,
        line: 3,
        message: `Found ${target} at index ${i}.`,
      })
      return steps
    }

    eliminated.push(i)
  }

  steps.push({
    array: a,
    target,
    eliminated: [...eliminated],
    done: true,
    line: 4,
    message: `Reached the end without finding ${target}.`,
  })
  return steps
}

export const linearSearch: SearchAlgorithm = {
  id: 'linear-search',
  name: 'Linear Search',
  description:
    'Walks through the array one element at a time, comparing each against the target. Works on any array, sorted or not, but does no better than checking every element.',
  timeComplexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
  spaceComplexity: 'O(1)',
  requiresSorted: false,
  pseudocode,
  run,
}
