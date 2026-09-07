import { bubbleSort } from './bubbleSort'
import { selectionSort } from './selectionSort'
import { insertionSort } from './insertionSort'
import { shellSort } from './shellSort'
import { cocktailSort } from './cocktailSort'
import { combSort } from './combSort'
import { gnomeSort } from './gnomeSort'
import { pancakeSort } from './pancakeSort'
import { oddEvenSort } from './oddEvenSort'
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
  pancakeSort,
  oddEvenSort,
  mergeSort,
  quickSort,
  heapSort,
  countingSort,
  radixSort,
]

export const sortingAlgorithmsById: Record<string, SortAlgorithm> = Object.fromEntries(
  sortingAlgorithms.map((algo) => [algo.id, algo]),
)
