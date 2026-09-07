import { describe, expect, it } from 'vitest'
import { stringAlgorithms } from './index'

function bruteOffsets(text: string, pat: string): number[] {
  const out: number[] = []
  for (let i = 0; i + pat.length <= text.length; i++) {
    if (text.slice(i, i + pat.length) === pat) out.push(i)
  }
  return out
}

const cases: [string, string][] = [
  ['ABABDABACDABABCABAB', 'ABABCABAB'],
  ['AAAAAA', 'AA'],
  ['ABCDABCDABCD', 'ABCD'],
  ['NEEDLE IN HAYSTACK', 'XYZ'],
  ['MISSISSIPPI', 'ISSI'],
]

describe('string matching algorithms', () => {
  for (const algo of stringAlgorithms) {
    describe(algo.name, () => {
      for (const [text, pat] of cases) {
        it(`finds all occurrences of "${pat}" in "${text}"`, () => {
          const last = algo.run(text, pat).at(-1)!
          expect(last.found ?? []).toEqual(bruteOffsets(text, pat))
        })
      }
    })
  }
})
