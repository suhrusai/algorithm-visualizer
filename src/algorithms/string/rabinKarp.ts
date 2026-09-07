import type { StringAlgorithm, StringStep } from '@/types/stringmatch'

const BASE = 256
const MOD = 1_000_000_007

const pseudocode = [
  'procedure RabinKarp(text, pat)',
  '  ph ← hash(pat);  th ← hash(text[0..m))',
  '  for s from 0 to |text| − |pat|',
  '    if th = ph and text[s..s+m) = pat',
  '      report match at s',
  '    if s < |text| − |pat|',
  '      th ← roll(th, text[s], text[s + m])   // O(1)',
]

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * BASE + s.charCodeAt(i)) % MOD
  return h
}

function run(text: string, pat: string): StringStep[] {
  const steps: StringStep[] = []
  const n = text.length
  const m = pat.length
  if (m === 0 || m > n) return [{ offset: 0, line: 0, message: m === 0 ? 'Pattern is empty.' : 'Pattern longer than text.' }]

  const ph = hash(pat)
  let th = hash(text.slice(0, m))
  let high = 1
  for (let i = 0; i < m - 1; i++) high = (high * BASE) % MOD
  const found: number[] = []

  const table = () => ({
    label: `rolling hash`,
    values: [`pattern = ${ph}`, `window = ${th}`],
    highlight: th === ph ? 1 : undefined,
    under: 'text' as const,
  })

  steps.push({ offset: 0, line: 1, table: table(), message: `pattern hash = ${ph}, first window hash = ${th}.` })

  for (let s = 0; s + m <= n; s++) {
    steps.push({
      offset: s,
      found: [...found],
      table: table(),
      line: 3,
      message:
        th === ph
          ? `Window [${s}, ${s + m}) hash ${th} = pattern hash — verify character by character.`
          : `Window hash ${th} ≠ ${ph} — skip, no comparison needed.`,
    })
    if (th === ph) {
      let ok = true
      for (let k = 0; k < m; k++) {
        steps.push({
          offset: s,
          textIndex: s + k,
          patIndex: k,
          matched: Array.from({ length: k }, (_, x) => s + x),
          found: [...found],
          table: table(),
          line: 3,
          message: `Verify text[${s + k}]='${text[s + k]}' vs pat[${k}]='${pat[k]}'.`,
        })
        if (text[s + k] !== pat[k]) {
          ok = false
          steps.push({ offset: s, textIndex: s + k, mismatch: s + k, found: [...found], table: table(), line: 3, message: `Hash collision — not a real match.` })
          break
        }
      }
      if (ok) {
        found.push(s)
        steps.push({ offset: s, matched: Array.from({ length: m }, (_, x) => s + x), found: [...found], table: table(), line: 4, message: `Confirmed match at offset ${s}.` })
      }
    }
    if (s + m < n) {
      th = ((th - (text.charCodeAt(s) * high) % MOD + MOD) % MOD * BASE + text.charCodeAt(s + m)) % MOD
      steps.push({ offset: s + 1, found: [...found], table: table(), line: 6, message: `Roll the hash: drop '${text[s]}', add '${text[s + m]}' → ${th}.` })
    }
  }

  steps.push({ offset: Math.max(0, n - m), found: [...found], line: 4, message: `Done — ${found.length} match(es): [${found.join(', ')}].` })
  return steps
}

export const rabinKarp: StringAlgorithm = {
  id: 'rabin-karp',
  name: 'Rabin–Karp',
  description:
    'Hashes the pattern once, then slides a rolling hash across the text so each window hash costs O(1). Only windows whose hash matches are verified character by character.',
  timeComplexity: 'O(n + m) average, O(n·m) worst',
  spaceComplexity: 'O(1)',
  pseudocode,
  defaults: { text: 'ABABDABACDABABCABAB', pattern: 'ABABCABAB' },
  run,
}
