import { sortingAlgorithms } from '@/algorithms/sorting'
import { searchingAlgorithms } from '@/algorithms/searching'
import { graphAlgorithms } from '@/algorithms/graph'
import { treeAlgorithms } from '@/algorithms/tree'
import { pathfindingAlgorithms } from '@/algorithms/pathfinding'

export const SITE_NAME = 'Algorithm Visualizer'
export const SITE_URL = 'https://suhrusai.github.io/algorithm-visualizer'

interface Meta {
  title: string
  description: string
}

const HOME: Meta = {
  title: `${SITE_NAME} — watch sorting, search, graph & tree algorithms run`,
  description:
    'Free interactive visualizations of classic algorithms: sorting, searching, graph traversal, shortest paths, binary search trees, and grid pathfinding — each stepped through in sync with its pseudocode.',
}

const STATIC: Record<string, Meta> = {
  '/': HOME,
  '/sorting': {
    title: `Sorting algorithm visualizations — ${SITE_NAME}`,
    description:
      'Animated bubble, selection, insertion, merge, quick, and heap sort — bars slide into place step by step alongside the pseudocode.',
  },
  '/searching': {
    title: `Searching algorithm visualizations — ${SITE_NAME}`,
    description: 'Linear, binary, jump, and interpolation search shown narrowing in on a target value.',
  },
  '/graph': {
    title: `Graph algorithm visualizations — ${SITE_NAME}`,
    description: "Breadth-first search, depth-first search, and Dijkstra's shortest path on a weighted graph.",
  },
  '/trees': {
    title: `Binary search tree visualizations — ${SITE_NAME}`,
    description: 'BST insertion, search, deletion, rebalancing, and the four traversal orders.',
  },
  '/trees/operations': {
    title: `Interactive BST operations playground — ${SITE_NAME}`,
    description:
      'Build a binary search tree from your own values and watch insert, delete, search, and rebalance run step by step.',
  },
  '/pathfinding': {
    title: `Pathfinding visualizations: A*, Dijkstra, BFS — ${SITE_NAME}`,
    description:
      'Draw walls and weighted tiles on a grid, generate a maze, and compare how BFS, Dijkstra, A*, and Greedy Best-First search for the goal.',
  },
  '/race': {
    title: `Sorting algorithm race — ${SITE_NAME}`,
    description: 'Run several sorting algorithms side by side on the same array and see which finishes first.',
  },
  '/pathfinding/race': {
    title: `Pathfinding race: A* vs Dijkstra vs BFS vs Greedy — ${SITE_NAME}`,
    description:
      'Run BFS, Dijkstra, A*, and Greedy Best-First on the same maze at once and compare paths and cells explored.',
  },
}

const DYNAMIC: { prefix: string; label: string; items: { id: string; name: string; description: string }[] }[] = [
  { prefix: '/sorting/', label: 'sorting', items: sortingAlgorithms },
  { prefix: '/searching/', label: 'searching', items: searchingAlgorithms },
  { prefix: '/graph/', label: 'graph', items: graphAlgorithms },
  { prefix: '/trees/', label: 'tree', items: treeAlgorithms },
  { prefix: '/pathfinding/', label: 'pathfinding', items: pathfindingAlgorithms },
]

export function metaForPath(pathname: string): Meta {
  if (STATIC[pathname]) return STATIC[pathname]
  for (const group of DYNAMIC) {
    if (pathname.startsWith(group.prefix)) {
      const id = pathname.slice(group.prefix.length)
      const item = group.items.find((x) => x.id === id)
      if (item) {
        return {
          title: `${item.name} visualization — ${SITE_NAME}`,
          description: item.description,
        }
      }
    }
  }
  return HOME
}

/** All indexable routes, for the sitemap. */
export function allRoutes(): string[] {
  const routes = new Set<string>(Object.keys(STATIC))
  for (const group of DYNAMIC) {
    for (const item of group.items) routes.add(group.prefix + item.id)
  }
  return [...routes]
}
