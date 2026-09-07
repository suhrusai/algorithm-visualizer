import { sortingAlgorithms } from '@/algorithms/sorting'

export interface AlgorithmCategory {
  id: string
  name: string
  description: string
  path: string
  available: boolean
  algorithms: { id: string; name: string; path: string }[]
}

export const categories: AlgorithmCategory[] = [
  {
    id: 'sorting',
    name: 'Sorting',
    description: 'Algorithms that put elements of a list into order.',
    path: '/sorting',
    available: true,
    algorithms: sortingAlgorithms.map((a) => ({
      id: a.id,
      name: a.name,
      path: `/sorting/${a.id}`,
    })),
  },
  {
    id: 'searching',
    name: 'Searching',
    description: 'Algorithms that locate a target value within a data structure.',
    path: '/searching',
    available: false,
    algorithms: [],
  },
  {
    id: 'graph',
    name: 'Graph',
    description: 'Traversal and shortest-path algorithms on graphs.',
    path: '/graph',
    available: false,
    algorithms: [],
  },
  {
    id: 'trees',
    name: 'Trees',
    description: 'Binary search trees, balancing, and traversal algorithms.',
    path: '/trees',
    available: false,
    algorithms: [],
  },
]
