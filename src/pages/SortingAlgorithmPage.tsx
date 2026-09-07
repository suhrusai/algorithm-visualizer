import { Navigate, useParams } from 'react-router-dom'
import { SortVisualizer } from '@/components/SortVisualizer'
import { sortingAlgorithmsById } from '@/algorithms/sorting'

export function SortingAlgorithmPage() {
  const { algorithmId } = useParams<{ algorithmId: string }>()
  const algorithm = algorithmId ? sortingAlgorithmsById[algorithmId] : undefined

  if (!algorithm) {
    return <Navigate to="/sorting" replace />
  }

  return <SortVisualizer key={algorithm.id} algorithm={algorithm} />
}
