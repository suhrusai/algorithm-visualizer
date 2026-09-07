// Regenerates public/sitemap.xml from the route table. Run: node scripts/gen-sitemap.mjs
import { writeFileSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = 'https://suhrusai.github.io/algorithm-visualizer'

const idsFrom = (dir) =>
  readdirSync(join(root, 'src/algorithms', dir))
    .filter((f) => f.endsWith('.ts') && !['index.ts'].includes(f))
    .flatMap((f) => {
      const src = readFileSync(join(root, 'src/algorithms', dir, f), 'utf8')
      return [...src.matchAll(/^\s*id:\s*'([a-z-]+)'/gm)].map((m) => m[1])
    })

const staticRoutes = [
  '/',
  '/sorting',
  '/searching',
  '/graph',
  '/trees',
  '/trees/operations',
  '/pathfinding',
  '/race',
]

const dynamic = [
  ['/sorting/', idsFrom('sorting')],
  ['/searching/', idsFrom('searching')],
  ['/graph/', idsFrom('graph')],
  ['/trees/', idsFrom('tree')],
  ['/pathfinding/', idsFrom('pathfinding')],
]

const routes = [
  ...staticRoutes,
  ...dynamic.flatMap(([prefix, ids]) => [...new Set(ids)].map((id) => prefix + id)),
]

const today = new Date().toISOString().slice(0, 10)
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((r) => `  <url>\n    <loc>${BASE}${r === '/' ? '/' : r}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
  .join('\n')}
</urlset>
`

writeFileSync(join(root, 'public/sitemap.xml'), xml)
console.log(`wrote public/sitemap.xml with ${routes.length} routes`)
