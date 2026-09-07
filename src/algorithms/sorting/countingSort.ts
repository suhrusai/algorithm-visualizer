import type { SortAlgorithm, SortStep } from '@/types/sorting'

const pseudocode = [
  'procedure countingSort(A, n)',
  '  k ← max(A)',
  '  count ← array of k + 1 zeros',
  '  for x in A: count[x] += 1',
  '  for v from 1 to k: count[v] += count[v - 1]   // prefix sums',
  '  for i from n - 1 down to 0                     // stable',
  '    out[--count[A[i]]] ← A[i]',
  '  return out',
]

function run(input: number[]): SortStep[] {
  const a = [...input]
  const n = a.length
  const steps: SortStep[] = []
  if (n === 0) return [{ array: [], line: 0, message: 'Empty array.' }]

  const k = Math.max(...a)
  steps.push({ array: [...a], line: 1, message: `Values range up to ${k}. Use a count array of size ${k + 1}.` })

  const count = new Array<number>(k + 1).fill(0)
  for (let i = 0; i < n; i++) {
    count[a[i]]++
    steps.push({ array: [...a], comparing: [i], line: 3, message: `Tally A[${i}] = ${a[i]} → count[${a[i]}] = ${count[a[i]]}.` })
  }

  for (let v = 1; v <= k; v++) count[v] += count[v - 1]
  steps.push({ array: [...a], line: 4, message: `Prefix-sum the counts so count[v] is the last output index for value v.` })

  const out = a.slice()
  for (let i = n - 1; i >= 0; i--) {
    const pos = --count[a[i]]
    out[pos] = a[i]
    steps.push({
      array: out.slice(),
      comparing: [i],
      swapping: [pos],
      line: 6,
      message: `Place A[${i}] = ${a[i]} at output index ${pos} (then decrement count[${a[i]}]).`,
    })
  }

  steps.push({ array: [...out], sorted: out.map((_, i) => i), line: 7, message: 'Every element placed — array is sorted, and stable.' })
  return steps
}

export const countingSort: SortAlgorithm = {
  id: 'counting-sort',
  name: 'Counting Sort',
  description:
    'A non-comparison sort for small integer keys: count how many of each value there are, prefix-sum the counts to get final positions, then place each element from right to left for stability. O(n + k) — beats O(n log n) when the value range k is small.',
  timeComplexity: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)' },
  spaceComplexity: 'O(n + k)',
  stable: true,
  pseudocode,
  run,
}
