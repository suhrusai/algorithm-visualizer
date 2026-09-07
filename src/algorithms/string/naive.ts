import type { StringAlgorithm, StringStep } from '@/types/stringmatch'

const pseudocode = [
  'procedure naiveSearch(text, pat)',
  '  for s from 0 to |text| − |pat|',
  '    j ← 0',
  '    while j < |pat| and text[s + j] = pat[j]',
  '      j ← j + 1',
  '    if j = |pat|: report match at s',
]

function run(text: string, pat: string): StringStep[] {
  const steps: StringStep[] = []
  const found: number[] = []
  const n = text.length
  const m = pat.length
  if (m === 0) return [{ offset: 0, line: 0, message: 'Pattern is empty.' }]

  for (let s = 0; s + m <= n; s++) {
    const matched: number[] = []
    steps.push({ offset: s, found: [...found], line: 1, message: `Align the pattern at offset ${s}.` })
    let j = 0
    while (j < m) {
      steps.push({
        offset: s,
        textIndex: s + j,
        patIndex: j,
        matched: [...matched],
        found: [...found],
        line: 3,
        message: `text[${s + j}]='${text[s + j]}' vs pat[${j}]='${pat[j]}'.`,
      })
      if (text[s + j] !== pat[j]) {
        steps.push({
          offset: s,
          textIndex: s + j,
          patIndex: j,
          matched: [...matched],
          mismatch: s + j,
          found: [...found],
          line: 3,
          message: `Mismatch — slide the pattern one step right and restart from j = 0.`,
        })
        break
      }
      matched.push(s + j)
      j++
    }
    if (j === m) {
      found.push(s)
      steps.push({ offset: s, matched: [...matched], found: [...found], line: 5, message: `Full match at offset ${s}.` })
    }
  }

  steps.push({ offset: Math.max(0, n - m), found: [...found], line: 5, message: `Done — ${found.length} match(es): [${found.join(', ')}].` })
  return steps
}

export const naive: StringAlgorithm = {
  id: 'naive',
  name: 'Naive Search',
  description:
    'Tries the pattern at every offset, comparing left to right and bailing on the first mismatch. Simple, but re-checks characters it has already seen — O(n·m) in the worst case.',
  timeComplexity: 'O(n·m)',
  spaceComplexity: 'O(1)',
  pseudocode,
  defaults: { text: 'ABABDABACDABABCABAB', pattern: 'ABABCABAB' },
  run,
}
