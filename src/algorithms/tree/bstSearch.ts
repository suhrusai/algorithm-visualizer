import type { TreeAlgorithm, TreeStep } from '@/types/tree'
import { buildBst, layoutBst, type BstNode } from './bst'

const pseudocode = [
  'procedure search(root, target)',
  '  node ← root',
  '  while node ≠ null',
  '    if target = node.value',
  '      return node',
  '    else if target < node.value',
  '      node ← node.left',
  '    else',
  '      node ← node.right',
  '  return NOT_FOUND',
]

function run(values: number[], target: number): TreeStep[] {
  const tree = buildBst(values)
  const snapshot = layoutBst(tree)
  const steps: TreeStep[] = []
  const path: number[] = []

  steps.push({ snapshot, line: 1, message: `Search for ${target}, starting at the root.` })

  let node: BstNode | null = tree.root
  while (node !== null) {
    path.push(node.id)
    steps.push({
      snapshot,
      current: node.id,
      path: [...path],
      line: 3,
      message: `Compare ${target} with ${node.value}.`,
    })

    if (target === node.value) {
      steps.push({
        snapshot,
        current: node.id,
        path: [...path],
        line: 4,
        message: `${target} = ${node.value} — found it.`,
      })
      return steps
    }

    if (target < node.value) {
      steps.push({
        snapshot,
        current: node.id,
        path: [...path],
        line: 5,
        message: `${target} < ${node.value} — go left.`,
      })
      node = node.left
    } else {
      steps.push({
        snapshot,
        current: node.id,
        path: [...path],
        line: 7,
        message: `${target} > ${node.value} — go right.`,
      })
      node = node.right
    }
  }

  steps.push({
    snapshot,
    path: [...path],
    line: 9,
    message: `Walked off the tree. ${target} is not present.`,
  })
  return steps
}

export const bstSearch: TreeAlgorithm = {
  id: 'bst-search',
  name: 'BST Search',
  description:
    'Looks up a value by walking down from the root, going left when the target is smaller and right when it is larger. Each comparison discards one whole subtree.',
  timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(n)' },
  spaceComplexity: 'O(1)',
  buildsTree: false,
  pseudocode,
  run,
}
