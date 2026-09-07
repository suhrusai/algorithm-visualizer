import { bstInsertion } from './bstInsert'
import { bstSearch } from './bstSearch'
import { inorderTraversal, preorderTraversal, postorderTraversal, levelOrderTraversal } from './traversals'
import type { TreeAlgorithm } from '@/types/tree'

export { randomTreeValues } from './bst'

export const treeAlgorithms: TreeAlgorithm[] = [
  bstInsertion,
  bstSearch,
  inorderTraversal,
  preorderTraversal,
  postorderTraversal,
  levelOrderTraversal,
]

export const treeAlgorithmsById: Record<string, TreeAlgorithm> = Object.fromEntries(
  treeAlgorithms.map((algo) => [algo.id, algo]),
)
