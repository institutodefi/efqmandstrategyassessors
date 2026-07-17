// Regenerates public/rss.xml at build time (runs via the prebuild script).
// Produces an RSS 2.0 feed of the published blog posts, newest first, so
// customers can subscribe and receive each day's post in their reader.
import { POSTS, postDate, AUTHOR } from '../src/data/posts.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ORIGIN = 'https://efqmassessors.ae'
const MAX_ITEMS = 60

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;')

// Only include posts whose publication date has arrived.
const now = new Date()
now.setHours(23, 59, 59, 999)

const items = POSTS
  .filter((p) => postDate(p.day) <= now)
  .sort((a, b) => b.day - a.day)
  .slice(0, MAX_ITEMS)
  .map((p) => {
    const url = `${ORIGIN}/blog/${p.slug}`
    const img = `${ORIGIN}/blog/${p.slug}.png`
    const summary = p.body.split('\n\n')[0]
    const pub = postDate(p.day).toUTCString()
    return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <dc:creator>${esc(AUTHOR)}</dc:creator>
      <category>${esc(p.ref)}</category>
      <pubDate>${pub}</pubDate>
      <enclosure url="${img}" type="image/png" length="0" />
      <media:content url="${img}" medium="image" type="image/png" />
      <media:thumbnail url="${img}" />
      <description>${esc(summary)}</description>
    </item>`
  })
  .join('\n')

const lastBuild = new Date().toUTCString()

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:media="http://search.yahoo.com/mrss/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>EFQM and Strategy Assessors — Blog</title>
    <link>${ORIGIN}/blog</link>
    <atom:link href="${ORIGIN}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Daily insights on the EFQM Model 2025 and the ISO standards, by Alejandro San Nicolás.</description>
    <language>en</language>
    <copyright>© EFQM and Strategy Assessors FZCO</copyright>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <ttl>720</ttl>
${items}
  </channel>
</rss>
`

fs.writeFileSync(path.join(__dirname, '..', 'public', 'rss.xml'), xml)
console.log(`rss.xml written — ${items ? items.split('<item>').length - 1 : 0} items`)
