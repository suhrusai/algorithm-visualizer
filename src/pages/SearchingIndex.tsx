import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { searchingAlgorithms } from '@/algorithms/searching'

export function SearchingIndex() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Searching Algorithms</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Pick an algorithm to watch it hunt for a target value in an array, with the search
          window and eliminated elements highlighted as it narrows in.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {searchingAlgorithms.map((algo) => (
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
                to={`/searching/${algo.id}`}
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
