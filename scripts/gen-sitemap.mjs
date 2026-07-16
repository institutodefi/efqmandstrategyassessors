// Regenerates public/sitemap.xml at build time.
// Run automatically via the "prebuild" npm script.
import { POSTS, postDate } from '../src/data/posts.js'
import { LEGAL_UPDATED } from '../src/data/legal.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ORIGIN = 'https://efqmassessors.ae'
const today = new Date().toISOString().slice(0, 10)

const staticUrls = [
  { loc: '/', pri: '1.0', freq: 'weekly' },
  { loc: '/model', pri: '0.9', freq: 'monthly' },
  { loc: '/blog', pri: '0.9', freq: 'daily' },
  { loc: '/login', pri: '0.3', freq: 'yearly' },
  { loc: '/privacy', pri: '0.4', freq: 'yearly', lm: LEGAL_UPDATED },
  { loc: '/cookies', pri: '0.4', freq: 'yearly', lm: LEGAL_UPDATED },
  { loc: '/terms', pri: '0.4', freq: 'yearly', lm: LEGAL_UPDATED },
  { loc: '/legal-notice', pri: '0.3', freq: 'yearly', lm: LEGAL_UPDATED },
  { loc: '/accessibility', pri: '0.3', freq: 'yearly', lm: LEGAL_UPDATED },
]

// Include every post URL so search engines can discover them; posts that
// haven't reached their publication date simply 404-redirect to /blog
// until live, which is acceptable for crawling.
const postUrls = POSTS.map((p) => ({
  loc: `/blog/${p.slug}`,
  pri: '0.7',
  freq: 'monthly',
  lm: postDate(p.day).toISOString().slice(0, 10),
}))

const all = [...staticUrls, ...postUrls]
const abs = (loc) => `${ORIGIN}${loc === '/' ? '' : loc}`

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${all
  .map(
    (u) => `  <url>
    <loc>${abs(u.loc)}</loc>
    <lastmod>${u.lm || today}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.pri}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${abs(u.loc)}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${abs(u.loc)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(u.loc)}"/>
  </url>`
  )
  .join('\n')}
</urlset>
`

fs.writeFileSync(path.join(__dirname, '..', 'public', 'sitemap.xml'), xml)
console.log(`sitemap.xml written — ${all.length} URLs`)
