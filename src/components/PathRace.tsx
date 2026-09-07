import { useCallback, useEffect, useMemo, useState } from 'react'
import { Eraser, Grid2x2, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PlaybackControls } from '@/components/PlaybackControls'
import { ShareButton } from '@/components/ShareButton'
import { GridCanvas, type PaintAction } from '@/components/GridCanvas'
import { MultiGridCanvas, type RaceLane } from '@/components/MultiGridCanvas'
import { useStepPlayer } from '@/hooks/useStepPlayer'
import { useUrlState } from '@/hooks/useUrlState'
import { randomSeed } from '@/lib/rng'
import { cn } from '@/lib/utils'
import {
  DEFAULT_COLS,
  DEFAULT_ROWS,
  decodeTerrain,
  defaultGrid,
  encodeTerrain,
  generateMaze,
  pathfindingAlgorithms,
} from '@/algorithms/pathfinding'
import type { Grid, PathStep, Terrain } from '@/types/pathfinding'

const ROWS = DEFAULT_ROWS
const COLS = DEFAULT_COLS
const CELLS = ROWS * COLS
const DEFAULT = defaultGrid()
const DEFAULT_PICKS = ['bfs', 'dijkstra', 'astar', 'greedy']

const LANE_COLORS: Record<string, RaceLane['colors'] & { swatch: string }> = {
  bfs: { visited: 'rgba(56,189,248,0.35)', frontier: 'rgba(56,189,248,0.7)', path: '#0284c7', swatch: 'bg-sky-500' },
  dijkstra: { visited: 'rgba(167,139,250,0.35)', frontier: 'rgba(167,139,250,0.75)', path: '#7c3aed', swatch: 'bg-violet-500' },
  astar: { visited: 'rgba(251,146,60,0.35)', frontier: 'rgba(251,146,60,0.8)', path: '#ea580c', swatch: 'bg-orange-500' },
  greedy: { visited: 'rgba(244,114,182,0.35)', frontier: 'rgba(244,114,182,0.8)', path: '#db2777', swatch: 'bg-pink-500' },
}

interface Lane {
  id: string
  name: string
  steps: PathStep[]
  expanded: number
  pathLen: number
  reached: boolean
}

export function PathRace() {
  const [{ terrain: terrainParam, start, goal, picks, speed }, setUrl] = useUrlState({
    terrain: '',
    start: DEFAULT.start,
    goal: DEFAULT.goal,
    picks: DEFAULT_PICKS.join(','),
    speed: 1,
  })

  const [terrain, setTerrain] = useState<Terrain[]>(() =>
    terrainParam ? decodeTerrain(terrainParam, CELLS) : DEFAULT.terrain,
  )
  useEffect(() => {
    if (terrainParam) setTerrain(decodeTerrain(terrainParam, CELLS))
  }, [terrainParam])

  const [brush, setBrush] = useState<'wall' | 'weight'>('wall')
  const selected = useMemo(() => picks.split(',').filter(Boolean), [picks])

  const grid: Grid = useMemo(() => ({ rows: ROWS, cols: COLS, terrain, start, goal }), [terrain, start, goal])

  const lanes = useMemo<Lane[]>(() => {
    return pathfindingAlgorithms
      .filter((a) => selected.includes(a.id))
      .map((a) => {
        const steps = a.run(grid)
        const last = steps[steps.length - 1]
        return {
          id: a.id,
          name: a.name,
          steps,
          expanded: last.visited.length,
          pathLen: last.path ? last.path.length - 1 : Infinity,
          reached: !!last.path,
        }
      })
  }, [selected, grid])

  const maxSteps = Math.max(1, ...lanes.map((l) => l.steps.length))
  const player = useStepPlayer(maxSteps, speed)

  useEffect(() => {
    player.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, picks])

  useEffect(() => {
    if (player.speed !== speed) setUrl({ speed: player.speed })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.speed])

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

  const ranking = [...lanes].sort((a, b) =>
    a.reached !== b.reached
      ? Number(b.reached) - Number(a.reached)
      : a.pathLen !== b.pathLen
        ? a.pathLen - b.pathLen
        : a.expanded - b.expanded,
  )
  const rankOf = (id: string) => ranking.findIndex((l) => l.id === id) + 1

  const toggle = (id: string) => {
    const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]
    if (next.length < 2 || next.length > 4) return
    setUrl({ picks: next.join(',') })
  }

  const editing = player.index === 0 && !player.playing
  const raceLanes: RaceLane[] = lanes.map((lane) => ({
    id: lane.id,
    name: lane.name,
    colors: LANE_COLORS[lane.id] ?? LANE_COLORS.bfs,
    step: lane.steps[Math.min(player.index, lane.steps.length - 1)],
  }))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Pathfinding Race</h1>
          <div className="ml-auto">
            <ShareButton />
          </div>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Run BFS, Dijkstra, A*, and Greedy Best-First on the same grid at once — each racer's
          explored cells and path are drawn in its own colour. Step off zero to start the race;
          reset to zero to edit the maze. Ranked by shortest path found, then by fewest cells
          explored.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card p-3">
        {pathfindingAlgorithms.map((a) => {
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
        <div className="mx-1 h-5 w-px bg-border" />
        <Button
          variant={brush === 'wall' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setBrush('wall')}
        >
          Wall
        </Button>
        <Button
          variant={brush === 'weight' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setBrush('weight')}
        >
          Weight ×5
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => {
          const m = generateMaze(ROWS, COLS, randomSeed())
          commit(m.terrain, { start: m.start, goal: m.goal })
        }}>
          <Grid2x2 className="size-3.5" /> Maze
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => commit(Array<Terrain>(CELLS).fill(0))}>
          <Eraser className="size-3.5" /> Clear
        </Button>
      </div>

      {editing ? (
        <GridCanvas
          grid={grid}
          step={{ visited: [], frontier: [], line: 0, message: '' }}
          editable
          brush={brush}
          onPaint={handlePaint}
        />
      ) : (
        <MultiGridCanvas grid={grid} lanes={raceLanes} />
      )}

      <PlaybackControls
        playing={player.playing}
        onToggle={player.toggle}
        onStepBack={player.stepBackward}
        onStepForward={player.stepForward}
        onReset={player.reset}
        index={player.index}
        stepCount={maxSteps}
        onSeek={player.seek}
        speed={player.speed}
        onSpeedChange={player.setSpeed}
      />

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {lanes.map((lane) => {
          const c = LANE_COLORS[lane.id] ?? LANE_COLORS.bfs
          const stepped = lane.steps[Math.min(player.index, lane.steps.length - 1)]
          const done = player.index >= lane.steps.length - 1
          const rank = rankOf(lane.id)
          return (
            <div key={lane.id} className="flex flex-col gap-1 rounded-lg border bg-card p-3 text-sm">
              <div className="flex items-center gap-1.5">
                <span className={cn('size-3 rounded-sm', c.swatch)} />
                <span className="font-medium">{lane.name}</span>
                {done && (
                  <span
                    className={cn(
                      'ml-auto flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                      rank === 1 ? 'bg-amber-400/20 text-amber-600 dark:text-amber-400' : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {rank === 1 && <Trophy className="size-3" />}#{rank}
                  </span>
                )}
              </div>
              <span className="text-xs tabular-nums text-muted-foreground">
                {stepped.visited.length} explored · path {lane.reached ? lane.pathLen : '—'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
