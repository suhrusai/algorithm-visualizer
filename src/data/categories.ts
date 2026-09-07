import { sortingAlgorithms } from '@/algorithms/sorting'
import { searchingAlgorithms } from '@/algorithms/searching'
import { graphAlgorithms } from '@/algorithms/graph'
import { treeAlgorithms } from '@/algorithms/tree'

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
    available: true,
    algorithms: searchingAlgorithms.map((a) => ({
      id: a.id,
      name: a.name,
      path: `/searching/${a.id}`,
    })),
  },
  {
    id: 'graph',
    name: 'Graph',
    description: 'Traversal and shortest-path algorithms on graphs.',
    path: '/graph',
    available: true,
    algorithms: graphAlgorithms.map((a) => ({
      id: a.id,
      name: a.name,
      path: `/graph/${a.id}`,
    })),
  },
  {
    id: 'trees',
    name: 'Trees',
    description: 'Binary search tree insertion, lookup, and traversal.',
    path: '/trees',
    available: true,
    algorithms: treeAlgorithms.map((a) => ({
      id: a.id,
      name: a.name,
      path: `/trees/${a.id}`,
    })),
  },
]
