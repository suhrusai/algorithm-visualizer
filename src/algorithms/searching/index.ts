import { linearSearch } from './linearSearch'
import { binarySearch } from './binarySearch'
import { jumpSearch } from './jumpSearch'
import { interpolationSearch } from './interpolationSearch'
import type { SearchAlgorithm } from '@/types/searching'

export const searchingAlgorithms: SearchAlgorithm[] = [
  linearSearch,
  binarySearch,
  jumpSearch,
  interpolationSearch,
]

export const searchingAlgorithmsById: Record<string, SearchAlgorithm> = Object.fromEntries(
  searchingAlgorithms.map((algo) => [algo.id, algo]),
)
