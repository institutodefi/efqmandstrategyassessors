# Automatic social posting — setup guide

You asked for each new blog post to be published automatically to your social
networks. A static website can't post to social platforms by itself (that needs
each network's API, authentication and a server running on a schedule). The
reliable, low-maintenance way to do it is to connect the site's **RSS feed** to
an automation tool that watches the feed and posts every new item for you.

Everything on the site side is already in place:

- **RSS feed:** `https://efqmassessors.ae/rss.xml` — updated on every deploy, one
  item per published post, newest first, each with title, link, summary, author
  and the post's **preview image** (as an `<enclosure>` and `<media:content>`),
  so the auto-posts can include the image.
- **Preview images:** every post has a branded 1200×630 image at
  `https://efqmassessors.ae/blog/<slug>.png`, also used as the link-preview
  (Open Graph) image, so even a plain link unfurls with the right visual.

## Option A — Zapier (easiest)

1. Create a Zap with the trigger **RSS → New Item in Feed**.
2. Feed URL: `https://efqmassessors.ae/rss.xml`.
3. Add an action for each network you want (LinkedIn, X, Facebook Pages).
   Zapier has native actions for all three.
4. Map the fields: post text = `Title` + your standard line + `Link`; image =
   the enclosure/media URL. Example text:
   *"New on the blog: {{Title}} — {{Link}} #EFQM #Excellence"*.
5. Turn the Zap on. Every new post now auto-publishes within ~15 minutes.

## Option B — Make (Integromat)

Same idea, more control and usually cheaper at volume. Trigger: **RSS → Watch
RSS feed items**. Then add a module per network (LinkedIn, Facebook, X). Map
title, link and the media URL. Schedule the scenario every 15 minutes.

## Option C — Buffer / Hootsuite / IFTTT

Buffer and Hootsuite can pull an RSS feed and queue posts automatically
(Buffer: *Create → Connect RSS feed*). IFTTT has ready-made "RSS → LinkedIn / X
/ Facebook" applets. These are the simplest but offer the least formatting
control.

## Recommended posting text

Keep a short, consistent template. The 120-day series has two phases you can
hashtag differently:

- Days 1–90 (EFQM Model): `#EFQM #Excellence #Strategy #Leadership`
- Days 91–120 (ISO cases): `#ISO9001 #ISO27001 #ISO14001 #Quality #Compliance`

## Notes

- The daily posts publish on their schedule (a new post each morning); the feed
  only ever contains posts whose date has arrived, so automations won't leak
  unpublished articles.
- Update your real profile URLs in `src/lib/site.js` (the `SOCIAL` array) so the
  footer icons point to the right accounts.
- If you later want fully hands-off posting without a third-party tool, that
  requires a small serverless function (e.g. a Netlify scheduled function) using
  each network's API — happy to add that separately.


## Instagram-ready images (new)

Every post now also has a bold 1080×1350 (4:5) card designed for Instagram at
`https://efqmassessors.ae/social/<slug>.png` — big hook line, day badge, title
and branding. The 1200×630 OG cards in `/blog/` were refreshed with the same
attractive-text layout (hook + title), so link previews and RSS auto-posts get
the new look too.

Regenerate any time with `npm run social` (or `node scripts/gen-social.mjs
<slug>` for a single post). In Zapier/Make, map the Instagram action's image to
`https://efqmassessors.ae/social/{{slug}}.png` and keep the OG image for
LinkedIn/X/Facebook.

## Link previews on LinkedIn & Facebook (photo cards)

The site already bakes Open Graph tags (title, description, absolute
`og:image` 1200×630) into a static HTML file per route at build time
(`scripts/prerender.mjs`), which is exactly what LinkedIn/Facebook crawlers
read — they never run JavaScript. If a shared link shows no photo, it is one
of these two operational issues:

**1. Crawler cache.** Both networks cache the first scrape of a URL (LinkedIn
~7 days, Facebook until forced). If a link was ever shared before the tags
existed, the empty card is cached. Force a re-scrape once after deploying:
- LinkedIn Post Inspector → https://www.linkedin.com/post-inspector/ → paste
  the URL → Inspect (repeat per URL you plan to share).
- Facebook Sharing Debugger → https://developers.facebook.com/tools/debug/ →
  paste URL → "Scrape Again".

**2. Daily posts vs. static build.** Prerender only writes pages for posts
already published *at build time*. A post that goes live after the last
deploy has no static card until the next deploy. Fix it structurally with a
scheduled rebuild:
- Netlify → Site configuration → Build & deploy → Build hooks → Add build
  hook (name it `daily-blog`), copy the URL.
- Create a free daily cron at https://cron-job.org (or any scheduler): POST
  to that URL every day at 06:10 Dubai time (02:10 UTC), just after the new
  post's publication moment.
Each morning Netlify rebuilds, prerender picks up the new post, and its card
(photo included) is live before anyone shares it.

Checklist per shared URL: exact final URL (no tracking params), image loads
at https://efqmassessors.ae/blog/<slug>.png, then Post Inspector once.
