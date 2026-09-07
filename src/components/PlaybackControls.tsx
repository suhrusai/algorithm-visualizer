import { Pause, Play, Shuffle, SkipBack, SkipForward, StepBack, StepForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

interface PlaybackControlsProps {
  playing: boolean
  onToggle: () => void
  onStepBack: () => void
  onStepForward: () => void
  onReset: () => void
  onShuffle?: () => void
  shuffleTitle?: string
  index: number
  stepCount: number
  onSeek: (value: number) => void
  speed: number
  onSpeedChange: (value: number) => void
  disabled?: boolean
}

export function PlaybackControls({
  playing,
  onToggle,
  onStepBack,
  onStepForward,
  onReset,
  onShuffle,
  shuffleTitle = 'New random array',
  index,
  stepCount,
  onSeek,
  speed,
  onSpeedChange,
  disabled,
}: PlaybackControlsProps) {
  const isFirst = index === 0
  const isLast = index >= stepCount - 1

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-3">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onReset} disabled={disabled} title="Reset to start">
          <SkipBack className="size-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onStepBack} disabled={disabled || isFirst} title="Previous step">
          <StepBack className="size-4" />
        </Button>
        <Button size="icon" onClick={onToggle} disabled={disabled} title={playing ? 'Pause' : 'Play'}>
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </Button>
        <Button variant="outline" size="icon" onClick={onStepForward} disabled={disabled || isLast} title="Next step">
          <StepForward className="size-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onSeek(stepCount - 1)} disabled={disabled || isLast} title="Skip to end">
          <SkipForward className="size-4" />
        </Button>
        {onShuffle && (
          <>
            <div className="mx-1 h-6 w-px bg-border" />
            <Button variant="outline" size="icon" onClick={onShuffle} disabled={disabled} title={shuffleTitle}>
              <Shuffle className="size-4" />
            </Button>
          </>
        )}

        <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          <span className="tabular-nums">
            Step {Math.min(index + 1, stepCount)} / {stepCount}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="w-14 shrink-0 text-xs text-muted-foreground">Progress</span>
        <Slider
          value={[index]}
          min={0}
          max={Math.max(stepCount - 1, 0)}
          step={1}
          onValueChange={([v]) => onSeek(v)}
          disabled={disabled}
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="w-14 shrink-0 text-xs text-muted-foreground">Speed</span>
        <Slider
          value={[speed]}
          min={0.25}
          max={4}
          step={0.25}
          onValueChange={([v]) => onSpeedChange(v)}
        />
        <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">{speed}x</span>
      </div>
    </div>
  )
}
