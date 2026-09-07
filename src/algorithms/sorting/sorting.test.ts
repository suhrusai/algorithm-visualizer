import { describe, expect, it } from 'vitest'
import { sortingAlgorithms } from './index'
import { seededArray } from '@/lib/rng'

describe('sorting algorithms', () => {
  for (const algo of sortingAlgorithms) {
    describe(algo.name, () => {
      it('produces a sorted array in the final step', () => {
        for (const seed of [1, 42, 777]) {
          const input = seededArray(seed, 25)
          const steps = algo.run(input)
          const last = steps[steps.length - 1]
          const expected = [...input].sort((a, b) => a - b)
          expect(last.array).toEqual(expected)
        }
      })

      it('never mutates the caller\'s array', () => {
        const input = seededArray(3, 15)
        const copy = [...input]
        algo.run(input)
        expect(input).toEqual(copy)
      })

      it('keeps the array length constant and highlights valid indices', () => {
        const input = seededArray(9, 12)
        for (const step of algo.run(input)) {
          expect(step.array).toHaveLength(input.length)
          for (const idx of [...(step.comparing ?? []), ...(step.swapping ?? []), ...(step.sorted ?? [])]) {
            expect(idx).toBeGreaterThanOrEqual(0)
            expect(idx).toBeLessThan(input.length)
          }
        }
      })

      it('references a real pseudocode line at every step', () => {
        for (const step of algo.run(seededArray(5, 10))) {
          expect(step.line).toBeGreaterThanOrEqual(0)
          expect(step.line).toBeLessThan(algo.pseudocode.length)
        }
      })

      it('handles trivial inputs', () => {
        expect(algo.run([]).at(-1)!.array).toEqual([])
        expect(algo.run([7]).at(-1)!.array).toEqual([7])
        expect(algo.run([2, 1]).at(-1)!.array).toEqual([1, 2])
      })
    })
  }
})
