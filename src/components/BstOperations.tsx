import { useEffect, useMemo, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PlaybackControls } from '@/components/PlaybackControls'
import { PseudocodePanel } from '@/components/PseudocodePanel'
import { ShareButton } from '@/components/ShareButton'
import { TreeCanvas } from '@/components/TreeCanvas'
import { useStepPlayer } from '@/hooks/useStepPlayer'
import { useUrlState } from '@/hooks/useUrlState'
import { cn } from '@/lib/utils'
import {
  buildBst,
  height,
  layoutBst,
  levelOrderValues,
  type Bst,
} from '@/algorithms/tree/bst'
import {
  balanceOp,
  deleteOp,
  insertOp,
  opPseudocode,
  searchOp,
  type BstOpKind,
} from '@/algorithms/tree/bstOps'
import type { TreeStep } from '@/types/tree'

const DEFAULT_VALUES = [50, 30, 70, 20, 40, 60, 80, 35, 65]

function parseValues(raw: string): number[] {
  return raw
    .split(/[\s,]+/)
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n) && n >= 0 && n <= 999)
}

export function BstOperations() {
  const [{ values: valuesParam }, setUrl] = useUrlState({ values: DEFAULT_VALUES.join(',') })

  const [tree, setTree] = useState<Bst>(() => buildBst(parseValues(valuesParam)))
  const [opKind, setOpKind] = useState<BstOpKind>('insert')
  const [opSteps, setOpSteps] = useState<TreeStep[] | null>(null)
  const [status, setStatus] = useState('Build a tree, then run insert / delete / search / balance.')
  const [input, setInput] = useState('45')
  const [buildInput, setBuildInput] = useState(DEFAULT_VALUES.join(', '))

  // Re-hydrate when the URL param changes from outside (shared link).
  const lastParam = useRef(valuesParam)
  useEffect(() => {
    if (valuesParam !== lastParam.current) {
      lastParam.current = valuesParam
      setTree(buildBst(parseValues(valuesParam)))
      setOpSteps(null)
    }
  }, [valuesParam])

  const idleStep = useMemo<TreeStep>(
    () => ({ snapshot: layoutBst(tree), line: -1, message: '' }),
    [tree],
  )
  const steps = opSteps ?? [idleStep]
  const player = useStepPlayer(steps.length)

  useEffect(() => {
    player.reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opSteps, idleStep])

  const currentStep = steps[player.index] ?? steps[0]

  const commit = (next: Bst) => {
    setTree(next)
    lastParam.current = levelOrderValues(next).join(',')
    setUrl({ values: lastParam.current })
  }

  const run = (kind: BstOpKind) => {
    setOpKind(kind)
    const value = parseValues(input)[0]
    if (kind !== 'balance' && value === undefined) {
      setStatus('Enter a value first.')
      return
    }
    const result =
      kind === 'insert'
        ? insertOp(tree, value)
        : kind === 'delete'
          ? deleteOp(tree, value)
          : kind === 'search'
            ? searchOp(tree, value)
            : balanceOp(tree)
    setOpSteps(result.steps)
    setStatus(result.summary)
    if (kind !== 'search') commit(result.tree)
  }

  const rebuild = () => {
    const vals = parseValues(buildInput)
    const next = buildBst(vals)
    commit(next)
    setOpSteps(null)
    setStatus(`Built a tree from ${vals.length} values.`)
  }

  const h = height(tree.root)
  const minH = Math.ceil(Math.log2(tree.size + 1))
  const balanced = h <= minH

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">BST Operations</h1>
          <Badge variant={balanced ? 'default' : 'secondary'}>
            height {h} · {balanced ? 'balanced' : `${h - minH} over optimal`}
          </Badge>
          <div className="ml-auto">
            <ShareButton />
          </div>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground">
          A live binary search tree you drive yourself. Insert and delete walk the tree step by
          step; delete handles the leaf, one-child, and two-children (in-order successor) cases.
          Balance rebuilds the tree from its sorted values.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border bg-card p-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-muted-foreground">Build from</label>
          <input
            value={buildInput}
            onChange={(e) => setBuildInput(e.target.value)}
            placeholder="50, 30, 70, 20, 40"
            className="min-w-56 flex-1 rounded-md border bg-background px-2 py-1 font-mono text-sm"
          />
          <Button variant="outline" size="sm" onClick={rebuild}>Build</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            inputMode="numeric"
            className="w-20 rounded-md border bg-background px-2 py-1 font-mono text-sm"
          />
          <Button size="sm" onClick={() => run('insert')}>Insert</Button>
          <Button size="sm" variant="outline" onClick={() => run('delete')}>Delete</Button>
          <Button size="sm" variant="outline" onClick={() => run('search')}>Search</Button>
          <div className="mx-1 h-5 w-px bg-border" />
          <Button size="sm" variant="outline" onClick={() => run('balance')}>Balance</Button>
        </div>
      </div>

      <TreeCanvas step={currentStep} />

      <p className="min-h-5 text-sm">
        <span className="text-muted-foreground">{currentStep.message || status}</span>
      </p>

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
        <h2 className="mb-2 text-sm font-semibold text-foreground">
          Pseudocode — <span className="font-normal capitalize text-muted-foreground">{opKind}</span>
        </h2>
        <PseudocodePanel lines={opPseudocode[opKind]} activeLine={currentStep.line} />
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <LegendSwatch className="bg-violet-500 dark:bg-violet-400" label="Current node" />
        <LegendSwatch className="bg-blue-400/70 dark:bg-blue-500/60" label="On the active path" />
        <LegendSwatch className="bg-emerald-500" label="Match" />
      </div>
    </div>
  )
}

function LegendSwatch({ className, label }: { className: string; label: string }) {
  return (
    <span className={cn('flex items-center gap-1.5')}>
      <span className={`inline-block size-3 rounded-sm ${className}`} />
      {label}
    </span>
  )
}
