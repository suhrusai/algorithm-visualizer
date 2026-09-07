import { Navigate, useParams } from 'react-router-dom'
import { PathfindingVisualizer } from '@/components/PathfindingVisualizer'
import { pathfindingAlgorithmsById } from '@/algorithms/pathfinding'

export function PathfindingAlgorithmPage() {
  const { algorithmId } = useParams<{ algorithmId: string }>()
  const algorithm = algorithmId ? pathfindingAlgorithmsById[algorithmId] : undefined

  if (!algorithm) {
    return <Navigate to="/pathfinding" replace />
  }

  return <PathfindingVisualizer key={algorithm.id} algorithm={algorithm} />
}
