import { Navigate, useParams } from 'react-router-dom'
import { SearchVisualizer } from '@/components/SearchVisualizer'
import { searchingAlgorithmsById } from '@/algorithms/searching'

export function SearchingAlgorithmPage() {
  const { algorithmId } = useParams<{ algorithmId: string }>()
  const algorithm = algorithmId ? searchingAlgorithmsById[algorithmId] : undefined

  if (!algorithm) {
    return <Navigate to="/searching" replace />
  }

  return <SearchVisualizer key={algorithm.id} algorithm={algorithm} />
}
