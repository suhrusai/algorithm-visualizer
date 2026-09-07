import { linearSearch } from './linearSearch'
import { binarySearch } from './binarySearch'
import { jumpSearch } from './jumpSearch'
import { exponentialSearch } from './exponentialSearch'
import { interpolationSearch } from './interpolationSearch'
import { ternarySearch } from './ternarySearch'
import type { SearchAlgorithm } from '@/types/searching'

export const searchingAlgorithms: SearchAlgorithm[] = [
  linearSearch,
  binarySearch,
  jumpSearch,
  exponentialSearch,
  interpolationSearch,
  ternarySearch,
]

export const searchingAlgorithmsById: Record<string, SearchAlgorithm> = Object.fromEntries(
  searchingAlgorithms.map((algo) => [algo.id, algo]),
)
