import { useEffect, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { PlaybackControls } from '@/components/PlaybackControls'
import { PseudocodePanel } from '@/components/PseudocodePanel'
import { ShareButton } from '@/components/ShareButton'
import { StringStrip } from '@/components/StringStrip'
import { StringAuxTable } from '@/components/StringAuxTable'
import { useStepPlayer } from '@/hooks/useStepPlayer'
import { useUrlState } from '@/hooks/useUrlState'
import type { StringAlgorithm } from '@/types/stringmatch'

interface Props {
  algorithm: StringAlgorithm
}

const clean = (s: string, max: number) => s.replace(/\s+/g, '').slice(0, max).toUpperCase()

export function StringVisualizer({ algorithm }: Props) {
  const [{ text, pattern, speed }, setUrl] = useUrlState({
    text: algorithm.defaults.text,
    pattern: algorithm.defaults.pattern,
    speed: 1,
  })

  const t = useMemo(() => clean(text, 40), [text])
  const p = useMemo(() => clean(pattern, 16), [pattern])

  const steps = useMemo(() => algorithm.run(t, p), [algorithm, t, p])
  const player = useStepPlayer(steps.length, speed)

  useEffect(() => {
    player.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm.id, t, p])

  useEffect(() => {
    if (player.speed !== speed) setUrl({ speed: player.speed })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.speed])

  const currentStep = steps[player.index] ?? steps[0]
  const matches = steps[steps.length - 1]?.found ?? []
  let comparisons = 0
  for (let i = 0; i <= player.index && i < steps.length; i++) {
    if (steps[i].textIndex !== undefined) comparisons++
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{algorithm.name}</h1>
          <Badge variant="secondary">String matching</Badge>
          <div className="ml-auto">
            <ShareButton />
          </div>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">{algorithm.description}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>Time: <span className="font-mono text-foreground">{algorithm.timeComplexity}</span></span>
          <span>Space: <span className="font-mono text-foreground">{algorithm.spaceComplexity}</span></span>
          <span>Char comparisons so far: <span className="font-mono text-foreground">{comparisons}</span></span>
          <span>Matches: <span className="font-mono text-foreground">[{matches.join(', ')}]</span></span>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-card p-3">
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Text
          <input
            value={text}
            onChange={(e) => setUrl({ text: e.target.value })}
            className="w-72 rounded-md border bg-background px-2 py-1 font-mono text-sm text-foreground"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          Pattern
          <input
            value={pattern}
            onChange={(e) => setUrl({ pattern: e.target.value })}
            className="w-44 rounded-md border bg-background px-2 py-1 font-mono text-sm text-foreground"
          />
        </label>
      </div>

      <StringStrip text={t} pattern={p} step={currentStep} />

      {currentStep.table && <StringAuxTable table={currentStep.table} pattern={p} />}

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
        <LegendSwatch className="bg-amber-400 dark:bg-amber-500" label="Comparing" />
        <LegendSwatch className="bg-emerald-400/60" label="Matched this alignment" />
        <LegendSwatch className="bg-rose-500" label="Mismatch" />
        <LegendSwatch className="bg-emerald-500" label="Confirmed match" />
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
