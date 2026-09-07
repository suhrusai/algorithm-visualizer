import { bubbleSort } from './bubbleSort'
import { selectionSort } from './selectionSort'
import { insertionSort } from './insertionSort'
import { shellSort } from './shellSort'
import { cocktailSort } from './cocktailSort'
import { combSort } from './combSort'
import { gnomeSort } from './gnomeSort'
import { mergeSort } from './mergeSort'
import { quickSort } from './quickSort'
import { heapSort } from './heapSort'
import { countingSort } from './countingSort'
import { radixSort } from './radixSort'
import type { SortAlgorithm } from '@/types/sorting'

export const sortingAlgorithms: SortAlgorithm[] = [
  bubbleSort,
  selectionSort,
  insertionSort,
  shellSort,
  cocktailSort,
  combSort,
  gnomeSort,
  mergeSort,
  quickSort,
  heapSort,
  countingSort,
  radixSort,
]

export const sortingAlgorithmsById: Record<string, SortAlgorithm> = Object.fromEntries(
  sortingAlgorithms.map((algo) => [algo.id, algo]),
)
