import { useEffect } from 'react'

const ORIGIN = 'https://efqmassessors.ae'

function upsertMeta(attr, key, content) {
  if (content == null) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href, hreflang) {
  const sel = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`
  let el = document.head.querySelector(sel)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    if (hreflang) el.setAttribute('hreflang', hreflang)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Set per-page SEO tags. `path` is the route path beginning with "/".
 * The same URL serves both languages (language is a client preference),
 * so hreflang points at the same canonical URL for en, ar and x-default.
 */
export function useSeo(title, description, path = '/', image = null, keywords = null) {
  useEffect(() => {
    const url = ORIGIN + (path === '/' ? '' : path)
    if (title) document.title = title
    upsertMeta('name', 'description', description)
    if (keywords) upsertMeta('name', 'keywords', keywords)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    if (image) {
      const abs = image.startsWith('http') ? image : ORIGIN + image
      upsertMeta('property', 'og:image', abs)
      upsertMeta('name', 'twitter:image', abs)
    }
    upsertLink('canonical', url)
    upsertLink('alternate', url, 'en')
    upsertLink('alternate', url, 'ar')
    upsertLink('alternate', url, 'x-default')
  }, [title, description, path, image, keywords])
}


/** Inject a per-page JSON-LD block (replaced on route change). */
export function useJsonLd(obj, id = 'page-jsonld') {
  useEffect(() => {
    if (!obj) return
    let el = document.getElementById(id)
    if (!el) {
      el = document.createElement('script')
      el.type = 'application/ld+json'
      el.id = id
      document.head.appendChild(el)
    }
    el.textContent = JSON.stringify(obj)
    return () => { el && el.remove() }
  }, [JSON.stringify(obj), id]) // eslint-disable-line react-hooks/exhaustive-deps
}
