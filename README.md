# efqmassessors.ae

Corporate website for **EFQM and Strategy Assessors FZCO** (Dubai Silicon Oasis, Trade License 59735) — part of the TuConsultor Group.

Stack: **Vite + React** · **Supabase** (auth + database) · **Netlify** (hosting).

---

## What's in the site

| Route | Content |
|---|---|
| `/` | Home — hero, stats, about, **8 services** (incl. Consultancy as a Service & ISO), **ISO norms portfolio**, **three pricing models**, RADAR method, 4-stage recognition path, team, newsletter, contact form |
| `/model` | **The EFQM Model** — three Why/How/What blocks, plus an interactive explorer of all 7 criteria and their 32 sub-criteria (description + assessor's commentary) |
| `/blog` | **The 120-day programme** — 90 posts on the EFQM Model + 30 ISO standards cases, one a day, published automatically on schedule |
| `/blog/:slug` | Single post with prev/next navigation, a per-article **contact form + WhatsApp** CTA |
| `/privacy` · `/cookies` · `/terms` · `/legal-notice` · `/accessibility` | **Legal & compliance** — GDPR/UAE-PDPL-aligned documents, bilingual, with per-page table of contents |
| `/login` | Client sign-in / sign-up / password reset |
| `/portal` | Protected client zone (documents, RADAR progress, assessor contact) |
| `*` | Custom 404 page |

**Fully bilingual: English + Arabic.** The `English / العربية` switch in the navigation changes the entire site — interface, the EFQM Model content, and all 90 blog posts — and sets `dir="rtl"` for Arabic. The choice persists in `localStorage`.

---

## Compliance & privacy

The site ships with a complete legal layer, written to align with the **UAE Personal Data Protection Law** (Federal Decree-Law No. 45 of 2021) and the **EU GDPR** for EU/EEA data subjects. All documents are bilingual (EN/AR) and live in `src/data/legal.js` — edit them there and both languages update from one place.

- **Privacy Policy** (`/privacy`) — data controller identity, legal bases, purposes, retention periods, international transfers, and the full list of data-subject rights (access, rectification, erasure, restriction, portability, withdrawal of consent).
- **Cookie Policy** (`/cookies`) — the site uses **only strictly necessary storage** (`lang`, `cookie-consent`, and the Supabase auth session). No analytics, advertising, profiling or third-party tracking.
- **Terms of Use**, **Legal Notice** (imprint), **Accessibility Statement** (WCAG 2.1 AA target).
- **Cookie notice** — an informational banner (`src/components/CookieNotice.jsx`) shown once and remembered; since no optional cookies are set, it records acknowledgement rather than gating tracking.
- **Consent checkbox** on the contact form — submission is blocked until the visitor agrees to the Privacy Policy, and the agreement is required client-side.

**One action item before launch:** create the `privacy@efqmassessors.ae` mailbox (or alias to `hello@`), since the policies direct data-subject requests there. To change the "last updated" date shown on every legal page, edit `LEGAL_UPDATED` in `src/data/legal.js`.

### Cookie consent manager

The banner (`src/components/CookieNotice.jsx`) offers **Accept all / Reject all / Customise**. "Customise" opens a preferences modal with four categories — Strictly necessary (always on), Preferences, Analytics and Marketing — stored as a JSON consent record in `localStorage`. A **Cookie settings** link in the footer reopens it any time. The analytics/marketing toggles are wired and ready for when you add such tools; nothing tracks until a visitor opts in.

## Home-page sections added

- **Dynamic About visual** — an animated SVG "excellence orbit" (the 7 EFQM criteria orbiting the spiral core, coloured by block) replaces the static licence seal. Lives in `ExcellenceOrbit` in `src/components/Chrome.jsx`.
- **Consultancy as a Service** — a service card describing the AI-boosted subscription model.
- **ISO norms portfolio** (`#norms`) — six standards (ISO 9001, 14001, 27001, 45001, 42001, 56001), each with description and differential sub-processes, mirroring the Consultify.Pro architecture.
- **Three pricing models** (`#models`) — Relationship (€350), Involvement (€625, "most chosen"), Commitment (€800), from the "AI-boosted · Consultant as a Service" model. Prices and features live in the `models` block of `src/i18n.jsx`.
- **4-stage recognition path** — GAP Analysis → Self-Assessment → Support · Action Plan → Support · External Recognition.
- **Newsletter** — Brevo-ready sign-up (see `BREVO-SETUP.md`).

## WhatsApp & newsletter

- **WhatsApp button** (`src/components/WhatsAppButton.jsx`) — a floating chat button on every page, pointing to **+971 50 736 9400** (`wa.me/971507369400`) with a pre-filled, bilingual message and a dismissible greeting bubble.
- **Per-post contact + WhatsApp** (`src/components/PostContact.jsx`) — every blog article ends with a compact contact form (submits to the Supabase `inquiries` table, tagged with the article) and a WhatsApp button pre-filled with the article title.
- **RSS feed** — `public/rss.xml`, regenerated on every build (`scripts/gen-rss.mjs`) with the published posts, newest first. Linked from the blog page, the footer and `index.html` (`<link rel="alternate" type="application/rss+xml">`). Customers can subscribe in any reader.
- **Flashing client-zone button** — the nav "Client zone" button pulses to draw attention (respects `prefers-reduced-motion`).
- **Brevo newsletter** (`src/components/Newsletter.jsx`) — posts to a Brevo hosted form via a hidden iframe (double opt-in). Set `VITE_BREVO_FORM_ACTION` to switch it on; until then it falls back to the Supabase `subscribers` table. Full instructions in **`BREVO-SETUP.md`**.

## SEO, performance & security

- **Per-page metadata** — every route sets its own `<title>`, description, canonical URL and `og:` tags via the `useSeo` hook (`src/lib/seo.js`), plus `hreflang` alternates (en / ar / x-default).
- **`sitemap.xml`** is regenerated on every build (`npm run prebuild` → `scripts/gen-sitemap.mjs`) and lists all pages and blog posts with `lastmod`. **`robots.txt`** points to it and disallows `/portal` and `/login`.
- **Structured data** — `ProfessionalService` JSON-LD in `index.html`; **web manifest** and `theme-color` for installability.
- **Security headers** (`netlify.toml`) — Content-Security-Policy, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy`, and a `Permissions-Policy` that disables geolocation/camera/mic and opts out of FLoC.
- **Code-splitting** — the landing page bundle is ~69 kB gzip; the heavy blog data and secondary routes load on demand.
- **Accessibility** — semantic HTML, keyboard-operable nav, visible focus states, `aria` labels, and full RTL support.

---

## The blog programme

- 120 posts live in `src/data/posts.js` (English) and `src/data/posts_ar.js` (Arabic, keyed by slug), each ~170–200 words. Days 1–90 map to the EFQM Model 2025; days 91–120 are real-world cases across the six ISO standards (9001, 14001, 27001, 45001, 42001, 56001).
- `BLOG_START = '2026-07-13'` is **Day 1**. Day *n* publishes on `BLOG_START + (n-1)` days; the last post lands on **9 November 2026** (day 120).
- Publication is date-driven at render time: the blog shows only posts whose date is today or earlier, and teases the next one. No CMS or cron job needed.
- To change the launch date, edit `BLOG_START`. To edit or add a post, edit the array — `day`, `ref`, `slug`, `title`, `body` (paragraphs separated by a blank line) — and add the matching Arabic entry under the same slug in `posts_ar.js`. If an Arabic translation is missing, the site falls back to English for that post.

---

## Setup

### 1. Supabase

Project URL is already set: `https://wiraonfdufycdcqgurpx.supabase.co`

1. In the Supabase dashboard, open **SQL Editor** and run `supabase/schema.sql`. It creates `profiles`, `documents` and `inquiries`, all with Row Level Security enabled.
2. Go to **Project Settings → API** and copy the **anon / public** key.
3. Create a `.env` file at the project root:

```
VITE_SUPABASE_URL=https://wiraonfdufycdcqgurpx.supabase.co
VITE_SUPABASE_ANON_KEY=paste-your-anon-key-here
```

The site degrades gracefully without these: the contact form falls back to an email link and the client zone shows a "not configured" notice.

### 2. Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build into dist/
npm run preview  # preview the build
```

### 3. Deploy to Netlify

1. Push this folder to a Git repository and connect it in Netlify (or drag-drop the `dist/` folder).
2. Build command `npm run build`, publish directory `dist`.
3. In **Site settings → Environment variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. `netlify.toml` already handles SPA redirects and long-cache headers for brand assets.

### 4. Domain

Point `efqmassessors.ae` at Netlify (Netlify DNS, or an `ALIAS`/`CNAME` to the Netlify subdomain). Netlify provisions the TLS certificate automatically.

### 5. Client accounts

Users self-register at `/login`. To pre-approve clients instead, disable public sign-ups in **Supabase → Authentication → Providers → Email** and invite users from the dashboard. Deliverables shown in the portal come from the `documents` table.

---

## Brand

- **Typeface:** Rubik (300–900), the sole typeface across the site.
- **Palette:** ink `#0E1730` · teal `#0E4C60` · mint `#1FA98A` · glow `#58E0B4` · paper `#F5FAF9`.
- **Assets:** `public/brand/` — spiral, wordmarks, seal, favicon.

## Project structure

```
src/
  i18n.jsx                EN/AR dictionaries + language provider (sets dir=rtl)
  App.jsx                 Routes (code-split) + cookie notice
  lib/seo.js              Per-page title / description / canonical / hreflang
  lib/supabase.js         Supabase client (null-safe when unconfigured)
  data/model.js           EFQM Model 2025 — 7 criteria, 32 sub-criteria (EN + AR)
  data/posts.js           The 90 blog posts (EN) + publication schedule + localisePost
  data/posts_ar.js        The 90 blog posts (AR), keyed by slug
  data/legal.js           Privacy, Cookies, Terms, Legal Notice, Accessibility (EN + AR)
  components/Chrome.jsx    Nav, Footer (with legal column), HeroWave, RadarWheel, icons
  components/CookieNotice.jsx   Informational, remembered consent banner
  pages/                  Home, Model, Blog, Post, Legal, Login, Portal, NotFound
  styles/global.css       Design tokens + all styles (RTL-safe logical properties)
scripts/gen-sitemap.mjs   Build-time sitemap generator (runs on prebuild)
public/robots.txt         Crawler rules → sitemap
public/sitemap.xml        Generated; all pages + posts with hreflang
public/site.webmanifest   PWA manifest
supabase/schema.sql       Tables + Row Level Security policies
netlify.toml              SPA redirects, security headers (CSP/HSTS), caching
index.html                Meta, Open Graph, JSON-LD, noscript fallback
```

## Brand & social assets

- **Link preview (Open Graph) image** — `public/brand/og-image.png` (1200×630), a branded card used when the site is shared on WhatsApp, LinkedIn, X, etc. Referenced via `og:image` / `twitter:image` in `index.html`.
- **Favicon set** — `public/favicon.ico` (multi-size) plus `favicon.png`, `apple-touch-icon.png` and `icon-192/512.png` under `public/brand/`, wired into `index.html` and `site.webmanifest`.
- **Client-zone button** carries a padlock icon and an attention pulse.
- **Cookie consent** appears as a centred pop-up (dimmed backdrop) on first visit — Accept all / Reject all / Customise — reopenable from the footer.
- The team section currently features Alejandro San Nicolás; Rosa García Sánchez is kept in `src/i18n.jsx` but not rendered (change `[t.team.alex]` back to `[t.team.alex, t.team.rosa]` in `src/pages/Home.jsx` to show her again).

## Social, sharing & localisation

- **Social profiles** — `SOCIAL` array in `src/lib/site.js` (LinkedIn, X, Instagram, Facebook), rendered as icons in the footer. **Update the URLs with the real handles.**
- **Automatic social posting** — a static site can't post to networks itself; connect the RSS feed to Zapier / Make / Buffer to auto-publish each new post. Full instructions in `SOCIAL-AUTOMATION.md`. The RSS feed now includes each post's preview image (`<enclosure>` + `<media:content>`).
- **Per-post share bar** — every blog post has share buttons (LinkedIn, X, Facebook, WhatsApp, copy-link).
- **Blog preview images** — 120 branded 1200×630 PNGs in `public/blog/<slug>.png`, generated for each post. Used as the blog-card thumbnail, the post hero image, and the per-post link-preview (OG) image.
- **Country detection + local currency** — `src/context/CurrencyContext.jsx` looks up the visitor's country by IP (via `ipwho.is`) once and shows prices in the local currency (Dubai → AED), with a manual currency selector on the pricing section. Rates and the country→currency map live in `src/lib/site.js` (EUR base; EUR→AED ≈ 4.20). Only the resolved currency is stored (never the IP); noted in the privacy policy. The geolocation domain is allow-listed in the CSP (`netlify.toml`).

## Services (single page, three subtabs)

All service content lives on **one page** with three subtabs, in this order:

| Tab | Route | Contents |
| --- | --- | --- |
| Assessments | `/services/assessments` (default) | Strategic Consulting, EFQM Model Assessment, High-Value Support, C-Class Coaching |
| Consultancy as a Service | `/services/consultancy` | CaaS explanation + three pricing models (local currency) + the digital AI environment + ISO consultancy across six standards + 5-step engagement flow |
| Workshops & Training | `/services/training` | How a workshop runs + eight programmes with duration and audience |

- The nav carries a single **Services** entry; `/services` opens on Assessments.
- Legacy URLs `/assessments`, `/consultancy` and `/training` still resolve and open the
  matching tab, so older links and indexed pages keep working.
- Each tab has its own `<title>`, description, keywords and canonical URL, and all four
  routes are in `sitemap.xml`.
- Content is in `src/data/services.js` (bilingual EN/AR); pricing tiers and ISO cards are
  still sourced from `src/i18n.jsx` so there is one source of truth.

### Visual language

The service pages use a deliberately compact scale: a short dark page head, a sticky
subtab bar, lean two-column service blocks (rail + text), and small bordered cards
(`.mini-card`, `.flow`, `.prog-row`) instead of large padded panels. Type sits at
~0.95rem body / 1.24rem item headings so pages read densely without feeling cramped.

### Bespoke service icons

`BrandIcon` in `src/components/Chrome.jsx` holds three custom-drawn icons (not from a
generic icon set), each pairing a teal→mint gradient with a solid mint accent:

- `assess` — a maturity dial: scored arcs with a rising needle (diagnosis / RADAR)
- `caas` — a continuous loop around an AI spark (ongoing, AI-boosted service)
- `train` — an easel with a rising results line (workshops that change outcomes)

They are referenced by the `icon` key in `services.hub` (`src/i18n.jsx`) and sized by
`.hub-glyph` in the stylesheet.

### Pricing layout

The three models render as **horizontal rows** (`.model-rows` / `.model-row`): name and
tagline, price, a two-column feature list and the CTA across a single band, collapsing to
stacked blocks below 1080px. The "Involvement" tier keeps the dark featured treatment.

### Service CTA

Each tab's closing CTA offers three routes to contact: the contact form, a **WhatsApp**
button (pre-filled, bilingual message) and a link to **Alejandro's LinkedIn profile**
(`https://www.linkedin.com/in/alejandrosnicolas/`).

### Two actions on every service

Every service on the site drives to exactly two things, via the shared
`ServiceActions` component (`src/components/ServiceActions.jsx`):

1. **Request** (document icon) → `/request?service=<name>`, which opens the form page
   with that service already selected.
2. **WhatsApp** → `wa.me/971507369400` with the message pre-filled as
   *"Hello, I am interested in &lt;service&gt;…"* (Arabic when the site is in Arabic).

They appear on all four Assessments services, both Consultancy services, each of the three
pricing models (tagged with the tier name), and all eight training programmes — plus the
closing CTA on each tab.

### `/request` form page

A dedicated page (`src/pages/Request.jsx`) with the full enquiry form, a service dropdown
listing every service, a WhatsApp shortcut, and the office/phone/email details. It reads
`?service=` to preselect, submits to the Supabase `inquiries` table (tagging the record
with the chosen service) and falls back to `mailto:`.

### LinkedIn

Alejandro's LinkedIn profile appears in exactly one place: under his bio in the team
section on the home page (`.person-li`, from `team.alex.linkedin` in `src/i18n.jsx`).
It was removed from the service CTAs.

## Analytics — Google Tag Manager (consent-gated)

Container **GTM-MGHZNN9K**, in `src/lib/gtm.js`.

The GTM snippet is **not** placed directly in `index.html`. Instead:

1. On boot, Google **Consent Mode** defaults are pushed as *denied*
   (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`,
   `functionality_storage`, `personalization_storage`).
2. GTM is injected **only** once the visitor allows the analytics or marketing
   category in the cookie banner. Reject-all loads nothing at all.
3. Changing the choice later (footer → Cookie settings) pushes a `consent update`;
   granting for the first time injects the container.
4. Because the site is a SPA, route changes push a `page_view` event to the
   dataLayer — configure a GTM trigger on that event rather than relying on
   container-load page views.

The `<noscript>` iframe is in `index.html` for visitors with JavaScript disabled
(where the consent manager cannot run either).

`netlify.toml` CSP was extended for `googletagmanager.com` / `google-analytics.com`
(`script-src`, `img-src`, `connect-src`, `frame-src`).

**Legal:** the privacy and cookie policies previously stated that the site set no
analytics or advertising cookies. Both documents (EN + AR) were rewritten to disclose
GTM, the optional categories and the consent basis, and `LEGAL_UPDATED` was bumped to
2026-07-19.
