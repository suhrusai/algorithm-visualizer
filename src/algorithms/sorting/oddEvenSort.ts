import type { SortAlgorithm, SortStep } from '@/types/sorting'

const pseudocode = [
  'procedure oddEvenSort(A, n)',
  '  sorted ← false',
  '  while not sorted',
  '    sorted ← true',
  '    even pass: compare (A[0],A[1]), (A[2],A[3]), …',
  '      if out of order: swap; sorted ← false',
  '    odd pass: compare (A[1],A[2]), (A[3],A[4]), …',
  '      if out of order: swap; sorted ← false',
]

function run(input: number[]): SortStep[] {
  const a = [...input]
  const n = a.length
  const steps: SortStep[] = []

  steps.push({ array: [...a], line: 0, message: 'Odd–even sort: alternate passes comparing (odd, even) then (even, odd) neighbour pairs.' })

  let sorted = false
  while (!sorted) {
    sorted = true

    for (const [start, line] of [[1, 4], [2, 6]] as const) {
      steps.push({
        array: [...a],
        line,
        message: start === 1 ? 'Even pass: compare pairs (0,1), (2,3), (4,5), …' : 'Odd pass: compare pairs (1,2), (3,4), (5,6), …',
      })
      for (let i = start; i < n; i += 2) {
        steps.push({ array: [...a], comparing: [i - 1, i], line: line + 1, message: `Compare A[${i - 1}] = ${a[i - 1]} and A[${i}] = ${a[i]}.` })
        if (a[i - 1] > a[i]) {
          ;[a[i - 1], a[i]] = [a[i], a[i - 1]]
          sorted = false
          steps.push({ array: [...a], swapping: [i - 1, i], line: line + 1, message: 'Out of order — swap.' })
        }
      }
    }
  }

  steps.push({ array: [...a], sorted: a.map((_, k) => k), line: 2, message: 'A full odd and even pass with no swaps — the array is sorted.' })
  return steps
}

export const oddEvenSort: SortAlgorithm = {
  id: 'odd-even-sort',
  name: 'Odd–Even Sort',
  description:
    'A parallel-friendly bubble sort variant. Odd passes compare and swap the (1,2), (3,4), … neighbour pairs; even passes handle (0,1), (2,3), …. Because the pairs within a pass never overlap, every comparison in that pass is independent and could run at the same time.',
  timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: true,
  pseudocode,
  run,
}
