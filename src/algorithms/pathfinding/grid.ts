import type { Grid, Terrain } from '@/types/pathfinding'
import { mulberry32 } from '@/lib/rng'

export const DEFAULT_ROWS = 15
export const DEFAULT_COLS = 30

export function idx(cols: number, r: number, c: number) {
  return r * cols + c
}

export function coords(cols: number, i: number): [number, number] {
  return [Math.floor(i / cols), i % cols]
}

export function neighbours(grid: Grid, i: number): number[] {
  const [r, c] = coords(grid.cols, i)
  const out: number[] = []
  if (r > 0) out.push(i - grid.cols)
  if (c < grid.cols - 1) out.push(i + 1)
  if (r < grid.rows - 1) out.push(i + grid.cols)
  if (c > 0) out.push(i - 1)
  return out
}

export function manhattan(cols: number, a: number, b: number): number {
  const [ar, ac] = coords(cols, a)
  const [br, bc] = coords(cols, b)
  return Math.abs(ar - br) + Math.abs(ac - bc)
}

export function emptyGrid(rows = DEFAULT_ROWS, cols = DEFAULT_COLS): Grid {
  return {
    rows,
    cols,
    terrain: Array<Terrain>(rows * cols).fill(0),
    start: idx(cols, Math.floor(rows / 2), 2),
    goal: idx(cols, Math.floor(rows / 2), cols - 3),
  }
}

/** Randomized-DFS maze carved on odd cells. Mutates a fresh grid and returns it. */
export function generateMaze(rows: number, cols: number, seed: number): Grid {
  const rand = mulberry32(seed)
  const terrain = Array<Terrain>(rows * cols).fill(1)
  const carve = (r: number, c: number) => {
    terrain[r * cols + c] = 0
    const dirs = [
      [-2, 0],
      [2, 0],
      [0, -2],
      [0, 2],
    ].sort(() => rand() - 0.5)
    for (const [dr, dc] of dirs) {
      const nr = r + dr
      const nc = c + dc
      if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1 && terrain[nr * cols + nc] === 1) {
        terrain[(r + dr / 2) * cols + (c + dc / 2)] = 0
        carve(nr, nc)
      }
    }
  }
  carve(1, 1)
  // The backtracker visits every odd cell, so start/goal on odd coordinates
  // are always carved and mutually reachable.
  const lastOdd = (n: number) => (n % 2 === 0 ? n - 1 : n)
  const start = idx(cols, 1, 1)
  const goal = idx(cols, lastOdd(rows - 2), lastOdd(cols - 2))
  return { rows, cols, terrain, start, goal }
}

/** The maze shown on first load — deterministic so everyone sees the same one. */
export const DEFAULT_MAZE_SEED = 20260907

export function defaultGrid(): Grid {
  return generateMaze(DEFAULT_ROWS, DEFAULT_COLS, DEFAULT_MAZE_SEED)
}

/** Serialize terrain to a compact base36 run-length string for shareable URLs. */
export function encodeTerrain(terrain: Terrain[]): string {
  const runs: string[] = []
  let i = 0
  while (i < terrain.length) {
    const v = terrain[i]
    let n = 1
    while (i + n < terrain.length && terrain[i + n] === v) n++
    runs.push(`${v}${n.toString(36)}`)
    i += n
  }
  return runs.join('.')
}

export function decodeTerrain(str: string, length: number): Terrain[] {
  const out: Terrain[] = []
  for (const run of str.split('.')) {
    if (!run) continue
    const v = Number(run[0]) as Terrain
    const n = parseInt(run.slice(1), 36)
    for (let k = 0; k < n && out.length < length; k++) out.push(v)
  }
  while (out.length < length) out.push(0)
  return out
}
