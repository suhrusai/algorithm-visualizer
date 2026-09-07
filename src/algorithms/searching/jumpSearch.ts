import type { SearchAlgorithm, SearchStep } from '@/types/searching'

const pseudocode = [
  'procedure jumpSearch(A, n, target)',
  '  step ← ⌊√n⌋; prev ← 0',
  '  while A[min(step, n) - 1] < target',
  '    prev ← step; step ← step + ⌊√n⌋',
  '    if prev ≥ n: return NOT_FOUND',
  '  while A[prev] < target',
  '    prev ← prev + 1',
  '    if prev = min(step, n): return NOT_FOUND',
  '  if A[prev] = target: return prev',
  '  return NOT_FOUND',
]

function run(input: number[], target: number): SearchStep[] {
  const a = [...input]
  const n = a.length
  const steps: SearchStep[] = []
  const eliminated: number[] = []
  const jump = Math.max(1, Math.floor(Math.sqrt(n)))

  steps.push({ array: a, target, line: 1, message: `Block size is ⌊√${n}⌋ = ${jump}.` })

  let prev = 0
  let step = jump

  while (prev < n && a[Math.min(step, n) - 1] < target) {
    steps.push({
      array: a,
      target,
      lo: prev,
      hi: Math.min(step, n) - 1,
      probe: Math.min(step, n) - 1,
      eliminated: [...eliminated],
      line: 2,
      message: `Block ends at A[${Math.min(step, n) - 1}] = ${a[Math.min(step, n) - 1]} < ${target}. Jump ahead.`,
    })
    for (let k = prev; k < Math.min(step, n); k++) eliminated.push(k)
    prev = step
    step += jump
    if (prev >= n) {
      steps.push({ array: a, target, eliminated: [...eliminated], done: true, line: 4, message: `Jumped past the end. ${target} is not present.` })
      return steps
    }
  }

  steps.push({
    array: a,
    target,
    lo: prev,
    hi: Math.min(step, n) - 1,
    eliminated: [...eliminated],
    line: 5,
    message: `Target must be in block [${prev}, ${Math.min(step, n) - 1}]. Scan it linearly.`,
  })

  for (let i = prev; i < Math.min(step, n); i++) {
    steps.push({
      array: a,
      target,
      lo: prev,
      hi: Math.min(step, n) - 1,
      probe: i,
      eliminated: [...eliminated],
      line: 6,
      message: `Is A[${i}] = ${a[i]} equal to ${target}?`,
    })
    if (a[i] === target) {
      steps.push({ array: a, target, found: i, eliminated: [...eliminated], done: true, line: 8, message: `Found ${target} at index ${i}.` })
      return steps
    }
    if (a[i] > target) break
    eliminated.push(i)
  }

  steps.push({ array: a, target, eliminated: [...eliminated], done: true, line: 9, message: `${target} is not in the array.` })
  return steps
}

export const jumpSearch: SearchAlgorithm = {
  id: 'jump-search',
  name: 'Jump Search',
  description:
    'Jumps ahead by fixed blocks of √n elements until it overshoots the target, then walks back through the last block linearly. A middle ground between linear and binary search on sorted data.',
  timeComplexity: { best: 'O(1)', average: 'O(√n)', worst: 'O(√n)' },
  spaceComplexity: 'O(1)',
  requiresSorted: true,
  pseudocode,
  run,
}
