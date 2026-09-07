import { Navigate, useParams } from 'react-router-dom'
import { TreeVisualizer } from '@/components/TreeVisualizer'
import { treeAlgorithmsById } from '@/algorithms/tree'

export function TreesAlgorithmPage() {
  const { algorithmId } = useParams<{ algorithmId: string }>()
  const algorithm = algorithmId ? treeAlgorithmsById[algorithmId] : undefined

  if (!algorithm) {
    return <Navigate to="/trees" replace />
  }

  return <TreeVisualizer key={algorithm.id} algorithm={algorithm} />
}
