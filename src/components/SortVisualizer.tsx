import { useEffect, useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { PlaybackControls } from '@/components/PlaybackControls'
import { PseudocodePanel } from '@/components/PseudocodePanel'
import { SortBars } from '@/components/SortBars'
import { Slider } from '@/components/ui/slider'
import { useStepPlayer } from '@/hooks/useStepPlayer'
import { randomArray } from '@/lib/randomArray'
import type { SortAlgorithm } from '@/types/sorting'

interface SortVisualizerProps {
  algorithm: SortAlgorithm
}

const DEFAULT_SIZE = 20

export function SortVisualizer({ algorithm }: SortVisualizerProps) {
  const [size, setSize] = useState(DEFAULT_SIZE)
  const [initialArray, setInitialArray] = useState(() => randomArray(DEFAULT_SIZE))

  const steps = useMemo(() => algorithm.run(initialArray), [algorithm, initialArray])
  const player = useStepPlayer(steps.length)

  useEffect(() => {
    player.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm.id, initialArray])

  const currentStep = steps[player.index] ?? steps[0]

  const handleShuffle = () => {
    setInitialArray(randomArray(size))
  }

  const handleSizeChange = (value: number) => {
    setSize(value)
    setInitialArray(randomArray(value))
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{algorithm.name}</h1>
          <Badge variant={algorithm.stable ? 'default' : 'secondary'}>
            {algorithm.stable ? 'Stable' : 'Not stable'}
          </Badge>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">{algorithm.description}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>
            Best: <span className="font-mono text-foreground">{algorithm.timeComplexity.best}</span>
          </span>
          <span>
            Average: <span className="font-mono text-foreground">{algorithm.timeComplexity.average}</span>
          </span>
          <span>
            Worst: <span className="font-mono text-foreground">{algorithm.timeComplexity.worst}</span>
          </span>
          <span>
            Space: <span className="font-mono text-foreground">{algorithm.spaceComplexity}</span>
          </span>
        </div>
      </div>

      <SortBars step={currentStep} />

      <p className="min-h-5 text-sm text-muted-foreground">{currentStep.message}</p>

      <PlaybackControls
        playing={player.playing}
        onToggle={player.toggle}
        onStepBack={player.stepBackward}
        onStepForward={player.stepForward}
        onReset={player.reset}
        onShuffle={handleShuffle}
        index={player.index}
        stepCount={steps.length}
        onSeek={player.seek}
        speed={player.speed}
        onSpeedChange={player.setSpeed}
      />

      <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
        <span className="w-24 shrink-0 text-xs text-muted-foreground">Array size</span>
        <Slider value={[size]} min={5} max={60} step={1} onValueChange={([v]) => handleSizeChange(v)} />
        <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">{size}</span>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-foreground">Pseudocode</h2>
        <PseudocodePanel lines={algorithm.pseudocode} activeLine={currentStep.line} />
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <LegendSwatch className="bg-amber-400 dark:bg-amber-500" label="Comparing" />
        <LegendSwatch className="bg-rose-500" label="Swapping / writing" />
        <LegendSwatch className="bg-violet-500 dark:bg-violet-400" label="Pivot" />
        <LegendSwatch className="bg-blue-400/70 dark:bg-blue-500/60" label="Active range" />
        <LegendSwatch className="bg-emerald-500" label="Sorted" />
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
