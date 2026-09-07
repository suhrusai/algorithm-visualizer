import type { SortAlgorithm, SortStep } from '@/types/sorting'

const pseudocode = [
  'procedure radixSortLSD(A, n)',
  '  maxDigits ← number of digits in max(A)',
  '  for d from 0 to maxDigits - 1        // least significant first',
  '    count ← array of 10 zeros',
  '    for x in A: count[digit(x, d)] += 1',
  '    prefix-sum count                    // → end positions',
  '    for i from n - 1 down to 0          // stable placement',
  '      out[--count[digit(A[i], d)]] ← A[i]',
  '    A ← out',
]

const digit = (x: number, d: number) => Math.floor(Math.abs(x) / 10 ** d) % 10

function run(input: number[]): SortStep[] {
  const a = [...input]
  const n = a.length
  const steps: SortStep[] = []
  if (n === 0) return [{ array: [], line: 0, message: 'Empty array.' }]

  const max = Math.max(...a)
  const passes = String(max).length
  steps.push({ array: [...a], line: 1, message: `Largest value ${max} has ${passes} digit(s) → ${passes} pass(es), least-significant digit first.` })

  for (let d = 0; d < passes; d++) {
    const place = 10 ** d
    steps.push({ array: [...a], line: 2, message: `Pass ${d + 1}: sort by the ${place === 1 ? 'ones' : place === 10 ? 'tens' : `10^${d}`} digit (a stable counting sort).` })

    const count = new Array<number>(10).fill(0)
    for (const x of a) count[digit(x, d)]++
    steps.push({ array: [...a], line: 4, message: `Bucket counts for this digit: [${count.join(', ')}].` })
    for (let k = 1; k < 10; k++) count[k] += count[k - 1]

    const out = a.slice()
    for (let i = n - 1; i >= 0; i--) {
      const g = digit(a[i], d)
      const pos = --count[g]
      out[pos] = a[i]
      steps.push({
        array: out.slice(),
        comparing: [i],
        swapping: [pos],
        line: 7,
        message: `A[${i}] = ${a[i]} → digit ${g} → next free slot for that bucket is index ${pos}.`,
      })
    }
    for (let i = 0; i < n; i++) a[i] = out[i]
    steps.push({ array: [...a], line: 8, message: `Pass ${d + 1} done — array is now sorted by its last ${d + 1} digit(s).` })
  }

  steps.push({ array: [...a], sorted: a.map((_, i) => i), line: 0, message: 'All digit passes complete — array is fully sorted.' })
  return steps
}

export const radixSort: SortAlgorithm = {
  id: 'radix-sort',
  name: 'Radix Sort (LSD)',
  description:
    'A non-comparison sort: stably sort the numbers by their least-significant digit, then the next digit, and so on. After the most-significant digit pass the whole array is ordered. Linear in n when the number of digits is fixed.',
  timeComplexity: { best: 'O(d·n)', average: 'O(d·n)', worst: 'O(d·n)' },
  spaceComplexity: 'O(n + b)',
  stable: true,
  pseudocode,
  run,
}
