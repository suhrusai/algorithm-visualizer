import type { SortAlgorithm, SortStep } from '@/types/sorting'

const pseudocode = [
  'procedure shellSort(A, n)',
  '  for gap = n/2; gap > 0; gap /= 2',
  '    for i from gap to n - 1',
  '      temp ← A[i]; j ← i',
  '      while j ≥ gap and A[j - gap] > temp',
  '        A[j] ← A[j - gap]; j ← j - gap',
  '      A[j] ← temp',
  '  return A',
]

function run(input: number[]): SortStep[] {
  const a = [...input]
  const n = a.length
  const steps: SortStep[] = []

  steps.push({ array: [...a], line: 0, message: 'Shell sort: gapped insertion sort with a shrinking gap.' })

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    steps.push({ array: [...a], line: 1, message: `New gap = ${gap}. Elements ${gap} apart form the sub-sequences being insertion-sorted.` })
    for (let i = gap; i < n; i++) {
      const temp = a[i]
      let j = i
      steps.push({ array: [...a], active: [i], line: 3, message: `Take A[${i}] = ${temp} and slide it back through its gap-${gap} sub-sequence.` })
      while (j >= gap && a[j - gap] > temp) {
        steps.push({ array: [...a], comparing: [j - gap, j], line: 4, message: `A[${j - gap}] = ${a[j - gap]} > ${temp} — shift it forward by ${gap}.` })
        a[j] = a[j - gap]
        steps.push({ array: [...a], swapping: [j], line: 5, message: `A[${j}] ← ${a[j]}.` })
        j -= gap
      }
      a[j] = temp
      steps.push({ array: [...a], swapping: [j], line: 6, message: `Place ${temp} at index ${j}.` })
    }
  }

  steps.push({ array: [...a], sorted: a.map((_, i) => i), line: 7, message: 'Gap reached 0 — array is fully sorted.' })
  return steps
}

export const shellSort: SortAlgorithm = {
  id: 'shell-sort',
  name: 'Shell Sort',
  description:
    'Insertion sort generalised: first sort elements far apart (large gap), then progressively smaller gaps. Early passes move elements a long way cheaply, so the final gap-1 pass has little left to do.',
  timeComplexity: { best: 'O(n log n)', average: 'O(n^1.25)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  stable: false,
  pseudocode,
  run,
}
