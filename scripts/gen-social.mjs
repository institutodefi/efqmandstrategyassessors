// Genera las imágenes sociales del blog con texto atractivo.
//   public/blog/<slug>.png     → 1200×630 (OG / link preview / RSS enclosure)
//   public/social/<slug>.png   → 1080×1350 (Instagram 4:5, gancho en grande)
// Uso:  node scripts/gen-social.mjs            (todas)
//       node scripts/gen-social.mjs <slug>     (una)
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { POSTS } from '../src/data/posts.js'

const BG = '#0d1421', INK = '#f4f7f5', MINT = '#52d3a2', MINT2 = '#8ef2cd', MUT = '#9db3ab'
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/* Primer enunciado del post como gancho, recortado con elegancia. */
function hook(body, max = 150) {
  const first = body.split('\n')[0].trim()
  const m = first.match(/^.*?[.!?](?=\s|$)/)
  let h = (m ? m[0] : first).trim()
  if (h.length > max) h = h.slice(0, max).replace(/\s+\S*$/, '') + '…'
  return h
}

/* Ajuste de línea aproximado por presupuesto de caracteres. */
function wrap(text, perLine, maxLines) {
  const words = text.split(/\s+/), lines = []
  let cur = ''
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > perLine && cur) { lines.push(cur); cur = w }
    else cur = (cur + ' ' + w).trim()
    if (lines.length === maxLines) break
  }
  if (lines.length < maxLines && cur) lines.push(cur)
  if (lines.length === maxLines && cur && lines[maxLines - 1] !== cur)
    lines[maxLines - 1] = lines[maxLines - 1].replace(/\s+\S*$/, '') + '…'
  return lines
}

const orb = (cx, cy, r) => `
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#orb)"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${r * 1.85}" ry="${r * 0.68}" fill="none"
    stroke="${MINT}" stroke-opacity="0.8" stroke-width="${r * 0.14}"
    transform="rotate(-18 ${cx} ${cy})"/>
  <circle cx="${cx + r * 1.62}" cy="${cy - r * 0.55}" r="${r * 0.24}" fill="${MINT2}"/>`

const defs = `<defs>
  <radialGradient id="orb" cx="35%" cy="30%" r="75%">
    <stop offset="0%" stop-color="${MINT2}"/><stop offset="55%" stop-color="${MINT}"/>
    <stop offset="100%" stop-color="#1d8f68"/>
  </radialGradient>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#101b2e"/><stop offset="100%" stop-color="${BG}"/>
  </linearGradient>
</defs>`

const F = 'DejaVu Sans'

/* -------- 1200×630: tarjeta OG renovada (gancho + título) -------- */
function ogSvg(p) {
  const h = wrap(esc(hook(p.body, 135)), 38, 3)
  const t = wrap(esc(p.title), 44, 2)
  const hookY = 205
  const titleY = hookY + h.length * 62 + 66
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">${defs}
  <rect width="1200" height="630" fill="url(#bg)"/>
  <ellipse cx="1120" cy="-40" rx="420" ry="300" fill="${MINT}" opacity="0.06"/>
  ${orb(1080, 120, 42)}
  <rect x="72" y="88" width="150" height="42" rx="21" fill="none" stroke="${MINT}" stroke-width="2"/>
  <text x="147" y="116" text-anchor="middle" font-family="${F}" font-size="21" font-weight="bold" fill="${MINT}">DAY ${p.day} / 120</text>
  ${h.map((l, i) => `<text x="72" y="${hookY + i * 62}" font-family="${F}" font-size="50" font-weight="bold" fill="${INK}">${l}</text>`).join('')}
  <rect x="72" y="${titleY - 44}" width="64" height="5" rx="2.5" fill="${MINT}"/>
  ${t.map((l, i) => `<text x="72" y="${titleY + i * 40}" font-family="${F}" font-size="30" fill="${MINT2}">${l}</text>`).join('')}
  <text x="72" y="566" font-family="${F}" font-size="24" fill="${MUT}">Alejandro San Nicolás · EFQM Certified Assessor</text>
  <text x="1128" y="566" text-anchor="end" font-family="${F}" font-size="24" font-weight="bold" fill="${MINT}">efqmassessors.ae</text>
</svg>`
}

/* -------- 1080×1350 (Instagram 4:5): el gancho como protagonista -------- */
function igSvg(p) {
  const h = wrap(esc(hook(p.body, 165)), 26, 5)
  const t = wrap(esc(p.title), 38, 2)
  const hookY = 460
  const titleY = hookY + h.length * 78 + 92
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350">${defs}
  <rect width="1080" height="1350" fill="url(#bg)"/>
  <ellipse cx="1040" cy="60" rx="460" ry="360" fill="${MINT}" opacity="0.07"/>
  ${orb(540, 190, 62)}
  <rect x="440" y="308" width="200" height="52" rx="26" fill="none" stroke="${MINT}" stroke-width="2.5"/>
  <text x="540" y="343" text-anchor="middle" font-family="${F}" font-size="26" font-weight="bold" fill="${MINT}">DAY ${p.day} / 120</text>
  ${h.map((l, i) => `<text x="540" y="${hookY + i * 78}" text-anchor="middle" font-family="${F}" font-size="62" font-weight="bold" fill="${INK}">${l}</text>`).join('')}
  <rect x="500" y="${titleY - 58}" width="80" height="6" rx="3" fill="${MINT}"/>
  ${t.map((l, i) => `<text x="540" y="${titleY + i * 48}" text-anchor="middle" font-family="${F}" font-size="36" fill="${MINT2}">${l}</text>`).join('')}
  <text x="540" y="1230" text-anchor="middle" font-family="${F}" font-size="28" fill="${MUT}">Alejandro San Nicolás · EFQM Certified Assessor</text>
  <text x="540" y="1282" text-anchor="middle" font-family="${F}" font-size="30" font-weight="bold" fill="${MINT}">efqmassessors.ae · blog EFQM diario</text>
</svg>`
}

mkdirSync('public/blog', { recursive: true })
mkdirSync('public/social', { recursive: true })

const only = process.argv[2]
const list = only ? POSTS.filter(p => p.slug === only) : POSTS
let n = 0
for (const p of list) {
  await sharp(Buffer.from(ogSvg(p))).png({ compressionLevel: 9 }).toFile(`public/blog/${p.slug}.png`)
  await sharp(Buffer.from(igSvg(p))).png({ compressionLevel: 9 }).toFile(`public/social/${p.slug}.png`)
  n++
}
console.log(`social images: ${n} posts × 2 formats (blog/ 1200×630 · social/ 1080×1350)`)
