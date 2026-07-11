# efqmassessors.ae

Corporate website + client zone for **EFQM and Strategy Assessors FZCO**.

- **Front end:** Vite + React, single Rubik variable typeface, brand palette derived from the spiral logo.
- **Auth & data:** Supabase (email/password auth, profiles, documents, contact inquiries — all behind Row Level Security).
- **Hosting:** Netlify (SPA redirects preconfigured in `netlify.toml`).

The site works fully **without** Supabase configured (the contact form falls back to a mailto link and the client zone shows a notice), so you can deploy the marketing site first and wire up the client zone whenever you're ready.

---

## 1 · Run locally

```bash
npm install
npm run dev          # http://localhost:5173
```

## 2 · Create the Supabase project (client zone)

1. Go to [supabase.com](https://supabase.com) → **New project** (any name, e.g. `efqmassessors`). Choose a region close to Dubai (e.g. `ap-south-1` Mumbai or `eu-central-1` Frankfurt).
2. Open **SQL Editor → New query**, paste the contents of `supabase/schema.sql`, and click **Run**. This creates:
   - `profiles` — auto-created per user on sign-up
   - `documents` — deliverables each client can read (only their own)
   - `inquiries` — contact-form submissions (write-only for visitors)
3. Go to **Authentication → Providers → Email** and confirm email sign-ups are enabled. Under **Authentication → URL Configuration**, set:
   - Site URL: `https://efqmassessors.ae`
   - Redirect URLs: add `https://efqmassessors.ae/login` and `http://localhost:5173/login`
4. Copy from **Project Settings → API**:
   - Project URL → `VITE_SUPABASE_URL`
   - `anon` `public` key → `VITE_SUPABASE_ANON_KEY`

For local development, copy `.env.example` to `.env` and paste both values.

> **Sharing documents with a client:** add rows to `documents` in the Table Editor with `owner` = the client's user id (visible under Authentication → Users). They appear instantly in that client's portal.

## 3 · Deploy on Netlify

1. Push this folder to a Git repository (GitHub/GitLab/Bitbucket).
2. In [Netlify](https://app.netlify.com): **Add new site → Import an existing project** and pick the repo. Build settings are read automatically from `netlify.toml` (`npm run build`, publish `dist`).
3. Under **Site configuration → Environment variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. SPA routing (`/login`, `/portal`) is already handled by the redirect rule.

## 4 · Point efqmassessors.ae at Netlify

In Netlify: **Domain management → Add a domain** → `efqmassessors.ae`. Then, at your domain registrar, either:

- switch the domain's nameservers to the four Netlify DNS nameservers shown (recommended — Netlify then manages DNS + automatic HTTPS), or
- keep your current DNS and add the records Netlify shows (an `A`/`ALIAS` record for the apex and a `CNAME` for `www`).

HTTPS certificates are provisioned automatically once DNS propagates.

---

## Project structure

```
├── index.html                 Rubik variable font + meta
├── netlify.toml               build, SPA redirect, asset caching
├── public/brand/              optimized logo assets (wordmarks, seal, spiral)
├── src/
│   ├── styles/global.css      design tokens + all styling
│   ├── lib/supabase.js        Supabase client (env-driven, optional)
│   ├── context/AuthContext.jsx
│   ├── components/Chrome.jsx  Nav, Footer, HeroWave, RadarWheel, icons
│   └── pages/                 Home · Login · Portal
└── supabase/schema.sql        tables, triggers, RLS policies
```

## Brand tokens

| Token | Value | Source |
|---|---|---|
| Ink | `#0E1730` | navy plate of the white wordmark |
| Teal | `#0E4C60` | seal ring / wordmark |
| Mint | `#1FA98A` | ribbon mid tone |
| Glow | `#58E0B4` | ribbon highlight |
| Type | Rubik 300–900 (variable) | brand typeface — weight carries hierarchy |
