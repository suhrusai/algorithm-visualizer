export function parseNumbers(raw: string, limit = 12): number[] {
  return raw
    .split(/[\s,]+/)
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n))
    .slice(0, limit)
}

export function parseText(raw: string, limit = 12): string {
  return raw.replace(/\s+/g, '').slice(0, limit)
}

export function emptyGrid(rows: number, cols: number): (number | null)[][] {
  return Array.from({ length: rows }, () => Array<number | null>(cols).fill(null))
}

/** deep copy so each step keeps its own snapshot */
export function clone(grid: (number | null)[][]): (number | null)[][] {
  return grid.map((r) => r.slice())
}
