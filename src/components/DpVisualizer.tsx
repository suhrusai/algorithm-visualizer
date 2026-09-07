import { useEffect, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { PlaybackControls } from '@/components/PlaybackControls'
import { PseudocodePanel } from '@/components/PseudocodePanel'
import { ShareButton } from '@/components/ShareButton'
import { DpTable } from '@/components/DpTable'
import { useStepPlayer } from '@/hooks/useStepPlayer'
import { useUrlState } from '@/hooks/useUrlState'
import type { DpAlgorithm } from '@/types/dp'

interface Props {
  algorithm: DpAlgorithm
}

export function DpVisualizer({ algorithm }: Props) {
  const urlDefaults = useMemo<Record<string, string | number>>(
    () => ({ ...algorithm.defaults, speed: 1 }),
    [algorithm],
  )
  const [state, setUrl] = useUrlState(urlDefaults)

  const values = useMemo(() => {
    const v: Record<string, string> = {}
    for (const f of algorithm.inputs) v[f.key] = String(state[f.key] ?? algorithm.defaults[f.key] ?? '')
    return v
  }, [algorithm, state])

  const steps = useMemo(() => algorithm.run(values), [algorithm, values])
  const speed = Number(state.speed ?? 1)
  const player = useStepPlayer(steps.length, speed)

  useEffect(() => {
    player.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm.id, values])

  useEffect(() => {
    if (player.speed !== speed) setUrl({ speed: player.speed })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.speed])

  const currentStep = steps[player.index] ?? steps[0]
  const rowLabels = useMemo(() => algorithm.rowLabels(values), [algorithm, values])
  const colLabels = useMemo(() => algorithm.colLabels(values), [algorithm, values])
  const answer = steps[steps.length - 1]?.result

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{algorithm.name}</h1>
          <Badge variant="secondary">Dynamic programming</Badge>
          <div className="ml-auto">
            <ShareButton />
          </div>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">{algorithm.description}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>Time: <span className="font-mono text-foreground">{algorithm.timeComplexity}</span></span>
          <span>Space: <span className="font-mono text-foreground">{algorithm.spaceComplexity}</span></span>
          {answer && <span>Answer: <span className="font-medium text-foreground">{answer}</span></span>}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-card p-3">
        {algorithm.inputs.map((f) => (
          <label key={f.key} className="flex flex-col gap-1 text-xs text-muted-foreground">
            {f.label}
            <input
              value={values[f.key]}
              inputMode={f.kind === 'text' ? 'text' : 'numeric'}
              placeholder={f.placeholder}
              onChange={(e) => setUrl({ [f.key]: e.target.value } as Partial<typeof state>)}
              className="w-40 rounded-md border bg-background px-2 py-1 font-mono text-sm text-foreground"
            />
          </label>
        ))}
      </div>

      <DpTable step={currentStep} rowLabels={rowLabels} colLabels={colLabels} />

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

      <div>
        <h2 className="mb-2 text-sm font-semibold text-foreground">Pseudocode</h2>
        <PseudocodePanel lines={algorithm.pseudocode} activeLine={currentStep.line} />
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <LegendSwatch className="bg-amber-400 dark:bg-amber-500" label="Cell being filled" />
        <LegendSwatch className="bg-blue-400/60" label="Inputs to the recurrence" />
        <LegendSwatch className="bg-emerald-500" label="Answer reconstruction" />
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
