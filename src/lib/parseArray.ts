/** Parse a user-typed list into 1–60 integers in [0, 999]. */
export function parseCustomArray(raw: string): number[] {
  return raw
    .split(/[\s,]+/)
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n))
    .map((n) => Math.min(999, Math.max(0, Math.round(n))))
    .slice(0, 60)
}
