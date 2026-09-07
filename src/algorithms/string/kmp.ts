import type { StringAlgorithm, StringStep, StringTable } from '@/types/stringmatch'

const pseudocode = [
  'procedure KMP(text, pat)',
  '  lps ← buildLPS(pat)          // longest proper prefix = suffix',
  '  i ← 0; j ← 0',
  '  while i < |text|',
  '    if text[i] = pat[j]: i++; j++',
  '      if j = |pat|: report i − j; j ← lps[j − 1]',
  '    else if j > 0: j ← lps[j − 1]   // reuse the border, don’t move i',
  '    else: i++',
]

function buildLPS(pat: string, steps: StringStep[]): number[] {
  const m = pat.length
  const lps = new Array<number>(m).fill(0)
  let len = 0
  let i = 1
  const table = (highlight: number): StringTable => ({
    label: 'LPS (failure function)',
    values: lps.slice(),
    highlight,
    under: 'pattern',
  })
  steps.push({ offset: 0, line: 1, table: table(0), message: `Build the LPS table: lps[k] = length of the longest proper prefix of pat[0..k] that is also a suffix.` })
  while (i < m) {
    if (pat[i] === pat[len]) {
      len++
      lps[i] = len
      steps.push({ offset: 0, patIndex: i, line: 1, table: table(i), message: `pat[${i}]='${pat[i]}' = pat[${len - 1}]='${pat[len - 1]}' → lps[${i}] = ${len}.` })
      i++
    } else if (len > 0) {
      steps.push({ offset: 0, patIndex: i, line: 1, table: table(i), message: `Mismatch — fall back: len ← lps[${len - 1}] = ${lps[len - 1]}.` })
      len = lps[len - 1]
    } else {
      lps[i] = 0
      steps.push({ offset: 0, patIndex: i, line: 1, table: table(i), message: `pat[${i}] can't extend any border → lps[${i}] = 0.` })
      i++
    }
  }
  return lps
}

function run(text: string, pat: string): StringStep[] {
  const steps: StringStep[] = []
  const n = text.length
  const m = pat.length
  if (m === 0) return [{ offset: 0, line: 0, message: 'Pattern is empty.' }]

  const lps = buildLPS(pat, steps)
  const lpsTable: StringTable = { label: 'LPS (failure function)', values: lps.slice(), under: 'pattern' }
  const found: number[] = []
  let i = 0
  let j = 0
  const matchedAbs = () => Array.from({ length: j }, (_, k) => i - j + k)

  steps.push({ offset: 0, line: 2, table: lpsTable, message: `Table ready: [${lps.join(', ')}]. Now scan the text — i never moves backwards.` })

  while (i < n) {
    steps.push({
      offset: i - j,
      textIndex: i,
      patIndex: j,
      matched: matchedAbs(),
      found: [...found],
      table: lpsTable,
      line: 4,
      message: `text[${i}]='${text[i]}' vs pat[${j}]='${pat[j]}'.`,
    })
    if (text[i] === pat[j]) {
      i++
      j++
      if (j === m) {
        found.push(i - j)
        steps.push({
          offset: i - j,
          matched: Array.from({ length: m }, (_, k) => i - j + k),
          found: [...found],
          table: lpsTable,
          line: 5,
          message: `Full match at offset ${i - j}. Jump j back to lps[${j - 1}] = ${lps[j - 1]} and keep scanning.`,
        })
        j = lps[j - 1]
      }
    } else if (j > 0) {
      steps.push({
        offset: i - j,
        textIndex: i,
        patIndex: j,
        mismatch: i,
        found: [...found],
        table: lpsTable,
        line: 6,
        message: `Mismatch — reuse the border: j ← lps[${j - 1}] = ${lps[j - 1]}. i stays at ${i}.`,
      })
      j = lps[j - 1]
    } else {
      steps.push({ offset: i, textIndex: i, mismatch: i, found: [...found], table: lpsTable, line: 7, message: `Mismatch with j = 0 — advance i.` })
      i++
    }
  }

  steps.push({ offset: Math.max(0, n - m), found: [...found], table: lpsTable, line: 5, message: `Done — ${found.length} match(es): [${found.join(', ')}].` })
  return steps
}

export const kmp: StringAlgorithm = {
  id: 'kmp',
  name: 'Knuth–Morris–Pratt',
  description:
    'Precomputes an LPS ("failure") table so that after a mismatch the pattern can slide forward by more than one without ever re-reading a text character. Linear time.',
  timeComplexity: 'O(n + m)',
  spaceComplexity: 'O(m)',
  pseudocode,
  defaults: { text: 'ABABDABACDABABCABAB', pattern: 'ABABCABAB' },
  run,
}
