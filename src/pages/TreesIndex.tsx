import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { treeAlgorithms } from '@/algorithms/tree'

export function TreesIndex() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Tree Algorithms</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Build and walk a binary search tree. Watch how insertion places each value and how the
          traversals produce their characteristic orderings.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {treeAlgorithms.map((algo) => (
          <Card key={algo.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {algo.name}
                <Badge variant="outline" className="font-mono text-xs">
                  {algo.timeComplexity.average}
                </Badge>
              </CardTitle>
              <CardDescription>{algo.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                to={`/trees/${algo.id}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Visualize
                <ArrowRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
