import { Navigate, useParams } from 'react-router-dom'
import { StringVisualizer } from '@/components/StringVisualizer'
import { stringAlgorithmsById } from '@/algorithms/string'

export function StringAlgorithmPage() {
  const { algorithmId } = useParams<{ algorithmId: string }>()
  const algorithm = algorithmId ? stringAlgorithmsById[algorithmId] : undefined

  if (!algorithm) {
    return <Navigate to="/string" replace />
  }

  return <StringVisualizer key={algorithm.id} algorithm={algorithm} />
}
