import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { ChevronDown, Menu, Moon, Sun, Swords, X } from 'lucide-react'
import { categories } from '@/data/categories'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/useTheme'

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggle } = useTheme()

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
        <button
          className="rounded-md p-2 hover:bg-accent md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-7 items-end gap-0.5 rounded bg-primary/10 p-1">
            <span className="h-2 w-1 rounded-sm bg-indigo-500" />
            <span className="h-3.5 w-1 rounded-sm bg-violet-500" />
            <span className="h-2.5 w-1 rounded-sm bg-pink-500" />
          </span>
          Algo Visualizer
        </Link>
        <button
          onClick={toggle}
          className="ml-auto rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
        <a
          href="https://github.com/suhrusai/algorithm-visualizer"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-md p-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.2.67.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
          </svg>
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </header>

      <div className="flex flex-1">
        <aside
          className={cn(
            'w-64 shrink-0 border-r bg-background p-4',
            'md:block',
            mobileOpen ? 'fixed inset-y-14 left-0 z-10 block overflow-y-auto bg-background' : 'hidden',
          )}
        >
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

function Sidebar({ onNavigate }: { onNavigate: () => void }) {
  return (
    <nav className="flex flex-col gap-4">
      {categories.map((category) => (
        <CategoryGroup key={category.id} category={category} onNavigate={onNavigate} />
      ))}
      <NavLink
        to="/race"
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-foreground hover:bg-accent',
            isActive && 'bg-accent',
          )
        }
      >
        <Swords className="size-4" />
        Algorithm Race
      </NavLink>
    </nav>
  )
}

function CategoryGroup({
  category,
  onNavigate,
}: {
  category: (typeof categories)[number]
  onNavigate: () => void
}) {
  const [open, setOpen] = useState(true)

  return (
    <div>
      <button
        className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium text-foreground hover:bg-accent"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex items-center gap-2">
          {category.name}
          {!category.available && (
            <span className="rounded-full border px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground">
              soon
            </span>
          )}
        </span>
        {category.algorithms.length > 0 && (
          <ChevronDown className={cn('size-4 transition-transform', open ? 'rotate-0' : '-rotate-90')} />
        )}
      </button>
      {open && category.algorithms.length > 0 && (
        <div className="ml-2 mt-1 flex flex-col gap-0.5 border-l pl-3">
          {category.algorithms.map((algo) => (
            <NavLink
              key={algo.id}
              to={algo.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground',
                  isActive && 'bg-accent font-medium text-foreground',
                )
              }
            >
              {algo.name}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}
