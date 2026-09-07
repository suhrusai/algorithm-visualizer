import { useCallback, useEffect, useMemo, useState } from 'react'
import { Eraser, Grid2x2, Waypoints } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PlaybackControls } from '@/components/PlaybackControls'
import { PseudocodePanel } from '@/components/PseudocodePanel'
import { ShareButton } from '@/components/ShareButton'
import { GridCanvas, type PaintAction } from '@/components/GridCanvas'
import { useStepPlayer } from '@/hooks/useStepPlayer'
import { useUrlState } from '@/hooks/useUrlState'
import { randomSeed } from '@/lib/rng'
import { cn } from '@/lib/utils'
import {
  DEFAULT_COLS,
  DEFAULT_ROWS,
  decodeTerrain,
  encodeTerrain,
  generateMaze,
} from '@/algorithms/pathfinding'
import type { Grid, PathAlgorithm, Terrain } from '@/types/pathfinding'

interface Props {
  algorithm: PathAlgorithm
}

const ROWS = DEFAULT_ROWS
const COLS = DEFAULT_COLS
const CELLS = ROWS * COLS
const START = Math.floor(ROWS / 2) * COLS + 2
const GOAL = Math.floor(ROWS / 2) * COLS + (COLS - 3)

export function PathfindingVisualizer({ algorithm }: Props) {
  const [{ terrain: terrainParam, start, goal, speed }, setUrl] = useUrlState({
    terrain: '',
    start: START,
    goal: GOAL,
    speed: 1,
  })

  const [terrain, setTerrain] = useState<Terrain[]>(() =>
    terrainParam ? decodeTerrain(terrainParam, CELLS) : Array<Terrain>(CELLS).fill(0),
  )

  // Re-hydrate terrain when the URL param changes from outside (e.g. opening a shared link).
  useEffect(() => {
    if (terrainParam) setTerrain(decodeTerrain(terrainParam, CELLS))
  }, [terrainParam])

  const grid: Grid = useMemo(
    () => ({ rows: ROWS, cols: COLS, terrain, start, goal }),
    [terrain, start, goal],
  )

  const steps = useMemo(() => algorithm.run(grid), [algorithm, grid])
  const player = useStepPlayer(steps.length, speed)

  useEffect(() => {
    player.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm.id, grid])

  useEffect(() => {
    if (player.speed !== speed) setUrl({ speed: player.speed })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.speed])

  const currentStep = steps[player.index] ?? steps[0]
  const finalStep = steps[steps.length - 1]
  const [brush, setBrush] = useState<'wall' | 'weight'>('wall')

  const commit = useCallback(
    (next: Terrain[], patch?: { start?: number; goal?: number }) => {
      setTerrain(next)
      setUrl({ terrain: encodeTerrain(next), ...patch })
    },
    [setUrl],
  )

  const handlePaint = (action: PaintAction) => {
    if (action.kind === 'move') {
      setUrl(action.endpoint === 'start' ? { start: action.index } : { goal: action.index })
      return
    }
    if (terrain[action.index] === action.value) return
    const next = terrain.slice()
    next[action.index] = action.value
    commit(next)
  }

  const clearWalls = () => commit(Array<Terrain>(CELLS).fill(0))
  const makeMaze = () => {
    const maze = generateMaze(ROWS, COLS, randomSeed())
    commit(maze.terrain, { start: maze.start, goal: maze.goal })
  }

  const editable = !player.playing

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{algorithm.name}</h1>
          {algorithm.heuristic && <Badge>Heuristic-guided</Badge>}
          {algorithm.weighted && <Badge variant="secondary">Weight-aware</Badge>}
          <div className="ml-auto">
            <ShareButton />
          </div>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">{algorithm.description}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>Time: <span className="font-mono text-foreground">{algorithm.timeComplexity}</span></span>
          <span>Space: <span className="font-mono text-foreground">{algorithm.spaceComplexity}</span></span>
          <span>Cells expanded: <span className="font-mono text-foreground">{finalStep.visited.length}</span></span>
          <span>
            Path length:{' '}
            <span className="font-mono text-foreground">
              {finalStep.path ? finalStep.path.length - 1 : '—'}
            </span>
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3">
        <span className="text-xs text-muted-foreground">Brush</span>
        <Button
          variant={brush === 'wall' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setBrush('wall')}
          className="gap-1.5"
        >
          <Grid2x2 className="size-3.5" /> Wall
        </Button>
        <Button
          variant={brush === 'weight' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setBrush('weight')}
          className="gap-1.5"
        >
          <Waypoints className="size-3.5" /> Weight ×5
        </Button>
        <div className="mx-1 h-5 w-px bg-border" />
        <Button variant="outline" size="sm" onClick={makeMaze} className="gap-1.5">
          <Grid2x2 className="size-3.5" /> Maze
        </Button>
        <Button variant="outline" size="sm" onClick={clearWalls} className="gap-1.5">
          <Eraser className="size-3.5" /> Clear
        </Button>
        <span className="ml-1 text-[11px] text-muted-foreground">
          Drag to draw · drag the green/red cells to move start/goal
        </span>
      </div>

      <GridCanvas grid={grid} step={currentStep} editable={editable} brush={brush} onPaint={handlePaint} />

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
        <LegendSwatch className="bg-emerald-600" label="Start" />
        <LegendSwatch className="bg-rose-500" label="Goal" />
        <LegendSwatch className="bg-foreground/80" label="Wall" />
        <LegendSwatch className="bg-orange-300/50 dark:bg-orange-400/30" label="Weight ×5" />
        <LegendSwatch className="bg-amber-300/70 dark:bg-amber-500/50" label="Frontier" />
        <LegendSwatch className="bg-sky-300/60 dark:bg-sky-500/40" label="Expanded" />
        <LegendSwatch className={cn('bg-emerald-400 dark:bg-emerald-500')} label="Path" />
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
