import { bfsPath, dijkstraPath, astarPath, greedyPath } from './search'
import type { PathAlgorithm } from '@/types/pathfinding'

export const pathfindingAlgorithms: PathAlgorithm[] = [bfsPath, dijkstraPath, astarPath, greedyPath]

export const pathfindingAlgorithmsById: Record<string, PathAlgorithm> = Object.fromEntries(
  pathfindingAlgorithms.map((a) => [a.id, a]),
)

export { emptyGrid, generateMaze, encodeTerrain, decodeTerrain, DEFAULT_ROWS, DEFAULT_COLS } from './grid'
