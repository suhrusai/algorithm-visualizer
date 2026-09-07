// Post-build: write a real 200-status index.html for every route, with the
// route's own <title>/description/canonical/OG baked in, plus sitemap.xml.
// GitHub Pages then serves each route as a static file instead of the 404
// fallback, so crawlers and share scrapers see correct metadata without JS.
import { createServer } from 'vite'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

const server = await createServer({
  root,
  logLevel: 'silent',
  server: { middlewareMode: true },
  appType: 'custom',
})
const { metaForPath, allRoutes, SITE_URL } = await server.ssrLoadModule('/src/lib/seo.ts')
await server.close()

const template = readFileSync(join(dist, 'index.html'), 'utf8')
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function render(route) {
  const { title, description } = metaForPath(route)
  const url = SITE_URL + (route === '/' ? '/' : route + '/')
  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(
      /(<meta name="description" content=")[\s\S]*?(")/,
      `$1${esc(description)}$2`,
    )
    .replace(/(<link rel="canonical" href=")[\s\S]*?(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[\s\S]*?(")/, `$1${esc(title)}$2`)
    .replace(/(<meta property="og:description" content=")[\s\S]*?(")/, `$1${esc(description)}$2`)
    .replace(/(<meta property="og:url" content=")[\s\S]*?(")/, `$1${url}$2`)
    .replace(/(<meta name="twitter:title" content=")[\s\S]*?(")/, `$1${esc(title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[\s\S]*?(")/, `$1${esc(description)}$2`)
}

const routes = allRoutes()
for (const route of routes) {
  const html = render(route)
  if (route === '/') {
    writeFileSync(join(dist, 'index.html'), html)
  } else {
    const dir = join(dist, route)
    mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'index.html'), html)
  }
}

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((r) => {
    const loc = SITE_URL + (r === '/' ? '/' : r + '/')
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`
  })
  .join('\n')}
</urlset>
`
writeFileSync(join(dist, 'sitemap.xml'), sitemap)

console.log(`prerendered ${routes.length} routes + sitemap.xml`)
