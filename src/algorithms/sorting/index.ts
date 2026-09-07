import { bubbleSort } from './bubbleSort'
import { selectionSort } from './selectionSort'
import { insertionSort } from './insertionSort'
import { mergeSort } from './mergeSort'
import { quickSort } from './quickSort'
import { heapSort } from './heapSort'
import type { SortAlgorithm } from '@/types/sorting'

export const sortingAlgorithms: SortAlgorithm[] = [
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
]

export const sortingAlgorithmsById: Record<string, SortAlgorithm> = Object.fromEntries(
  sortingAlgorithms.map((algo) => [algo.id, algo]),
)
