import { describe, expect, it } from 'vitest'
import { buildBst, inorderValues, height, type Bst, type BstNode } from './bst'
import { insertOp, deleteOp, searchOp, balanceOp } from './bstOps'

function isValidBst(node: BstNode | null, lo = -Infinity, hi = Infinity): boolean {
  if (!node) return true
  if (node.value <= lo || node.value >= hi) return false
  return isValidBst(node.left, lo, node.value) && isValidBst(node.right, node.value, hi)
}

const sorted = (t: Bst) => inorderValues(t)

describe('BST operations', () => {
  it('buildBst keeps the search-tree invariant and sorts in-order', () => {
    const t = buildBst([50, 30, 70, 20, 40, 60, 80, 35, 65])
    expect(isValidBst(t.root)).toBe(true)
    expect(sorted(t)).toEqual([20, 30, 35, 40, 50, 60, 65, 70, 80])
  })

  it('insert adds the value and stays valid', () => {
    const { tree } = insertOp(buildBst([50, 30, 70]), 45)
    expect(isValidBst(tree.root)).toBe(true)
    expect(sorted(tree)).toEqual([30, 45, 50, 70])
  })

  it('delete handles leaf, one-child, and two-children cases', () => {
    const base = buildBst([50, 30, 70, 20, 40, 60, 80, 35, 65])
    for (const v of [20, 30, 70, 50]) {
      const { tree } = deleteOp(base, v)
      expect(isValidBst(tree.root)).toBe(true)
      expect(sorted(tree)).toEqual(sorted(base).filter((x) => x !== v))
    }
  })

  it('search reports found / not-found correctly', () => {
    const t = buildBst([50, 30, 70, 20])
    expect(searchOp(t, 20).summary).toMatch(/Found 20/)
    expect(searchOp(t, 99).summary).toMatch(/not found/)
  })

  it('balance keeps the same values but reduces height', () => {
    const skewed = buildBst([10, 20, 30, 40, 50, 60, 70])
    const { tree } = balanceOp(skewed)
    expect(isValidBst(tree.root)).toBe(true)
    expect(sorted(tree)).toEqual([10, 20, 30, 40, 50, 60, 70])
    expect(height(tree.root)).toBeLessThan(height(skewed.root))
    expect(height(tree.root)).toBe(3)
  })
})
