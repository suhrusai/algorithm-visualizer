import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE_URL, metaForPath } from '@/lib/seo'

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/** Keeps <title>, description, canonical, and Open Graph tags in step with the route. */
export function RouteMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const { title, description } = metaForPath(pathname)
    // Match the trailing-slash form of the prerendered / sitemap URLs.
    const url = SITE_URL + (pathname === '/' ? '/' : pathname.replace(/\/?$/, '/'))

    document.title = title
    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', url)
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    setLink('canonical', url)
  }, [pathname])

  return null
}
