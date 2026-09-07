import type { TreeAlgorithm, TreeStep } from '@/types/tree'
import { buildBst, layoutBst, type BstNode } from './bst'

type Order = 'in' | 'pre' | 'post'

const dfsPseudocode: Record<Order, string[]> = {
  in: [
    'procedure inorder(node, visit)',
    '  if node = null: return',
    '  inorder(node.left, visit)',
    '  visit(node)',
    '  inorder(node.right, visit)',
  ],
  pre: [
    'procedure preorder(node, visit)',
    '  if node = null: return',
    '  visit(node)',
    '  preorder(node.left, visit)',
    '  preorder(node.right, visit)',
  ],
  post: [
    'procedure postorder(node, visit)',
    '  if node = null: return',
    '  postorder(node.left, visit)',
    '  postorder(node.right, visit)',
    '  visit(node)',
  ],
}

function makeDfsTraversal(order: Order, meta: Omit<TreeAlgorithm, 'pseudocode' | 'run' | 'buildsTree'>): TreeAlgorithm {
  const visitLine = order === 'pre' ? 2 : order === 'in' ? 3 : 4

  function run(values: number[]): TreeStep[] {
    const tree = buildBst(values)
    const snapshot = layoutBst(tree)
    const steps: TreeStep[] = []
    const output: number[] = []
    const visited: number[] = []

    steps.push({ snapshot, output: [], visited: [], line: 0, message: `Start the ${meta.name.toLowerCase()}.` })

    const walk = (node: BstNode | null, path: number[]) => {
      if (node === null) return
      const here = [...path, node.id]

      steps.push({
        snapshot,
        current: node.id,
        path: here,
        output: [...output],
        visited: [...visited],
        line: 1,
        message: `Enter ${node.value}.`,
      })

      if (order === 'pre') {
        output.push(node.value)
        visited.push(node.id)
        steps.push({ snapshot, current: node.id, path: here, output: [...output], visited: [...visited], line: visitLine, message: `Visit ${node.value} → output.` })
      }

      walk(node.left, here)

      if (order === 'in') {
        output.push(node.value)
        visited.push(node.id)
        steps.push({ snapshot, current: node.id, path: here, output: [...output], visited: [...visited], line: visitLine, message: `Visit ${node.value} → output.` })
      }

      walk(node.right, here)

      if (order === 'post') {
        output.push(node.value)
        visited.push(node.id)
        steps.push({ snapshot, current: node.id, path: here, output: [...output], visited: [...visited], line: visitLine, message: `Visit ${node.value} → output.` })
      }
    }

    walk(tree.root, [])

    steps.push({
      snapshot,
      output: [...output],
      visited: [...visited],
      line: 0,
      message: `Done. ${meta.name}: [ ${output.join(', ')} ]`,
    })
    return steps
  }

  return { ...meta, buildsTree: false, pseudocode: dfsPseudocode[order], run }
}

export const inorderTraversal = makeDfsTraversal('in', {
  id: 'inorder',
  name: 'In-order Traversal',
  description:
    'Recursively visits the left subtree, then the node, then the right subtree. On a binary search tree this emits the values in sorted order.',
  timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
  spaceComplexity: 'O(h)',
})

export const preorderTraversal = makeDfsTraversal('pre', {
  id: 'preorder',
  name: 'Pre-order Traversal',
  description:
    'Visits the node before its subtrees (node, left, right). Useful for copying a tree or serializing its structure.',
  timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
  spaceComplexity: 'O(h)',
})

export const postorderTraversal = makeDfsTraversal('post', {
  id: 'postorder',
  name: 'Post-order Traversal',
  description:
    'Visits both subtrees before the node (left, right, node). Useful for deleting a tree or evaluating an expression tree bottom-up.',
  timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
  spaceComplexity: 'O(h)',
})

const levelOrderPseudocode = [
  'procedure levelOrder(root)',
  '  queue ← [root]',
  '  while queue not empty',
  '    node ← queue.dequeue()',
  '    visit(node)',
  '    if node.left ≠ null: queue.enqueue(node.left)',
  '    if node.right ≠ null: queue.enqueue(node.right)',
]

function levelOrderRun(values: number[]): TreeStep[] {
  const tree = buildBst(values)
  const snapshot = layoutBst(tree)
  const steps: TreeStep[] = []
  const output: number[] = []
  const visited: number[] = []
  const byId = new Map(snapshot.nodes.map((n) => [n.id, n]))

  if (tree.root === null) return [{ snapshot, line: 0, message: 'The tree is empty.' }]

  const queue: BstNode[] = [tree.root]
  steps.push({ snapshot, output: [], visited: [], line: 1, message: `Start with the root in the queue.` })

  while (queue.length > 0) {
    const node = queue.shift() as BstNode
    steps.push({
      snapshot,
      current: node.id,
      output: [...output],
      visited: [...visited],
      line: 3,
      message: `Dequeue ${node.value} (level ${byId.get(node.id)?.depth ?? 0}).`,
    })
    output.push(node.value)
    visited.push(node.id)
    steps.push({ snapshot, current: node.id, output: [...output], visited: [...visited], line: 4, message: `Visit ${node.value} → output.` })

    if (node.left) {
      queue.push(node.left)
      steps.push({ snapshot, current: node.left.id, output: [...output], visited: [...visited], line: 5, message: `Enqueue left child ${node.left.value}.` })
    }
    if (node.right) {
      queue.push(node.right)
      steps.push({ snapshot, current: node.right.id, output: [...output], visited: [...visited], line: 6, message: `Enqueue right child ${node.right.value}.` })
    }
  }

  steps.push({ snapshot, output: [...output], visited: [...visited], line: 0, message: `Done. Level-order: [ ${output.join(', ')} ]` })
  return steps
}

export const levelOrderTraversal: TreeAlgorithm = {
  id: 'level-order',
  name: 'Level-order Traversal',
  description:
    'Visits nodes level by level from the top down, using a FIFO queue — a breadth-first search of the tree.',
  timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
  spaceComplexity: 'O(n)',
  buildsTree: false,
  pseudocode: levelOrderPseudocode,
  run: levelOrderRun,
}
