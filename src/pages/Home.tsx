import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { categories } from '@/data/categories'

export function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Algorithm Visualizer</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Watch classic algorithms run step by step, side by side with their pseudocode. Sorting,
          searching, graph, tree, and grid-pathfinding visualizations — plus a{' '}
          <Link className="text-primary hover:underline" to="/race">race mode</Link> — are all
          ready to explore.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <Card key={category.id} className={!category.available ? 'opacity-60' : undefined}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {category.name}
                {!category.available && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
                    Coming soon
                  </span>
                )}
              </CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {category.available ? (
                <Link
                  to={category.path}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Explore {category.algorithms.length} algorithms
                  <ArrowRight className="size-4" />
                </Link>
              ) : (
                <span className="text-sm text-muted-foreground">Not implemented yet.</span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
