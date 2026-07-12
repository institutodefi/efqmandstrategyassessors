# efqmassessors.ae

Corporate website for **EFQM and Strategy Assessors FZCO** (Dubai Silicon Oasis, Trade License 59735) — part of the TuConsultor Group.

Stack: **Vite + React** · **Supabase** (auth + database) · **Netlify** (hosting).

---

## What's in the site

| Route | Content |
|---|---|
| `/` | Home — hero, stats, about, **7 services** (incl. ISO Consultancy), RADAR method, recognition path, team, client-zone teaser, contact form |
| `/model` | **The EFQM Model** — three Why/How/What blocks, plus an interactive explorer of all 7 criteria and their 32 sub-criteria (description + assessor's commentary) |
| `/blog` | **The 90-day excellence programme** — one post a day by Alejandro San Nicolás, published automatically on schedule |
| `/blog/:slug` | Single post with prev/next navigation |
| `/login` | Client sign-in / sign-up / password reset |
| `/portal` | Protected client zone (documents, RADAR progress, assessor contact) |

**Bilingual: English + Arabic.** The language toggle in the navigation switches the whole interface and sets `dir="rtl"` for Arabic. The choice persists in `localStorage`. Blog posts themselves are published in English (a note tells Arabic readers this).

---

## The blog programme

- 90 posts live in `src/data/posts.js`, each ~200 words, mapped to a specific sub-criterion of the EFQM Model 2025.
- `BLOG_START = '2026-07-13'` is **Day 1**. Day *n* publishes on `BLOG_START + (n-1)` days; the last post lands on **10 October 2026**.
- Publication is date-driven at render time: the blog shows only posts whose date is today or earlier, and teases the next one. No CMS or cron job needed.
- To change the launch date, edit `BLOG_START`. To edit or add a post, edit the array — `day`, `ref`, `slug`, `title`, `body` (paragraphs separated by a blank line).

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
  i18n.jsx            EN/AR dictionaries + language provider (sets dir=rtl)
  data/model.js       EFQM Model 2025 — 7 criteria, 32 sub-criteria (EN + AR)
  data/posts.js       The 90 blog posts + publication schedule
  components/Chrome.jsx   Nav, Footer, HeroWave, RadarWheel, icons
  pages/              Home, Model, Blog, Post, Login, Portal
  styles/global.css   Design tokens + all styles (RTL-safe logical properties)
supabase/schema.sql   Tables + Row Level Security policies
netlify.toml          SPA redirects + asset caching
```
