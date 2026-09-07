import { describe, expect, it } from 'vitest'
import { dpAlgorithmsById } from './index'

const answer = (id: string, values: Record<string, string>) => dpAlgorithmsById[id].run(values).at(-1)!.result

describe('dynamic programming answers', () => {
  it('LCS', () => {
    expect(answer('lcs', { a: 'AGCAT', b: 'GAC' })).toContain('length 2')
    expect(answer('lcs', { a: 'ABCBDAB', b: 'BDCAB' })).toContain('length 4')
  })

  it('edit distance', () => {
    expect(answer('edit-distance', { a: 'kitten', b: 'sitting' })).toBe('Edit distance = 3')
    expect(answer('edit-distance', { a: 'abc', b: 'abc' })).toBe('Edit distance = 0')
  })

  it('0/1 knapsack', () => {
    expect(answer('knapsack', { weights: '2,3,4,5', values: '3,4,5,6', capacity: '8' })).toContain('10')
    expect(answer('knapsack', { weights: '1,2,3', values: '6,10,12', capacity: '5' })).toContain('22')
  })

  it('coin change', () => {
    expect(answer('coin-change', { coins: '1,3,4', amount: '6' })).toContain('2 coins')
    expect(answer('coin-change', { coins: '2', amount: '3' })).toBe('Impossible')
  })

  it('LIS', () => {
    expect(answer('lis', { nums: '10,9,2,5,3,7,101,18' })).toContain('length 4')
    expect(answer('lis', { nums: '7,7,7,7' })).toContain('length 1')
  })
})
