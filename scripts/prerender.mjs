// ------------------------------------------------------------------
// Prerender social meta tags.
//
// The site is a single-page app: every URL is served the same index.html.
// Social crawlers (LinkedIn, Facebook, WhatsApp, X, Slack) do NOT run
// JavaScript, so the per-page tags our React useSeo() hook sets are never
// seen — every shared link fell back to the generic homepage card.
//
// This writes a real HTML file per route (dist/<path>/index.html) with the
// correct title, description and og:image baked in. Netlify serves static
// files before applying the SPA redirect, so crawlers get the right tags
// while humans still land in the React app.
// ------------------------------------------------------------------
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { POSTS, postDate } from '../src/data/posts.js'
import { SERVICES } from '../src/data/services.js'
import { ORBITAL } from '../src/data/orbital.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = join(__dirname, '..', 'dist')
const ORIGIN = 'https://efqmassessors.ae'

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const shell = readFileSync(join(DIST, 'index.html'), 'utf8')

/** Replace a meta/title/link value in the HTML shell. */
function setTag(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html
}

function render({ title, desc, url, image, type = 'website', published, jsonld }) {
  let h = shell
  const img = image.startsWith('http') ? image : ORIGIN + image

  h = setTag(h, /<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
  h = setTag(h, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${esc(desc)}" />`)
  h = setTag(h, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${esc(title)}" />`)
  h = setTag(h, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${esc(desc)}" />`)
  h = setTag(h, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${esc(url)}" />`)
  h = setTag(h, /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:image" content="${esc(img)}" />`)
  h = setTag(h, /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:image:alt" content="${esc(title)}" />`)
  h = setTag(h, /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:type" content="${type}" />`)
  h = setTag(h, /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${esc(title)}" />`)
  h = setTag(h, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${esc(desc)}" />`)
  h = setTag(h, /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:image" content="${esc(img)}" />`)
  h = setTag(h, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${esc(url)}" />`)

  // Facebook legacy + explicit image metadata (helps LinkedIn pick the card fast)
  h = h.replace('</head>',
    `  <meta property="og:image:secure_url" content="${esc(img)}" />\n  </head>`)

  // article timestamp for blog posts
  if (published) {
    h = h.replace('</head>',
      `  <meta property="article:published_time" content="${published}" />\n` +
      `  <meta property="article:author" content="Alejandro San Nicolás" />\n` +
      `  <meta property="article:section" content="EFQM & ISO excellence" />\n  </head>`)
  }
  if (jsonld) {
    h = h.replace('</head>',
      `  <script type="application/ld+json">${JSON.stringify(jsonld)}</script>\n  </head>`)
  }
  return h
}

function write(routePath, html) {
  const dir = routePath === '/' ? DIST : join(DIST, routePath)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
}

const OG_DEFAULT = '/brand/og-image.png'
const en = SERVICES.en
const orb = ORBITAL.en
const routes = []

// ---- static pages -------------------------------------------------
routes.push({
  path: '/services', title: en.assessments.seoTitle, desc: en.assessments.seoDesc, image: OG_DEFAULT,
})
routes.push({
  path: '/services/assessments', title: en.assessments.seoTitle, desc: en.assessments.seoDesc, image: OG_DEFAULT,
})
routes.push({
  path: '/services/consultancy', title: en.consultancy.seoTitle, desc: en.consultancy.seoDesc, image: OG_DEFAULT,
})
routes.push({
  path: '/services/training', title: en.training.seoTitle, desc: en.training.seoDesc, image: OG_DEFAULT,
})
routes.push({
  path: '/orbital360', title: orb.seoTitle, desc: orb.seoDesc, image: '/orbital360/og-orbital360.png',
})
routes.push({
  path: '/model',
  title: 'The EFQM Model 2025 explained — EFQM and Strategy Assessors',
  desc: 'A clear guide to the EFQM Model 2025: three blocks, seven criteria and 32 sub-criteria, with assessor commentary. In English and Arabic.',
  image: OG_DEFAULT,
})
routes.push({
  path: '/blog',
  title: 'The 120-day EFQM & ISO excellence programme — Blog',
  desc: 'A daily post by Alejandro San Nicolás: 90 days on the EFQM Model 2025, then 30 real-world ISO cases. In English and Arabic.',
  image: OG_DEFAULT,
})
routes.push({
  path: '/request',
  title: 'Request a service — EFQM and Strategy Assessors',
  desc: 'Request an EFQM assessment, consultancy or training. We reply within one business day.',
  image: OG_DEFAULT,
})

// ---- blog posts (only those already published) --------------------
const today = new Date()
let postCount = 0
for (const p of POSTS) {
  const d = postDate(p.day)
  if (d > today) continue
  postCount++
  routes.push({
    path: `/blog/${p.slug}`,
    title: `${p.title} — EFQM Blog`,
    desc: p.body.split('\n\n')[0].slice(0, 200),
    image: `/blog/${p.slug}.png`,
    type: 'article',
    published: d.toISOString(),
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.body.split('\n\n')[0].slice(0, 200),
      image: `${ORIGIN}/blog/${p.slug}.png`,
      datePublished: d.toISOString(),
      dateModified: d.toISOString(),
      inLanguage: 'en',
      mainEntityOfPage: `${ORIGIN}/blog/${p.slug}`,
      author: {
        '@type': 'Person',
        name: 'Alejandro San Nicolás',
        url: `${ORIGIN}/`,
      },
      publisher: {
        '@type': 'Organization',
        name: 'EFQM and Strategy Assessors FZCO',
        logo: { '@type': 'ImageObject', url: `${ORIGIN}/brand/wordmark-full.png` },
      },
      isPartOf: { '@type': 'Blog', name: 'The 120-day EFQM & ISO excellence programme',
                  url: `${ORIGIN}/blog` },
    },
  })
}

for (const r of routes) {
  write(r.path, render({
    title: r.title, desc: r.desc, url: ORIGIN + r.path,
    image: r.image, type: r.type, published: r.published, jsonld: r.jsonld,
  }))
}

console.log(`prerender: ${routes.length} routes (${postCount} published posts) with social meta tags`)
