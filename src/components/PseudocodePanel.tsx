import { cn } from '@/lib/utils'

interface PseudocodePanelProps {
  lines: string[]
  activeLine: number
}

export function PseudocodePanel({ lines, activeLine }: PseudocodePanelProps) {
  return (
    <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-4 text-sm leading-relaxed">
      <code className="font-mono">
        {lines.map((line, idx) => (
          <div
            key={idx}
            className={cn(
              'rounded px-2 py-0.5 whitespace-pre',
              idx === activeLine && 'bg-amber-400/20 text-foreground font-medium',
              idx !== activeLine && 'text-muted-foreground',
              line === '' && 'h-2',
            )}
          >
            {line || ' '}
          </div>
        ))}
      </code>
    </pre>
  )
}
