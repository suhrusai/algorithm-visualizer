import { describe, expect, it } from 'vitest'
import { searchingAlgorithms } from './index'

const sorted = [3, 8, 12, 19, 25, 31, 44, 50, 67, 71, 88, 91]

describe('searching algorithms', () => {
  for (const algo of searchingAlgorithms) {
    describe(algo.name, () => {
      it('finds a value that is present', () => {
        for (const target of [3, 31, 91, 44]) {
          const last = algo.run(sorted, target).at(-1)!
          expect(last.found).toBe(sorted.indexOf(target))
        }
      })

      it('reports not-found for an absent value', () => {
        const last = algo.run(sorted, 40).at(-1)!
        expect(last.found).toBeUndefined()
        expect(last.done).toBe(true)
      })

      it('every step highlights a real pseudocode line', () => {
        for (const step of algo.run(sorted, 25)) {
          expect(step.line).toBeGreaterThanOrEqual(0)
          expect(step.line).toBeLessThan(algo.pseudocode.length)
        }
      })
    })
  }
})
