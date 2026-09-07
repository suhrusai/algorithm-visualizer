import type { TreeStep } from '@/types/tree'
import { balancedFrom, cloneBst, height, inorderValues, layoutBst, type Bst, type BstNode } from './bst'

export type BstOpKind = 'insert' | 'delete' | 'search' | 'balance'

export interface BstOpResult {
  steps: TreeStep[]
  tree: Bst
  summary: string
}

export const opPseudocode: Record<BstOpKind, string[]> = {
  insert: [
    'procedure insert(root, value)',
    '  node ← root',
    '  loop',
    '    if value < node.value',
    '      if node.left = null: node.left ← Node(value); return',
    '      node ← node.left',
    '    else if value > node.value',
    '      if node.right = null: node.right ← Node(value); return',
    '      node ← node.right',
    '    else: return   // duplicate',
  ],
  search: [
    'procedure search(root, target)',
    '  node ← root',
    '  while node ≠ null',
    '    if target = node.value: return node',
    '    else if target < node.value: node ← node.left',
    '    else: node ← node.right',
    '  return NOT_FOUND',
  ],
  delete: [
    'procedure delete(root, value)',
    '  find the node with that value',
    '  case: node is a leaf → detach it',
    '  case: node has one child → splice the child in',
    '  case: node has two children',
    '    successor ← min(node.right)',
    '    copy successor.value into node',
    '    delete successor from node.right',
  ],
  balance: [
    'procedure balance(root)',
    '  values ← inorder(root)          // sorted',
    '  return buildBalanced(values, 0, n-1)',
    'procedure buildBalanced(values, lo, hi)',
    '  if lo > hi: return null',
    '  mid ← (lo + hi) / 2',
    '  node ← Node(values[mid])',
    '  node.left  ← buildBalanced(values, lo, mid-1)',
    '  node.right ← buildBalanced(values, mid+1, hi)',
  ],
}

function step(tree: Bst, extra: Partial<TreeStep> & { line: number; message: string }): TreeStep {
  return { snapshot: layoutBst(tree), ...extra }
}

export function insertOp(base: Bst, value: number): BstOpResult {
  const tree = cloneBst(base)
  const steps: TreeStep[] = []
  const path: number[] = []

  if (tree.root === null) {
    tree.root = { id: tree.nextId++, value, left: null, right: null }
    tree.size += 1
    steps.push(step(tree, { current: tree.root.id, path: [tree.root.id], line: 1, message: `Tree was empty — ${value} is the new root.` }))
    return { steps, tree, summary: `Inserted ${value} as root` }
  }

  let node: BstNode = tree.root
  while (true) {
    path.push(node.id)
    steps.push(step(tree, { current: node.id, path: [...path], line: 2, message: `Compare ${value} with ${node.value}.` }))
    if (value < node.value) {
      if (node.left === null) {
        node.left = { id: tree.nextId++, value, left: null, right: null }
        tree.size += 1
        path.push(node.left.id)
        steps.push(step(tree, { current: node.left.id, path: [...path], line: 4, message: `${value} < ${node.value}, left is empty — attach here.` }))
        return { steps, tree, summary: `Inserted ${value}` }
      }
      node = node.left
    } else if (value > node.value) {
      if (node.right === null) {
        node.right = { id: tree.nextId++, value, left: null, right: null }
        tree.size += 1
        path.push(node.right.id)
        steps.push(step(tree, { current: node.right.id, path: [...path], line: 7, message: `${value} > ${node.value}, right is empty — attach here.` }))
        return { steps, tree, summary: `Inserted ${value}` }
      }
      node = node.right
    } else {
      steps.push(step(tree, { current: node.id, path: [...path], line: 9, message: `${value} is already in the tree — nothing to do.` }))
      return { steps, tree, summary: `${value} already present` }
    }
  }
}

export function searchOp(base: Bst, value: number): BstOpResult {
  const tree = cloneBst(base)
  const steps: TreeStep[] = []
  const path: number[] = []
  let node = tree.root

  steps.push(step(tree, { line: 1, message: `Search for ${value} from the root.` }))
  while (node !== null) {
    path.push(node.id)
    steps.push(step(tree, { current: node.id, path: [...path], line: 2, message: `Compare ${value} with ${node.value}.` }))
    if (node.value === value) {
      steps.push(step(tree, { current: node.id, path: [...path], visited: [node.id], line: 3, message: `Found ${value}.` }))
      return { steps, tree, summary: `Found ${value}` }
    }
    if (value < node.value) {
      steps.push(step(tree, { current: node.id, path: [...path], line: 4, message: `${value} < ${node.value} — go left.` }))
      node = node.left
    } else {
      steps.push(step(tree, { current: node.id, path: [...path], line: 5, message: `${value} > ${node.value} — go right.` }))
      node = node.right
    }
  }
  steps.push(step(tree, { path: [...path], line: 6, message: `${value} is not in the tree.` }))
  return { steps, tree, summary: `${value} not found` }
}

export function deleteOp(base: Bst, value: number): BstOpResult {
  const tree = cloneBst(base)
  const steps: TreeStep[] = []

  steps.push(step(tree, { line: 1, message: `Delete ${value}: first locate it.` }))

  // Locate node and its parent.
  let parent: BstNode | null = null
  let node = tree.root
  const path: number[] = []
  while (node !== null && node.value !== value) {
    path.push(node.id)
    parent = node
    node = value < node.value ? node.left : node.right
  }

  if (node === null) {
    steps.push(step(tree, { path, line: 1, message: `${value} is not in the tree — nothing to delete.` }))
    return { steps, tree, summary: `${value} not found` }
  }
  path.push(node.id)
  steps.push(step(tree, { current: node.id, path: [...path], line: 1, message: `Found ${value}.` }))

  const attach = (p: BstNode | null, oldChild: BstNode, sub: BstNode | null) => {
    if (p === null) tree.root = sub
    else if (p.left === oldChild) p.left = sub
    else p.right = sub
  }

  if (node.left === null || node.right === null) {
    const child = node.left ?? node.right
    attach(parent, node, child)
    tree.size -= 1
    if (child === null) {
      steps.push(step(tree, { path: path.slice(0, -1), line: 2, message: `${value} is a leaf — detach it.` }))
    } else {
      steps.push(step(tree, { current: child.id, line: 3, message: `${value} has one child — splice ${child.value} into its place.` }))
    }
    return { steps, tree, summary: `Deleted ${value}` }
  }

  // Two children: replace with in-order successor (leftmost of right subtree).
  let succParent = node
  let succ = node.right
  while (succ.left !== null) {
    succParent = succ
    succ = succ.left
  }
  steps.push(step(tree, { current: succ.id, line: 5, message: `Two children — in-order successor is ${succ.value} (leftmost of the right subtree).` }))
  node.value = succ.value
  steps.push(step(tree, { current: node.id, path: [...path], line: 6, message: `Copy ${succ.value} up into the node being deleted.` }))
  if (succParent.left === succ) succParent.left = succ.right
  else succParent.right = succ.right
  tree.size -= 1
  steps.push(step(tree, { current: node.id, path: [...path], line: 7, message: `Remove the old successor node.` }))

  return { steps, tree, summary: `Deleted ${value}` }
}

export function balanceOp(base: Bst): BstOpResult {
  const values = inorderValues(base)
  const steps: TreeStep[] = []
  steps.push(step(base, { line: 1, message: `In-order values (already sorted): [ ${values.join(', ')} ].` }))

  const balanced = balancedFrom(values, base.nextId)
  steps.push(step(balanced, {
    line: 3,
    message: `Rebuild by always making the middle value the subtree root. New height ${height(balanced.root)} (was ${height(base.root)}).`,
  }))
  return { steps, tree: balanced, summary: 'Rebalanced' }
}
