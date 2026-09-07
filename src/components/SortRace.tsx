import { useEffect, useMemo } from 'react'
import { Trophy } from 'lucide-react'
import { PlaybackControls } from '@/components/PlaybackControls'
import { ShareButton } from '@/components/ShareButton'
import { SortBars } from '@/components/SortBars'
import { Slider } from '@/components/ui/slider'
import { useStepPlayer } from '@/hooks/useStepPlayer'
import { useUrlState } from '@/hooks/useUrlState'
import { randomSeed, seededArray } from '@/lib/rng'
import { parseCustomArray } from '@/lib/parseArray'
import { sortingAlgorithms } from '@/algorithms/sorting'
import { cn } from '@/lib/utils'
import type { SortStep } from '@/types/sorting'

const DEFAULT_PICKS = ['bubble-sort', 'quick-sort', 'merge-sort', 'heap-sort']

interface Lane {
  id: string
  name: string
  steps: SortStep[]
  finishIndex: number
}

function countUpTo(steps: SortStep[], upTo: number) {
  let comparisons = 0
  let writes = 0
  for (let i = 0; i <= upTo && i < steps.length; i++) {
    if (steps[i].comparing?.length) comparisons++
    if (steps[i].swapping?.length) writes++
  }
  return { comparisons, writes }
}

export function SortRace() {
  const [{ seed, size, picks, speed, custom }, setUrl] = useUrlState({
    seed: 7,
    size: 18,
    picks: DEFAULT_PICKS.join(','),
    speed: 1,
    custom: '',
  })

  const selected = useMemo(() => picks.split(',').filter(Boolean), [picks])
  const customArray = useMemo(() => (custom ? parseCustomArray(custom) : null), [custom])
  const usingCustom = !!customArray && customArray.length >= 2
  const initialArray = useMemo(
    () => (usingCustom ? customArray! : seededArray(seed, size)),
    [usingCustom, customArray, seed, size],
  )

  const lanes = useMemo<Lane[]>(() => {
    return sortingAlgorithms
      .filter((a) => selected.includes(a.id))
      .map((a) => {
        const steps = a.run(initialArray)
        return { id: a.id, name: a.name, steps, finishIndex: steps.length - 1 }
      })
  }, [selected, initialArray])

  const maxSteps = Math.max(1, ...lanes.map((l) => l.steps.length))
  const player = useStepPlayer(maxSteps, speed)

  useEffect(() => {
    player.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialArray, picks])

  useEffect(() => {
    if (player.speed !== speed) setUrl({ speed: player.speed })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.speed])

  const ranking = [...lanes].sort((a, b) => a.finishIndex - b.finishIndex)
  const rankOf = (id: string) => ranking.findIndex((l) => l.id === id) + 1

  const toggle = (id: string) => {
    const next = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id]
    if (next.length < 2 || next.length > 4) return
    setUrl({ picks: next.join(',') })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Algorithm Race</h1>
          <div className="ml-auto">
            <ShareButton />
          </div>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Run several sorting algorithms on the identical array and watch them go. The step
          slider drives every lane at once; lanes that finish early simply hold their sorted
          result. Ranking is by number of visualization steps to finish.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 rounded-lg border bg-card p-3">
        {sortingAlgorithms.map((a) => {
          const on = selected.includes(a.id)
          return (
            <button
              key={a.id}
              onClick={() => toggle(a.id)}
              className={cn(
                'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                on ? 'border-primary bg-primary/10 text-foreground' : 'text-muted-foreground hover:bg-accent',
              )}
            >
              {a.name}
            </button>
          )
        })}
        <span className="ml-1 self-center text-[11px] text-muted-foreground">pick 2–4</span>
      </div>

      <PlaybackControls
        playing={player.playing}
        onToggle={player.toggle}
        onStepBack={player.stepBackward}
        onStepForward={player.stepForward}
        onReset={player.reset}
        onShuffle={() => setUrl({ seed: randomSeed(), custom: '' })}
        index={player.index}
        stepCount={maxSteps}
        onSeek={player.seek}
        speed={player.speed}
        onSpeedChange={player.setSpeed}
      />

      <div className="flex flex-col gap-3 rounded-lg border bg-card p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-24 shrink-0 text-xs text-muted-foreground">Custom array</span>
          <input
            defaultValue={custom}
            key={custom}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setUrl({ custom: (e.target as HTMLInputElement).value.trim() })
            }}
            placeholder="e.g. 5, 2, 9, 1, 7  —  Enter to apply to every lane"
            className="min-w-56 flex-1 rounded-md border bg-background px-2 py-1 font-mono text-sm text-foreground"
          />
          {usingCustom && (
            <button
              onClick={() => setUrl({ custom: '', seed: randomSeed() })}
              className="text-xs text-primary hover:underline"
            >
              use random
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="w-24 shrink-0 text-xs text-muted-foreground">Array size</span>
          <Slider
            value={[usingCustom ? customArray!.length : size]}
            min={6}
            max={40}
            step={1}
            disabled={usingCustom}
            onValueChange={([v]) => setUrl({ size: v, seed: randomSeed(), custom: '' })}
          />
          <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
            {usingCustom ? customArray!.length : size}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {lanes.map((lane) => {
          const idx = Math.min(player.index, lane.steps.length - 1)
          const step = lane.steps[idx]
          const done = player.index >= lane.finishIndex
          const { comparisons, writes } = countUpTo(lane.steps, idx)
          const rank = rankOf(lane.id)
          return (
            <div key={lane.id} className="flex flex-col gap-2 rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2">
                <span className="font-medium">{lane.name}</span>
                {done && (
                  <span
                    className={cn(
                      'flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                      rank === 1
                        ? 'bg-amber-400/20 text-amber-600 dark:text-amber-400'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {rank === 1 && <Trophy className="size-3" />}#{rank}
                  </span>
                )}
                <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                  {comparisons} cmp · {writes} writes · {lane.steps.length} steps
                </span>
              </div>
              <SortBars step={step} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
