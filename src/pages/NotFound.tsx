import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="text-4xl font-semibold">404</h1>
      <p className="text-muted-foreground">This page doesn't exist.</p>
      <Button asChild>
        <Link to="/">Back home</Link>
      </Button>
    </div>
  )
}
