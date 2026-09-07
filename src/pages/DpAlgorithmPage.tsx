import { Navigate, useParams } from 'react-router-dom'
import { DpVisualizer } from '@/components/DpVisualizer'
import { dpAlgorithmsById } from '@/algorithms/dp'

export function DpAlgorithmPage() {
  const { algorithmId } = useParams<{ algorithmId: string }>()
  const algorithm = algorithmId ? dpAlgorithmsById[algorithmId] : undefined

  if (!algorithm) {
    return <Navigate to="/dp" replace />
  }

  return <DpVisualizer key={algorithm.id} algorithm={algorithm} />
}
