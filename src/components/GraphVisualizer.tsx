import { useEffect, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { PlaybackControls } from '@/components/PlaybackControls'
import { PseudocodePanel } from '@/components/PseudocodePanel'
import { ShareButton } from '@/components/ShareButton'
import { GraphCanvas } from '@/components/GraphCanvas'
import { useStepPlayer } from '@/hooks/useStepPlayer'
import { useUrlState } from '@/hooks/useUrlState'
import { sampleGraph } from '@/algorithms/graph'
import type { GraphAlgorithm } from '@/types/graph'

interface GraphVisualizerProps {
  algorithm: GraphAlgorithm
}

const NODE_IDS = sampleGraph.nodes.map((n) => n.id)

export function GraphVisualizer({ algorithm }: GraphVisualizerProps) {
  const [{ start, goal, speed }, setUrl] = useUrlState({ start: 'A', goal: 'I', speed: 1 })
  const setStart = (v: string) => setUrl({ start: v })
  const setGoal = (v: string) => setUrl({ goal: v })
  const usesGoal = algorithm.usesGoal !== false

  const steps = useMemo(() => algorithm.run(sampleGraph, start, goal), [algorithm, start, goal])
  const player = useStepPlayer(steps.length, speed)

  useEffect(() => {
    player.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm.id, start, goal])

  useEffect(() => {
    if (player.speed !== speed) setUrl({ speed: player.speed })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.speed])

  const currentStep = steps[player.index] ?? steps[0]
  const distances = currentStep.distances

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{algorithm.name}</h1>
          <Badge variant={algorithm.weighted ? 'default' : 'secondary'}>
            {algorithm.weighted ? 'Uses edge weights' : 'Ignores edge weights'}
          </Badge>
          <div className="ml-auto">
            <ShareButton />
          </div>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">{algorithm.description}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>Time: <span className="font-mono text-foreground">{algorithm.timeComplexity.average}</span></span>
          <span>Space: <span className="font-mono text-foreground">{algorithm.spaceComplexity}</span></span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-card p-3 text-sm">
        <label className="flex items-center gap-2">
          <span className="text-muted-foreground">{usesGoal ? 'Start' : 'Root'}</span>
          <select value={start} onChange={(e) => setStart(e.target.value)} className="rounded-md border bg-background px-2 py-1">
            {NODE_IDS.map((id) => (
              <option key={id} value={id} disabled={id === goal && usesGoal}>{id}</option>
            ))}
          </select>
        </label>
        {usesGoal && (
          <label className="flex items-center gap-2">
            <span className="text-muted-foreground">Goal</span>
            <select value={goal} onChange={(e) => setGoal(e.target.value)} className="rounded-md border bg-background px-2 py-1">
              {NODE_IDS.map((id) => (
                <option key={id} value={id} disabled={id === start}>{id}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      <GraphCanvas
        graph={sampleGraph}
        step={currentStep}
        start={start}
        goal={goal}
        showWeights={algorithm.weighted}
        showGoal={usesGoal}
      />

      <p className="min-h-5 text-sm text-muted-foreground">{currentStep.message}</p>

      <PlaybackControls
        playing={player.playing}
        onToggle={player.toggle}
        onStepBack={player.stepBackward}
        onStepForward={player.stepForward}
        onReset={player.reset}
        index={player.index}
        stepCount={steps.length}
        onSeek={player.seek}
        speed={player.speed}
        onSpeedChange={player.setSpeed}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border bg-card p-3 text-sm">
          <div className="mb-1 text-xs font-semibold text-muted-foreground">{algorithm.frontierLabel}</div>
          <div className="font-mono">
            {currentStep.frontier.length > 0 ? `[ ${currentStep.frontier.join(', ')} ]` : '[ empty ]'}
          </div>
        </div>
        {distances && (
          <div className="rounded-lg border bg-card p-3 text-sm">
            <div className="mb-1 text-xs font-semibold text-muted-foreground">Distances from {start}</div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs">
              {NODE_IDS.map((id) => (
                <span key={id}>
                  {id}:{distances[id] === Number.POSITIVE_INFINITY ? '∞' : distances[id]}
                </span>
              ))}
            </div>
          </div>
        )}
        {currentStep.mstEdges && (
          <div className="rounded-lg border bg-card p-3 text-sm">
            <div className="mb-1 text-xs font-semibold text-muted-foreground">
              Spanning tree ({currentStep.mstEdges.length} edge{currentStep.mstEdges.length === 1 ? '' : 's'}, weight {mstWeight(currentStep.mstEdges)})
            </div>
            <div className="font-mono text-xs">
              {currentStep.mstEdges.map(([a, b]) => `${a}–${b}`).join('  ') || '—'}
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-foreground">Pseudocode</h2>
        <PseudocodePanel lines={algorithm.pseudocode} activeLine={currentStep.line} />
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <LegendSwatch className="bg-violet-500 dark:bg-violet-400" label="Current node" />
        <LegendSwatch className="bg-amber-400 dark:bg-amber-500" label="In frontier" />
        <LegendSwatch className="bg-emerald-500" label="Visited / finalized" />
        <LegendSwatch className="bg-amber-500" label="Active edge" />
      </div>
    </div>
  )
}

function mstWeight(edges: [string, string][]): number {
  let total = 0
  for (const [a, b] of edges) {
    const e = sampleGraph.edges.find(
      (x) => (x.source === a && x.target === b) || (x.source === b && x.target === a),
    )
    if (e) total += e.weight
  }
  return total
}

function LegendSwatch({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`inline-block size-3 rounded-sm ${className}`} />
      {label}
    </span>
  )
}
