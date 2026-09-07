import { lcs } from './lcs'
import { editDistance } from './editDistance'
import { knapsack } from './knapsack'
import { coinChange } from './coinChange'
import { lis } from './lis'
import type { DpAlgorithm } from '@/types/dp'

export const dpAlgorithms: DpAlgorithm[] = [lcs, editDistance, knapsack, coinChange, lis]

export const dpAlgorithmsById: Record<string, DpAlgorithm> = Object.fromEntries(
  dpAlgorithms.map((a) => [a.id, a]),
)
