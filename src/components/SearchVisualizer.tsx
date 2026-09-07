import { useEffect, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { PlaybackControls } from '@/components/PlaybackControls'
import { PseudocodePanel } from '@/components/PseudocodePanel'
import { SearchCells } from '@/components/SearchCells'
import { ShareButton } from '@/components/ShareButton'
import { useStepPlayer } from '@/hooks/useStepPlayer'
import { useUrlState } from '@/hooks/useUrlState'
import { randomSeed, seededArray, mulberry32 } from '@/lib/rng'
import type { SearchAlgorithm } from '@/types/searching'

interface SearchVisualizerProps {
  algorithm: SearchAlgorithm
}

const DEFAULT_SIZE = 15

function makeArray(seed: number, size: number, sorted: boolean): number[] {
  const arr = seededArray(seed, size, 1, 99)
  return sorted ? [...arr].sort((a, b) => a - b) : arr
}

function defaultTarget(seed: number, arr: number[]): number {
  const rand = mulberry32(seed ^ 0x9e3779b9)
  if (rand() < 0.7 && arr.length > 0) {
    return arr[Math.floor(rand() * arr.length)]
  }
  return Math.floor(rand() * 99) + 1
}

export function SearchVisualizer({ algorithm }: SearchVisualizerProps) {
  const [{ seed, size, target, speed }, setUrl] = useUrlState({
    seed: 1,
    size: DEFAULT_SIZE,
    target: -1,
    speed: 1,
  })

  const array = useMemo(
    () => makeArray(seed, size, algorithm.requiresSorted),
    [seed, size, algorithm.requiresSorted],
  )
  const effectiveTarget = target >= 0 ? target : defaultTarget(seed, array)

  const steps = useMemo(() => algorithm.run(array, effectiveTarget), [algorithm, array, effectiveTarget])
  const player = useStepPlayer(steps.length, speed)

  useEffect(() => {
    player.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm.id, array, effectiveTarget])

  useEffect(() => {
    if (player.speed !== speed) setUrl({ speed: player.speed })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.speed])

  const currentStep = steps[player.index] ?? steps[0]
  const lastStep = steps[steps.length - 1]
  const outcome = lastStep.found !== undefined ? `Found at index ${lastStep.found}` : 'Not found'

  const candidates = useMemo(() => {
    const present = Array.from(new Set(array)).sort((a, b) => a - b)
    const absent: number[] = []
    for (let v = 1; v <= 99 && absent.length < 3; v++) {
      if (!present.includes(v)) absent.push(v)
    }
    return { present, absent }
  }, [array])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{algorithm.name}</h1>
          <Badge variant={algorithm.requiresSorted ? 'secondary' : 'default'}>
            {algorithm.requiresSorted ? 'Needs sorted input' : 'Works on any array'}
          </Badge>
          <div className="ml-auto">
            <ShareButton />
          </div>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">{algorithm.description}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>Best: <span className="font-mono text-foreground">{algorithm.timeComplexity.best}</span></span>
          <span>Average: <span className="font-mono text-foreground">{algorithm.timeComplexity.average}</span></span>
          <span>Worst: <span className="font-mono text-foreground">{algorithm.timeComplexity.worst}</span></span>
          <span>Space: <span className="font-mono text-foreground">{algorithm.spaceComplexity}</span></span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Target</span>
          <select
            value={effectiveTarget}
            onChange={(e) => setUrl({ target: Number(e.target.value) })}
            className="rounded-md border bg-background px-2 py-1 text-sm"
          >
            <optgroup label="In the array">
              {candidates.present.map((v) => (
                <option key={`p-${v}`} value={v}>{v}</option>
              ))}
            </optgroup>
            <optgroup label="Not in the array">
              {candidates.absent.map((v) => (
                <option key={`a-${v}`} value={v}>{v}</option>
              ))}
            </optgroup>
          </select>
        </label>
        <span className="text-xs text-muted-foreground">
          Outcome: <span className="font-medium text-foreground">{outcome}</span>
        </span>
      </div>

      <SearchCells step={currentStep} />

      <p className="min-h-5 text-sm text-muted-foreground">{currentStep.message}</p>

      <PlaybackControls
        playing={player.playing}
        onToggle={player.toggle}
        onStepBack={player.stepBackward}
        onStepForward={player.stepForward}
        onReset={player.reset}
        onShuffle={() => setUrl({ seed: randomSeed(), target: -1 })}
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
        <LegendSwatch className="bg-blue-400/70 dark:bg-blue-500/60" label="Active window" />
        <LegendSwatch className="bg-amber-400 dark:bg-amber-500" label="Probing" />
        <LegendSwatch className="bg-muted" label="Eliminated" />
        <LegendSwatch className="bg-emerald-500" label="Found" />
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
