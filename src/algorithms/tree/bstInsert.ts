import type { TreeAlgorithm, TreeStep } from '@/types/tree'
import { emptyBst, layoutBst, type BstNode } from './bst'

const pseudocode = [
  'procedure insert(root, value)',
  '  if root = null',
  '    return new Node(value)',
  '  node ← root',
  '  loop',
  '    if value < node.value',
  '      if node.left = null: node.left ← new Node(value); return',
  '      node ← node.left',
  '    else if value > node.value',
  '      if node.right = null: node.right ← new Node(value); return',
  '      node ← node.right',
  '    else',
  '      return   // duplicate, ignore',
]

function run(values: number[], _target: number): TreeStep[] {
  const tree = emptyBst()
  const steps: TreeStep[] = []
  let nextId = 0

  for (const value of values) {
    const path: number[] = []

    if (tree.root === null) {
      tree.root = { id: nextId++, value, left: null, right: null }
      tree.size += 1
      steps.push({
        snapshot: layoutBst(tree),
        current: tree.root.id,
        path: [tree.root.id],
        line: 2,
        message: `Tree is empty — ${value} becomes the root.`,
      })
      continue
    }

    let node: BstNode = tree.root
    while (true) {
      path.push(node.id)
      steps.push({
        snapshot: layoutBst(tree),
        current: node.id,
        path: [...path],
        line: 4,
        message: `Insert ${value}: compare with ${node.value}.`,
      })

      if (value < node.value) {
        if (node.left === null) {
          node.left = { id: nextId++, value, left: null, right: null }
          tree.size += 1
          path.push(node.left.id)
          steps.push({
            snapshot: layoutBst(tree),
            current: node.left.id,
            path: [...path],
            line: 6,
            message: `${value} < ${node.value} and left is empty — attach ${value} as the left child.`,
          })
          break
        }
        node = node.left
      } else if (value > node.value) {
        if (node.right === null) {
          node.right = { id: nextId++, value, left: null, right: null }
          tree.size += 1
          path.push(node.right.id)
          steps.push({
            snapshot: layoutBst(tree),
            current: node.right.id,
            path: [...path],
            line: 9,
            message: `${value} > ${node.value} and right is empty — attach ${value} as the right child.`,
          })
          break
        }
        node = node.right
      } else {
        steps.push({
          snapshot: layoutBst(tree),
          current: node.id,
          path: [...path],
          line: 12,
          message: `${value} is already in the tree — ignore the duplicate.`,
        })
        break
      }
    }
  }

  steps.push({
    snapshot: layoutBst(tree),
    line: 0,
    message: `All ${values.length} values inserted. The BST keeps left < node < right everywhere.`,
  })
  return steps
}

export const bstInsertion: TreeAlgorithm = {
  id: 'bst-insert',
  name: 'BST Insertion',
  description:
    'Builds a binary search tree one value at a time. Each new value walks down from the root, going left when it is smaller and right when it is larger, until it finds an empty spot.',
  timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
  spaceComplexity: 'O(1)',
  buildsTree: true,
  pseudocode,
  run,
}
