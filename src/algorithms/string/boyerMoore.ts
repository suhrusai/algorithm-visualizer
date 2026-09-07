import type { StringAlgorithm, StringStep, StringTable } from '@/types/stringmatch'

const pseudocode = [
  'procedure BoyerMoore(text, pat)   // bad-character rule',
  '  last ← last index of each char in pat',
  '  s ← 0',
  '  while s ≤ |text| − |pat|',
  '    j ← |pat| − 1',
  '    while j ≥ 0 and pat[j] = text[s + j]: j ← j − 1',
  '    if j < 0: report match at s;  s ← s + 1',
  '    else: s ← s + max(1, j − last[text[s + j]])',
]

function run(text: string, pat: string): StringStep[] {
  const steps: StringStep[] = []
  const n = text.length
  const m = pat.length
  if (m === 0 || m > n) return [{ offset: 0, line: 0, message: m === 0 ? 'Pattern is empty.' : 'Pattern longer than text.' }]

  const last: Record<string, number> = {}
  for (let i = 0; i < m; i++) last[pat[i]] = i
  const alphabet = [...new Set(pat.split(''))].sort()
  const lastTable: StringTable = {
    label: 'last occurrence in pattern',
    values: alphabet.map((c) => `${c}:${last[c]}`),
    under: 'pattern',
  }

  const found: number[] = []
  let s = 0
  steps.push({ offset: 0, line: 1, table: lastTable, message: `Last-occurrence table: ${alphabet.map((c) => `${c}→${last[c]}`).join(', ')}.` })

  while (s + m <= n) {
    steps.push({ offset: s, found: [...found], table: lastTable, line: 3, message: `Align at offset ${s}. Compare from the right.` })
    let j = m - 1
    const matched: number[] = []
    while (j >= 0) {
      steps.push({
        offset: s,
        textIndex: s + j,
        patIndex: j,
        matched: [...matched],
        found: [...found],
        table: lastTable,
        line: 5,
        message: `text[${s + j}]='${text[s + j]}' vs pat[${j}]='${pat[j]}'.`,
      })
      if (pat[j] !== text[s + j]) {
        const bc = last[text[s + j]] ?? -1
        const shift = Math.max(1, j - bc)
        steps.push({
          offset: s,
          textIndex: s + j,
          patIndex: j,
          matched: [...matched],
          mismatch: s + j,
          found: [...found],
          table: lastTable,
          line: 7,
          message: `Mismatch on '${text[s + j]}' (last in pattern at ${bc}). Shift by max(1, ${j} − ${bc}) = ${shift}.`,
        })
        s += shift
        break
      }
      matched.unshift(s + j)
      j--
    }
    if (j < 0) {
      found.push(s)
      steps.push({ offset: s, matched: Array.from({ length: m }, (_, k) => s + k), found: [...found], table: lastTable, line: 6, message: `Full match at offset ${s}.` })
      s += 1
    }
  }

  steps.push({ offset: Math.max(0, n - m), found: [...found], table: lastTable, line: 6, message: `Done — ${found.length} match(es): [${found.join(', ')}].` })
  return steps
}

export const boyerMoore: StringAlgorithm = {
  id: 'boyer-moore',
  name: 'Boyer–Moore (bad character)',
  description:
    'Compares the pattern right to left. On a mismatch, it uses the last-occurrence table to slide the pattern so the offending text character lines up with its rightmost copy in the pattern — often skipping many positions at once.',
  timeComplexity: 'O(n/m) best, O(n·m) worst',
  spaceComplexity: 'O(alphabet)',
  pseudocode,
  defaults: { text: 'ABAAABCDABABCABAB', pattern: 'ABABCABAB' },
  run,
}
