import { useEffect, useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { PlaybackControls } from '@/components/PlaybackControls'
import { PseudocodePanel } from '@/components/PseudocodePanel'
import { TreeCanvas } from '@/components/TreeCanvas'
import { useStepPlayer } from '@/hooks/useStepPlayer'
import { randomTreeValues } from '@/algorithms/tree'
import type { TreeAlgorithm } from '@/types/tree'

interface TreeVisualizerProps {
  algorithm: TreeAlgorithm
}

export function TreeVisualizer({ algorithm }: TreeVisualizerProps) {
  const [values, setValues] = useState(() => randomTreeValues(9))
  const [target, setTarget] = useState(() => values[Math.floor(values.length / 2)])

  const isSearch = algorithm.id === 'bst-search'

  const steps = useMemo(() => algorithm.run(values, target), [algorithm, values, target])
  const player = useStepPlayer(steps.length)

  useEffect(() => {
    player.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm.id, values, target])

  const currentStep = steps[player.index] ?? steps[0]

  const handleNewTree = () => {
    const next = randomTreeValues(9)
    setValues(next)
    setTarget(next[Math.floor(next.length / 2)])
  }

  const candidates = useMemo(() => {
    const present = [...values].sort((a, b) => a - b)
    let absent = 0
    for (let v = 1; v <= 99; v++) {
      if (!values.includes(v)) {
        absent = v
        break
      }
    }
    return { present, absent }
  }, [values])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{algorithm.name}</h1>
          <Badge variant="secondary">Binary search tree</Badge>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">{algorithm.description}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>Best: <span className="font-mono text-foreground">{algorithm.timeComplexity.best}</span></span>
          <span>Average: <span className="font-mono text-foreground">{algorithm.timeComplexity.average}</span></span>
          <span>Worst: <span className="font-mono text-foreground">{algorithm.timeComplexity.worst}</span></span>
          <span>Space: <span className="font-mono text-foreground">{algorithm.spaceComplexity}</span></span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-card p-3 text-sm">
        <span className="text-muted-foreground">
          Values: <span className="font-mono text-foreground">{values.join(', ')}</span>
          {algorithm.buildsTree && ' (inserted in this order)'}
        </span>
        {isSearch && (
          <label className="flex items-center gap-2">
            <span className="text-muted-foreground">Target</span>
            <select
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="rounded-md border bg-background px-2 py-1"
            >
              {candidates.present.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
              <option value={candidates.absent}>{candidates.absent} (not in tree)</option>
            </select>
          </label>
        )}
      </div>

      <TreeCanvas step={currentStep} />

      {currentStep.output !== undefined && (
        <div className="rounded-lg border bg-card p-3 text-sm">
          <span className="text-xs font-semibold text-muted-foreground">Output</span>
          <div className="font-mono">[ {currentStep.output.join(', ')} ]</div>
        </div>
      )}

      <p className="min-h-5 text-sm text-muted-foreground">{currentStep.message}</p>

      <PlaybackControls
        playing={player.playing}
        onToggle={player.toggle}
        onStepBack={player.stepBackward}
        onStepForward={player.stepForward}
        onReset={player.reset}
        onShuffle={handleNewTree}
        shuffleTitle="New random tree"
        index={player.index}
        stepCount={steps.length}
        onSeek={player.seek}
        speed={player.speed}
        onSpeedChange={player.setSpeed}
      />

      <div>
        <h2 className="mb-2 text-sm font-semibold text-foreground">Pseudocode</h2>
        <PseudocodePanel lines={algorithm.pseudocode} activeLine={currentStep.line} />
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <LegendSwatch className="bg-violet-500 dark:bg-violet-400" label="Current node" />
        <LegendSwatch className="bg-blue-400/70 dark:bg-blue-500/60" label="On the active path" />
        <LegendSwatch className="bg-emerald-500" label="Visited / emitted" />
      </div>
    </div>
  )
}

function LegendSwatch({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`inline-block size-3 rounded-sm ${className}`} />
      {label}
    </span>
  )
}
