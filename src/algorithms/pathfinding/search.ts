import type { Grid, PathAlgorithm, PathStep } from '@/types/pathfinding'
import { WEIGHT_COST } from '@/types/pathfinding'
import { manhattan, neighbours } from './grid'

interface Config {
  /** weight on path-cost-so-far g(n) */
  wg: number
  /** weight on heuristic h(n) */
  wh: number
  /** ignore tile weights (treat every open tile as cost 1) */
  unweighted?: boolean
}

function tileCost(grid: Grid, i: number, unweighted: boolean): number {
  if (unweighted) return 1
  return grid.terrain[i] === 2 ? WEIGHT_COST : 1
}

function reconstruct(parent: Int32Array, end: number): number[] {
  const path: number[] = []
  let cur = end
  while (cur !== -1) {
    path.unshift(cur)
    cur = parent[cur]
  }
  return path
}

/** Best-first search parameterised into Dijkstra, A*, and Greedy. */
function bestFirst(grid: Grid, cfg: Config): PathStep[] {
  const n = grid.rows * grid.cols
  const g = new Float64Array(n).fill(Infinity)
  const parent = new Int32Array(n).fill(-1)
  const done = new Uint8Array(n)
  const inOpen = new Uint8Array(n)
  const open: number[] = [grid.start]
  const steps: PathStep[] = []
  g[grid.start] = 0
  inOpen[grid.start] = 1

  const h = (i: number) => manhattan(grid.cols, i, grid.goal)
  const priority = (i: number) => cfg.wg * g[i] + cfg.wh * h(i)
  const visited: number[] = []

  steps.push({ visited: [], frontier: [grid.start], line: 1, message: 'Put the start cell in the open set.' })

  while (open.length > 0) {
    let bi = 0
    for (let k = 1; k < open.length; k++) {
      if (priority(open[k]) < priority(open[bi])) bi = k
    }
    const cur = open.splice(bi, 1)[0]
    inOpen[cur] = 0
    if (done[cur]) continue
    done[cur] = 1
    visited.push(cur)

    steps.push({
      visited: [...visited],
      frontier: [...open],
      current: cur,
      line: 4,
      message: `Expand the best open cell (priority ${priority(cur).toFixed(0)}).`,
    })

    if (cur === grid.goal) {
      const path = reconstruct(parent, cur)
      steps.push({
        visited: [...visited],
        frontier: [...open],
        current: cur,
        path,
        line: 5,
        message: `Reached the goal — path length ${path.length - 1}, cost ${g[cur]}.`,
      })
      return steps
    }

    for (const nb of neighbours(grid, cur)) {
      if (grid.terrain[nb] === 1 || done[nb]) continue
      const tentative = g[cur] + tileCost(grid, nb, !!cfg.unweighted)
      if (tentative < g[nb]) {
        g[nb] = tentative
        parent[nb] = cur
        if (!inOpen[nb]) {
          open.push(nb)
          inOpen[nb] = 1
        }
      }
    }
  }

  steps.push({ visited: [...visited], frontier: [], line: 7, message: 'Open set is empty — the goal is unreachable.' })
  return steps
}

function bfs(grid: Grid): PathStep[] {
  const n = grid.rows * grid.cols
  const parent = new Int32Array(n).fill(-1)
  const seen = new Uint8Array(n)
  const queue: number[] = [grid.start]
  const steps: PathStep[] = []
  const visited: number[] = []
  seen[grid.start] = 1

  steps.push({ visited: [], frontier: [grid.start], line: 1, message: 'Put the start cell in the queue.' })

  while (queue.length > 0) {
    const cur = queue.shift() as number
    visited.push(cur)
    steps.push({
      visited: [...visited],
      frontier: [...queue],
      current: cur,
      line: 4,
      message: 'Dequeue the oldest cell and expand it.',
    })

    if (cur === grid.goal) {
      const path = reconstruct(parent, cur)
      steps.push({
        visited: [...visited],
        frontier: [...queue],
        current: cur,
        path,
        line: 5,
        message: `Reached the goal — path length ${path.length - 1}.`,
      })
      return steps
    }

    for (const nb of neighbours(grid, cur)) {
      if (grid.terrain[nb] === 1 || seen[nb]) continue
      seen[nb] = 1
      parent[nb] = cur
      queue.push(nb)
    }
  }

  steps.push({ visited: [...visited], frontier: [], line: 7, message: 'Queue is empty — the goal is unreachable.' })
  return steps
}

const bfsPseudocode = [
  'procedure BFS(grid, start, goal)',
  '  queue ← [start]; seen ← {start}',
  '  while queue not empty',
  '    cur ← queue.dequeue()',
  '    if cur = goal: return path',
  '    for nb in open neighbours of cur',
  '      if nb not seen: seen.add(nb); queue.enqueue(nb)',
]

const bestFirstPseudocode = [
  'procedure search(grid, start, goal)',
  '  open ← {start}; g[start] ← 0',
  '  while open not empty',
  '    cur ← argmin priority(n) over open',
  '    if cur = goal: return path',
  '    for nb in open neighbours of cur',
  '      if g[cur] + cost(nb) < g[nb]',
  '        g[nb] ← g[cur] + cost(nb); parent[nb] ← cur; open.add(nb)',
]

export const bfsPath: PathAlgorithm = {
  id: 'bfs',
  name: 'Breadth-First Search',
  description:
    'Expands cells in the order they are discovered using a FIFO queue. On an unweighted grid this finds a shortest path, but it fans out equally in every direction.',
  weighted: false,
  heuristic: false,
  timeComplexity: 'O(V + E)',
  spaceComplexity: 'O(V)',
  pseudocode: bfsPseudocode,
  run: bfs,
}

export const dijkstraPath: PathAlgorithm = {
  id: 'dijkstra',
  name: "Dijkstra's Algorithm",
  description:
    'Always expands the open cell with the smallest path cost so far. Respects weighted tiles and still fans out in all directions because it has no sense of where the goal is.',
  weighted: true,
  heuristic: false,
  timeComplexity: 'O(E + V log V)',
  spaceComplexity: 'O(V)',
  pseudocode: bestFirstPseudocode,
  run: (grid) => bestFirst(grid, { wg: 1, wh: 0 }),
}

export const astarPath: PathAlgorithm = {
  id: 'astar',
  name: 'A* Search',
  description:
    'Expands the cell that minimises cost-so-far plus an estimate of the remaining distance (Manhattan). With an admissible heuristic it finds an optimal path while exploring far fewer cells than Dijkstra.',
  weighted: true,
  heuristic: true,
  timeComplexity: 'O(E)',
  spaceComplexity: 'O(V)',
  pseudocode: bestFirstPseudocode,
  run: (grid) => bestFirst(grid, { wg: 1, wh: 1 }),
}

export const greedyPath: PathAlgorithm = {
  id: 'greedy',
  name: 'Greedy Best-First',
  description:
    'Expands whichever open cell looks closest to the goal by the heuristic alone, ignoring how far it has already travelled. Very fast, but the path it finds can be far from optimal.',
  weighted: false,
  heuristic: true,
  timeComplexity: 'O(E)',
  spaceComplexity: 'O(V)',
  pseudocode: bestFirstPseudocode,
  run: (grid) => bestFirst(grid, { wg: 0, wh: 1, unweighted: true }),
}
