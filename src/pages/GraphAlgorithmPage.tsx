import { Navigate, useParams } from 'react-router-dom'
import { GraphVisualizer } from '@/components/GraphVisualizer'
import { graphAlgorithmsById } from '@/algorithms/graph'

export function GraphAlgorithmPage() {
  const { algorithmId } = useParams<{ algorithmId: string }>()
  const algorithm = algorithmId ? graphAlgorithmsById[algorithmId] : undefined

  if (!algorithm) {
    return <Navigate to="/graph" replace />
  }

  return <GraphVisualizer key={algorithm.id} algorithm={algorithm} />
}
