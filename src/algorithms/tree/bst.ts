import type { TreeSnapshot } from '@/types/tree'

export interface BstNode {
  id: number
  value: number
  left: BstNode | null
  right: BstNode | null
}

export interface Bst {
  root: BstNode | null
  size: number
}

export function emptyBst(): Bst {
  return { root: null, size: 0 }
}

/** Insert a value, returning the new node's id (or the existing id on a duplicate). */
export function bstInsert(tree: Bst, value: number): number {
  const node: BstNode = { id: tree.size, value, left: null, right: null }
  if (tree.root === null) {
    tree.root = node
    tree.size += 1
    return node.id
  }
  let cur = tree.root
  while (true) {
    if (value === cur.value) return cur.id
    if (value < cur.value) {
      if (cur.left === null) {
        cur.left = node
        tree.size += 1
        return node.id
      }
      cur = cur.left
    } else {
      if (cur.right === null) {
        cur.right = node
        tree.size += 1
        return node.id
      }
      cur = cur.right
    }
  }
}

export function buildBst(values: number[]): Bst {
  const tree = emptyBst()
  for (const v of values) bstInsert(tree, v)
  return tree
}

/**
 * Lay the tree out on a 0–100 x-axis: x follows in-order position so nodes
 * never overlap, y follows depth.
 */
export function layoutBst(tree: Bst): TreeSnapshot {
  const nodes: TreeSnapshot['nodes'] = []
  const edges: TreeSnapshot['edges'] = []
  let order = 0
  let maxDepth = 0

  const count = countNodes(tree.root)
  const stepX = count > 0 ? 100 / (count + 1) : 50

  const walk = (node: BstNode | null, depth: number, parentId: number | null) => {
    if (node === null) return
    maxDepth = Math.max(maxDepth, depth)
    walk(node.left, depth + 1, node.id)
    order += 1
    nodes.push({
      id: node.id,
      value: node.value,
      x: order * stepX,
      y: 8 + depth * 16,
      depth,
    })
    if (parentId !== null) edges.push({ parent: parentId, child: node.id })
    walk(node.right, depth + 1, node.id)
  }

  walk(tree.root, 0, null)
  return { nodes, edges, maxDepth }
}

function countNodes(node: BstNode | null): number {
  if (node === null) return 0
  return 1 + countNodes(node.left) + countNodes(node.right)
}

/** A spread of distinct values that produces a reasonably balanced tree. */
export function randomTreeValues(count = 9): number[] {
  const pool = Array.from({ length: 99 }, (_, i) => i + 1)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, count)
}
